// client/src/App.tsx

import React, { Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import CookieBanner from "./components/CookieBanner";
import ErrorBoundary from "./components/ErrorBoundary";
import FeatureErrorBoundary from "./components/FeatureErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { MobileNavigation } from "./components/MobileNavigation";
import NotificationProvider from "./components/NotificationProvider";
import ShoppingCart from "./components/ShoppingCart";
import SkipLinks from "./components/SkipLinks";
import Wishlist from "./components/Wishlist";
import { useAuth } from "./context/AuthContext";

// Lazy loading of pages
const Home = React.lazy(() => import("./pages/Home"));
const Catalog = React.lazy(() => import("./pages/Catalog"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const AuthContainer = React.lazy(() => import("./components/AuthContainer"));
const Profile = React.lazy(() => import("./components/Profile"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Legal = React.lazy(() => import("./pages/Legal"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderConfirmation = React.lazy(() => import("./pages/OrderConfirmation"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Component to handle auth unauthorized events
const AuthEventListener: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<{ redirectTo: string }>;
      navigate(customEvent.detail.redirectTo);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <AuthEventListener />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Stella",
            url: "https://stella-ecommerce.fr",
            description: "Adoptez une etoile et offrez un cadeau unique.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+33-1-23-45-67-89",
              contactType: "customer service",
              availableLanguage: "French",
            },
          })}
        </script>
      </Helmet>
      <ErrorBoundary>
        <SkipLinks />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main id="main-content" className="flex-grow pb-16 md:pb-0">
            <CookieBanner />
            <NotificationProvider />
            <Suspense fallback={<div className="text-center text-text">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} /> {/* Home page */}
                <Route path="/auth" element={<AuthContainer />} /> {/* Login/Signup */}
                <Route
                  path="/profile"
                  element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />}
                />{" "}
                {/* Profile */}
                <Route path="/catalog" element={<Catalog />} /> {/* Catalog */}
                <Route path="/star/:starid" element={<ProductDetail />} /> {/* Star detail */}
                <Route path="/about" element={<About />} /> {/* About */}
                <Route path="/contact" element={<Contact />} /> {/* Contact */}
                <Route path="/faq" element={<FAQ />} /> {/* FAQ */}
                <Route
                  path="/cart"
                  element={
                    <FeatureErrorBoundary featureName="le panier">
                      <ShoppingCart />
                    </FeatureErrorBoundary>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    isAuthenticated ? (
                      <FeatureErrorBoundary featureName="le paiement">
                        <Checkout />
                      </FeatureErrorBoundary>
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={isAuthenticated ? <OrderConfirmation /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/orders"
                  element={
                    isAuthenticated ? (
                      <FeatureErrorBoundary featureName="les commandes">
                        <Orders />
                      </FeatureErrorBoundary>
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
                <Route
                  path="/admin"
                  element={
                    isAuthenticated ? (
                      <FeatureErrorBoundary featureName="l'administration">
                        <Admin />
                      </FeatureErrorBoundary>
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <MobileNavigation />
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
