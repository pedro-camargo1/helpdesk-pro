// ─────────────────────────────────────────────
// HelpDesk Pro — Auth Store (Zustand)
// ─────────────────────────────────────────────

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthState } from "@/types";

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ── State ──
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Actions ──
      setAuth: (user: User, token: string) => {
        // Also persist token in localStorage for Axios interceptor
        if (typeof window !== "undefined") {
          localStorage.setItem("helpdesk_token", token);
        }
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("helpdesk_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: "helpdesk-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─────────────────────────────────────────────
// UI Store — Theme, sidebar, notifications
// ─────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: UIState["theme"]) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "system",

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "helpdesk-ui",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
    }
  )
);

// ─────────────────────────────────────────────
// Ticket Filters Store
// ─────────────────────────────────────────────

import type { TicketFilters } from "@/types";

interface FiltersStore {
  filters: TicketFilters;
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: TicketFilters = {
  search: "",
  status: "all",
  priority: "all",
  category_id: "all",
  page: 1,
  per_page: 15,
  sort_by: "created_at",
  sort_order: "desc",
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: defaultFilters,

  setFilters: (newFilters: Partial<TicketFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
