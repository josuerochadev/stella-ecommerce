import FadeInSection from "@/components/FadeInSection";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types";
import { CartCalculations } from "@/utils/cartCalculations";
import { memo, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expediee",
  delivered: "Livree",
  cancelled: "Annulee",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-600",
  processing: "bg-blue-500/20 text-blue-600",
  shipped: "bg-purple-500/20 text-purple-600",
  delivered: "bg-green-500/20 text-green-600",
  cancelled: "bg-red-500/20 text-red-600",
};

const Orders: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getUserOrders();
        setOrders(response.data || []);
      } catch (_err) {
        setError("Impossible de charger vos commandes.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (loading) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <p>Chargement des commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-text">Mes commandes</h1>

      {orders.length === 0 ? (
        <FadeInSection>
          <div className="text-center py-12">
            <p className="text-lg font-serif mb-4">Vous n'avez pas encore de commande.</p>
            <a href="/catalog" className="btn">
              Decouvrir notre catalogue
            </a>
          </div>
        </FadeInSection>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <FadeInSection key={order.id}>
              <div className="bg-secondary text-text p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-display">Commande #{order.id}</h2>
                    <p className="text-sm text-text/70">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                      STATUS_COLORS[order.status]
                    }`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-primary/20">
                  <span className="font-serif">Total</span>
                  <span className="text-lg font-bold">
                    {CartCalculations.formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Orders);
