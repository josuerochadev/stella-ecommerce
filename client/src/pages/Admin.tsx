import FadeInSection from "@/components/FadeInSection";
import { useAuth } from "@/context/AuthContext";
import { httpClient } from "@/services/httpClient";
import { useUserStore } from "@/stores/useUserStore";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

interface DashboardData {
  overview: {
    totalUsers: number;
    totalStars: number;
    totalOrders: number;
    totalRevenue: number;
  };
  recentActivity: {
    recentOrders: Array<{
      id: number;
      status: string;
      totalAmount: number;
      createdAt: string;
    }>;
    recentUsers: Array<{
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
    }>;
  };
}

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

type Tab = "dashboard" | "users" | "stars";

const Admin: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedTabs = useRef<Set<Tab>>(new Set());

  const fetchData = useCallback(async (tab: Tab, force = false) => {
    if (fetchedTabs.current.has(tab) && !force) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (tab === "dashboard") {
        const res = await httpClient.get<{ success: boolean; dashboard: DashboardData }>(
          "/admin/dashboard",
        );
        setDashboard(res.data.dashboard);
      } else if (tab === "users") {
        const res = await httpClient.get<{
          success: boolean;
          data: AdminUser[];
        }>("/admin/users");
        setUsers(res.data.data || []);
      }
      fetchedTabs.current.add(tab);
    } catch {
      setError("Erreur lors du chargement des donnees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchData(activeTab);
    }
  }, [activeTab, isAuthenticated, user?.role, fetchData]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Tableau de bord" },
    { key: "users", label: "Utilisateurs" },
  ];

  return (
    <div className="container mx-auto pt-20 px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-text">Administration</h1>

      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md font-serif transition-colors ${
              activeTab === tab.key
                ? "bg-accent text-white"
                : "bg-secondary text-text hover:bg-primary/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : activeTab === "dashboard" && dashboard ? (
        <DashboardView data={dashboard} />
      ) : activeTab === "users" ? (
        <UsersView users={users} />
      ) : null}
    </div>
  );
};

const DashboardView: React.FC<{ data: DashboardData }> = ({ data }) => {
  const stats = [
    { label: "Utilisateurs", value: data.overview.totalUsers },
    { label: "Etoiles", value: data.overview.totalStars },
    { label: "Commandes", value: data.overview.totalOrders },
    {
      label: "Revenus",
      value: `${(data.overview.totalRevenue || 0).toFixed(2)} €`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <FadeInSection key={stat.label}>
            <div className="bg-secondary text-text p-6 rounded-lg shadow-lg text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-serif text-text/70">{stat.label}</p>
            </div>
          </FadeInSection>
        ))}
      </div>

      {data.recentActivity?.recentOrders?.length > 0 && (
        <FadeInSection>
          <div className="bg-secondary text-text p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-display mb-4">Commandes recentes</h2>
            <div className="space-y-3">
              {data.recentActivity.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border-b border-primary/10 pb-2"
                >
                  <div>
                    <span className="font-serif">#{order.id}</span>
                    <span className="ml-3 text-sm text-text/70 capitalize">{order.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{Number(order.totalAmount).toFixed(2)} €</span>
                    <span className="ml-3 text-xs text-text/50">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}
    </div>
  );
};

const UsersView: React.FC<{ users: AdminUser[] }> = ({ users }) => {
  return (
    <FadeInSection>
      <div className="bg-secondary text-text rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left p-4 font-display">Nom</th>
              <th className="text-left p-4 font-display">Email</th>
              <th className="text-left p-4 font-display">Role</th>
              <th className="text-left p-4 font-display">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-primary/10">
                <td className="p-4 font-serif">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-4 text-sm">{u.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.role === "admin"
                        ? "bg-purple-500/20 text-purple-600"
                        : "bg-blue-500/20 text-blue-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-text/70">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FadeInSection>
  );
};

export default memo(Admin);
