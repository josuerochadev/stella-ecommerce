import FadeInSection from "@/components/FadeInSection";
import FormInput from "@/components/FormInput";
import SEO from "@/components/SEO";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/orderService";
import { useCartStore } from "@/stores/useCartStore";
import type { OrderData } from "@/types";
import { CartCalculations } from "@/utils/cartCalculations";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PAYMENT_METHODS = [
  { value: "credit_card" as const, label: "Carte bancaire" },
  { value: "paypal" as const, label: "PayPal" },
  { value: "bank_transfer" as const, label: "Virement bancaire" },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, clearCart } = useCartStore();
  const stats = CartCalculations.getCartStats(cartItems);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "France",
  });
  const [paymentMethod, setPaymentMethod] = useState<OrderData["paymentMethod"]>("credit_card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const orderData: OrderData = {
        items: cartItems.map((item) => ({
          starId: item.starId,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const response = await OrderService.createOrder(orderData);
      await clearCart();
      navigate("/order-confirmation", {
        state: {
          orderId: response.data?.id,
          total: stats.totalAmount,
          status: "pending",
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto pt-20 px-4 py-8 max-w-4xl">
      <SEO
        title="Finaliser la commande"
        description="Completez votre commande d'etoile. Renseignez votre adresse de livraison et choisissez votre mode de paiement."
        path="/checkout"
      />
      <h1 className="text-3xl font-bold mb-8 text-text">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FadeInSection>
              <div className="bg-secondary text-text p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-display mb-4">Adresse de livraison</h2>
                <div className="space-y-4">
                  <FormInput
                    label="Rue"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="123 Rue des Etoiles"
                    isRequired
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Ville"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="Paris"
                      isRequired
                    />
                    <FormInput
                      label="Code postal"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      placeholder="75000"
                      isRequired
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Region"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="Ile-de-France"
                      isRequired
                    />
                    <FormInput
                      label="Pays"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      isRequired
                    />
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="bg-secondary text-text p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-display mb-4">Methode de paiement</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-3 rounded-md cursor-pointer border-2 transition-colors ${
                        paymentMethod === method.value
                          ? "border-accent bg-accent/10"
                          : "border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        className="mr-3"
                      />
                      <span className="font-serif">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>

          <div className="lg:col-span-1">
            <FadeInSection>
              <div className="bg-secondary text-text p-6 rounded-lg shadow-lg md:sticky top-24">
                <h2 className="text-xl font-display mb-4">Recapitulatif</h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.Star.name} x{item.quantity}
                      </span>
                      <span>{CartCalculations.formatPrice(item.Star.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <hr className="my-4 border-primary/20" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{stats.formattedTotal}</span>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 btn btn-primary"
                >
                  {isSubmitting ? "Traitement en cours..." : "Confirmer la commande"}
                </button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(Checkout);
