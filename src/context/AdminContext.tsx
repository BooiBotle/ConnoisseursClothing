import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: { email: string; role: string } | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'tcs_admin_auth_v1';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      return stored === 'true' ? { email: 'curator@theconnoisseurs.co.za', role: 'Store Owner' } : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, pass: string): boolean => {
    // Standard secure admin gate (can also be tied to Supabase auth with role check)
    const validEmail = 'admin@theconnoisseurs.co.za';
    const validPass = 'connoisseur2026';

    if (email.trim().toLowerCase() === validEmail && pass === validPass) {
      setIsAdminAuthenticated(true);
      setAdminUser({ email: validEmail, role: 'Chief Curator' });
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AdminContext.Provider value={{ isAdminAuthenticated, adminUser, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
