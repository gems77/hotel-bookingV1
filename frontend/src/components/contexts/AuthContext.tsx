/*
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';

interface UserDetails {
  id: string;
  email: string;
  name?: string;
  // Ajoutez d'autres propriétés utilisateur au besoin
}

interface AuthContextType {
  isAuthenticated: boolean;
  userDetails: UserDetails | null;
  triggerAuthCheck: () => void;
}

interface AuthResponse {
  data: {
    isAuthenticated: boolean;
    userDetails: UserDetails | null;
  };
  errors?: string[];
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and user details to the application.
 * @namespace AuthProvider
 * @component
 */
/*
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [authCheckTrigger, setAuthCheckTrigger] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await networkAdapter.get<AuthResponse>('api/users/auth-user');
        
        if (response?.data) {
          setIsAuthenticated(response.data.isAuthenticated);
          setUserDetails(response.data.userDetails);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setUserDetails(null);
      }
    };

    checkAuthStatus();
  }, [authCheckTrigger]);

  const triggerAuthCheck = (): void => {
    setAuthCheckTrigger((prev) => !prev);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    userDetails,
    triggerAuthCheck
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
*/