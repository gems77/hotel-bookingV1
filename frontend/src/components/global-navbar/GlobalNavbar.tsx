import React from 'react';
import { Link } from 'react-router-dom';

const GlobalNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            STAY BOOKER
          </div>

          {/* Liens de navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" text="HOME" />
            <NavLink to="/hotel-filter" text="HOTELS" />
            <NavLink to="/about-us" text="A PROPOS" />
            <NavLink to="/login" text="SE CONNECTER/S'INSCRIRE" />
          </div>

          {/* Menu mobile (icône hamburger) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Composant helper pour les liens de navigation
interface NavLinkProps {
  to: string;
  text: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, text }) => {
  return (
    <Link 
      to={to} 
      className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
    >
      {text}
    </Link>
  );
};

export default GlobalNavbar;