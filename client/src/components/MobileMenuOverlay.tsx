// client/src/components/MobileMenuOverlay.tsx
// Responsabilité unique : Menu overlay coulissant avec liens supplémentaires

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-secondary rounded-t-2xl p-6 pb-24 transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-display text-text">Menu</h3>
            <div className="w-12 h-1 bg-primary rounded mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { path: '/about', label: 'À propos', icon: '🌟' },
              { path: '/contact', label: 'Contact', icon: '📞' },
              { path: '/faq', label: 'FAQ', icon: '❓' },
              { path: '/legal', label: 'Mentions légales', icon: '📋' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="mobile-card bg-primary/10 hover:bg-primary/20 transition-colors duration-200 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium text-text">{item.label}</div>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <div className="border-t border-primary/20 pt-4 mt-6">
              <div className="flex justify-around">
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="flex items-center space-x-2 text-text hover:text-special transition-colors"
                >
                  <span>📦</span>
                  <span>Mes commandes</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className="flex items-center space-x-2 text-text hover:text-special transition-colors"
                >
                  <span>⚙️</span>
                  <span>Paramètres</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MobileMenuOverlay);