import { create } from 'zustand';

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}

export type PendingAction = {
  type: 'cart' | 'wishlist';
  item?: unknown;
  slug?: string;
};

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingAction: PendingAction | null;
  ready: boolean;

  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (email: string, password: string, name?: string) => Promise<boolean>;
  loginWithGoogle: (accessToken: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrateAuth: () => void;
  setPendingAction: (action: PendingAction) => void;
  clearPendingAction: () => void;
  
  // Aliases for compatibility with the rest of your app
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingAction: null,
  ready: false, // Start as false so the app knows it is hydrating

  hydrateAuth: () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          set({ token, user: JSON.parse(userStr), isAuthenticated: true, ready: true });
          return;
        }
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    set({ ready: true });
  },

  clearError: () => set({ error: null }),
  setPendingAction: (action) => set({ pendingAction: action }),
  clearPendingAction: () => set({ pendingAction: null }),

loginWithEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    
    // 1. Force lowercase and remove accidental spaces
    const cleanEmail = email.toLowerCase().trim(); 

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: cleanEmail, // Safely satisfies the base serializer
          email: cleanEmail,    // Satisfies allauth
          password: password 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.non_field_errors?.[0] || 'Invalid credentials');

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access || data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      set({
        token: data.access || data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        ready: true,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  signupWithEmail: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: name || email.split('@')[0], // Passes the name, or uses email prefix as backup
          email: email, 
          password1: password, 
          password2: password 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.email?.[0] || data.password1?.[0] || 'Registration failed');

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access || data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      set({
        token: data.access || data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        ready: true,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  loginWithGoogle: async (accessToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Google authentication failed');

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access || data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      set({
        token: data.access || data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        ready: true,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Google Auth failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false, ready: true, pendingAction: null });
  },

  // Aliases bound directly to the store to prevent render loops
  signIn: async (email, password) => get().loginWithEmail(email, password),
  signOut: () => get().logout(),
}));

// Automatically hydrate on the client as soon as the module loads!
if (typeof window !== 'undefined') {
  useAuthStore.getState().hydrateAuth();
}

// Clean, standard hook that will not crash SSR
export function useAuth() {
  return useAuthStore();
}

export const setPendingAction = (action: PendingAction) => {
  useAuthStore.getState().setPendingAction(action);
};