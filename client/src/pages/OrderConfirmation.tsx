import { memo } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import FadeInSection from "@/components/FadeInSection";
import { CartCalculations } from "@/utils/cartCalculations";

interface OrderConfirmationState {
  orderId: number;
  total: number;
  status: string;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const state = location.state as OrderConfirmationState | null;

  if (!state?.orderId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto pt-20 px-4 py-8 max-w-xl text-center">
      <FadeInSection>
        <div className="bg-secondary text-text p-8 rounded-lg shadow-lg">
          <div className="text-4xl mb-4">&#10003;</div>
          <h1 className="text-3xl font-display mb-4">Commande confirmee !</h1>
          <p className="text-lg font-serif mb-6">
            Merci pour votre achat. Votre commande a ete enregistree avec succes.
          </p>

          <div className="bg-primary/10 p-4 rounded-md mb-6 text-left space-y-2">
            <div className="flex justify-between">
              <span className="font-serif">Numero de commande</span>
              <span className="font-bold">#{state.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-serif">Montant total</span>
              <span className="font-bold">{CartCalculations.formatPrice(state.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-serif">Statut</span>
              <span className="font-bold capitalize">{state.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="btn">
              Voir mes commandes
            </Link>
            <Link to="/catalog" className="btn">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default memo(OrderConfirmation);
