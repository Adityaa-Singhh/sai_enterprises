import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  status: 'ACTIVE' | 'DISABLED';
}

export type Permission = 
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'categories.manage'
  | 'brands.manage'
  | 'gallery.manage'
  | 'testimonials.manage'
  | 'faqs.manage'
  | 'enquiries.view'
  | 'enquiries.manage'
  | 'enquiries.updateStatus'
  | 'business.edit'
  | 'content.edit'
  | 'users.manage'
  | 'analytics.view'
  | 'settings.manage'
  | 'security.manage'
  | 'activity.view';

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.manage', 'brands.manage', 'gallery.manage', 'testimonials.manage',
    'faqs.manage', 'enquiries.view', 'enquiries.manage', 'enquiries.updateStatus',
    'business.edit', 'content.edit', 'users.manage', 'analytics.view',
    'settings.manage', 'security.manage', 'activity.view'
  ],
  MANAGER: [
    'products.view', 'products.create', 'products.edit',
    'categories.manage', 'brands.manage', 'gallery.manage', 'testimonials.manage',
    'faqs.manage', 'enquiries.view', 'enquiries.manage', 'enquiries.updateStatus',
    'content.edit', 'analytics.view', 'activity.view'
  ],
  STAFF: [
    'products.view', 'enquiries.view', 'enquiries.updateStatus', 'activity.view'
  ]
};

// Initial Demo/Development Accounts
export const DEMO_ACCOUNTS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Ashish Shaw',
    email: 'owner@saienterprises.in',
    role: 'OWNER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 79786 72521',
    lastLogin: 'Today, 02:45 PM',
    status: 'ACTIVE',
  },
  {
    id: 'user-2',
    name: 'Vikram Mehta',
    email: 'manager@saienterprises.in',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43211',
    lastLogin: 'Today, 11:30 AM',
    status: 'ACTIVE',
  },
  {
    id: 'user-3',
    name: 'Anjali Verma',
    email: 'staff@saienterprises.in',
    role: 'STAFF',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43212',
    lastLogin: 'Yesterday, 06:15 PM',
    status: 'ACTIVE',
  }
];

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'saienterprises_admin_user';
const STORAGE_KEY_TOKEN = 'saienterprises_admin_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default initial mock logged-in state for smooth developer experience
    return DEMO_ACCOUNTS[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || 'demo_jwt_token_owner_sai_enterprises';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate network API request
    await new Promise((resolve) => setTimeout(resolve, 700));

    const found = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      setError('Invalid email or password. Please verify your credentials.');
      setIsLoading(false);
      return false;
    }

    if (found.status === 'DISABLED') {
      setError('This account has been disabled. Please contact the administrator.');
      setIsLoading(false);
      return false;
    }

    if (pass.length < 4) {
      setError('Password is required (min 4 characters).');
      setIsLoading(false);
      return false;
    }

    const mockToken = `jwt_token_${found.role.toLowerCase()}_${Date.now()}`;
    setUser(found);
    setToken(mockToken);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  const switchRole = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((a) => a.role === role) || {
      id: `user-${role.toLowerCase()}`,
      name: `${role} User`,
      email: `${role.toLowerCase()}@saienterprises.in`,
      role,
      status: 'ACTIVE'
    };
    setUser(demo);
    setToken(`jwt_token_${role.toLowerCase()}_${Date.now()}`);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        switchRole,
        hasPermission,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
