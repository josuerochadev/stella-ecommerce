import FadeInSection from "@/components/FadeInSection";
import SEO from "@/components/SEO";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/orderService";
import { memo, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

interface OrderDetail {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  User?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  OrderItems?: Array<{
    quantity: number;
    Star: {
      starid: number;
      name: string;
      constellation: string;
      magnitude: number;
      distanceFromEarth: number;
      luminosity: number;
    };
  }>;
}

const Certificate: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;
        const response = await OrderService.getOrderDetails(orderId);
        setOrder((response as unknown as { data: OrderDetail }).data);
      } catch (_err) {
        setError("Impossible de charger le certificat.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (loading) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center text-text">
        <p>Chargement du certificat...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <p className="text-red-400">{error || "Commande introuvable."}</p>
      </div>
    );
  }

  const ownerName = order.User ? `${order.User.firstName} ${order.User.lastName}` : "Proprietaire";
  const purchaseDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certificateId = `STELLA-${order.id.toString().padStart(6, "0")}`;

  return (
    <div className="container mx-auto pt-20 px-4 py-8 max-w-4xl">
      <SEO
        title="Certificat de propriete stellaire"
        description="Votre certificat officiel de propriete d'etoile Stella."
        path={`/certificate/${orderId}`}
      />

      {/* Bouton imprimer - masqué à l'impression */}
      <div className="print:hidden mb-6 flex justify-end">
        <button type="button" onClick={handlePrint} className="btn btn-primary">
          Imprimer le certificat
        </button>
      </div>

      <FadeInSection>
        <div
          ref={certificateRef}
          className="relative bg-surface-2 rounded-lg shadow-2xl overflow-hidden print:shadow-none print:bg-white"
        >
          {/* Bordure décorative */}
          <div className="absolute inset-0 rounded-lg border-2 border-cyan-400/30 pointer-events-none" />
          <div className="absolute inset-2 rounded-lg border border-purple-500/20 pointer-events-none" />

          {/* Coins décoratifs */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50" />

          <div className="px-4 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16 text-center">
            {/* En-tête */}
            <div className="mb-8">
              <div className="text-cyan-400 text-sm tracking-[0.3em] uppercase mb-2 font-serif">
                Stella - Registre Stellaire Officiel
              </div>
              <h1 className="text-3xl sm:text-4xl font-display text-text mb-2">
                Certificat de Propriete
              </h1>
              <h2 className="text-lg sm:text-xl font-display text-purple-300">Etoile Nommee</h2>
            </div>

            {/* Séparateur */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400/50" />
              <div className="text-cyan-400 text-2xl">&#9733;</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400/50" />
            </div>

            {/* Étoiles de la commande */}
            {order.OrderItems && order.OrderItems.length > 0 ? (
              <div className="space-y-10 mb-10">
                {order.OrderItems.map((item, index) => (
                  <div key={index}>
                    <div className="text-4xl sm:text-5xl font-display text-text mb-4">
                      {item.Star.name}
                    </div>

                    <div className="text-sm text-text/60 uppercase tracking-widest mb-6">
                      Constellation {item.Star.constellation}
                    </div>

                    {/* Détails de l'étoile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
                      <div className="bg-surface-1 rounded-md p-3">
                        <div className="text-xs text-text/50 uppercase tracking-wider">
                          Magnitude
                        </div>
                        <div className="text-lg font-display text-text">{item.Star.magnitude}</div>
                      </div>
                      <div className="bg-surface-1 rounded-md p-3">
                        <div className="text-xs text-text/50 uppercase tracking-wider">
                          Distance
                        </div>
                        <div className="text-lg font-display text-text">
                          {item.Star.distanceFromEarth} al
                        </div>
                      </div>
                      <div className="bg-surface-1 rounded-md p-3">
                        <div className="text-xs text-text/50 uppercase tracking-wider">
                          Luminosite
                        </div>
                        <div className="text-lg font-display text-text">
                          {item.Star.luminosity} L
                        </div>
                      </div>
                    </div>

                    {item.quantity > 1 && (
                      <div className="text-sm text-text/60">Quantite : {item.quantity}</div>
                    )}

                    {index < (order.OrderItems?.length ?? 0) - 1 && (
                      <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="h-px w-12 bg-purple-500/30" />
                        <div className="text-purple-400/50 text-sm">&#9733;</div>
                        <div className="h-px w-12 bg-purple-500/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-text/50 mb-10">Aucune etoile associee a cette commande.</div>
            )}

            {/* Séparateur */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
              <div className="text-purple-400 text-sm">&#9830;</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>

            {/* Propriétaire */}
            <div className="mb-8">
              <div className="text-sm text-text/50 uppercase tracking-widest mb-2">
                Certifie propriete de
              </div>
              <div className="text-2xl font-display text-text">{ownerName}</div>
            </div>

            {/* Infos du certificat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto mb-10 text-left">
              <div>
                <div className="text-xs text-text/40 uppercase tracking-wider">
                  Date d'acquisition
                </div>
                <div className="text-sm text-text/80 font-serif">{purchaseDate}</div>
              </div>
              <div>
                <div className="text-xs text-text/40 uppercase tracking-wider">
                  N° de certificat
                </div>
                <div className="text-sm text-text/80 font-serif">{certificateId}</div>
              </div>
            </div>

            {/* Signature */}
            <div className="border-t border-purple-500/20 pt-6 max-w-xs mx-auto">
              <div className="text-lg font-display text-cyan-400/80 italic mb-1">Stella</div>
              <div className="text-xs text-text/40 uppercase tracking-widest">
                Registre Stellaire International
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default memo(Certificate);
