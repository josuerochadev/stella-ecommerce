// client/src/App.tsx

import React, { Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ShoppingCart from "./components/ShoppingCart";
import Wishlist from "./components/Wishlist";
import CookieBanner from "./components/CookieBanner";
import NotificationProvider from "./components/NotificationProvider";
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

// Component to handle auth unauthorized events
const AuthEventListener: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<{ redirectTo: string }>;
      navigate(customEvent.detail.redirectTo);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <AuthEventListener />
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
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
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/auth" />} />
                <Route path="/order-confirmation" element={isAuthenticated ? <OrderConfirmation /> : <Navigate to="/auth" />} />
                <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/auth" />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* Privacy Policy */}
                <Route path="*" element={<Navigate to="/" />} /> {/* Default redirect to home page */}
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
