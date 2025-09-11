// client/src/App.tsx

import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ShoppingCart from "./components/ShoppingCart";
import Wishlist from "./components/Wishlist";
import CookieBanner from "./components/CookieBanner";

// Lazy loading of pages
const Home = React.lazy(() => import("./pages/Home"));
const Catalog = React.lazy(() => import("./pages/Catalog"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const AuthContainer = React.lazy(() => import("./components/AuthContainer"));
const Profile = React.lazy(() => import("./components/Profile"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Legal = React.lazy(() => import("./pages/Legal")); // Import en lazy loading
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));


const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is authenticated

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
          <CookieBanner />
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
                <Route path="/cart" element={<ShoppingCart />} /> {/* Shopping Cart */}
                <Route path="/wishlist" element={<Wishlist />} /> {/* Wishlist */}
                <Route path="/legal" element={<Legal />} /> {/* Legal Notice */}
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
