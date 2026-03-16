// ─────────────────────────────────────────────
// HelpDesk Pro — Custom React Hooks
// ─────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi, dashboardApi, usersApi, categoriesApi } from "@/lib/api";
import type {
  Ticket,
  TicketDetail,
  DashboardStats,
  DashboardCharts,
  TicketFilters,
  CreateTicketPayload,
  UpdateTicketPayload,
  PaginatedResponse,
  User,
} from "@/types";
import { debounce } from "@/lib/utils";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// useTickets — Paginated list with filters
// ─────────────────────────────────────────────

export function useTickets(filters: TicketFilters) {
  return useQuery<PaginatedResponse<Ticket>>({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const res = await ticketsApi.list(filters as Record<string, unknown>);
      return res.data;
    },
    placeholderData: (prev) => prev, // keep old data while fetching
  });
}

// ─────────────────────────────────────────────
// useTicket — Single ticket detail
// ─────────────────────────────────────────────

export function useTicket(id: string) {
  return useQuery<TicketDetail>({
    queryKey: ["tickets", id],
    queryFn: async () => {
      const res = await ticketsApi.get(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

// ─────────────────────────────────────────────
// useCreateTicket
// ─────────────────────────────────────────────

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketPayload) =>
      ticketsApi.create(data as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Chamado criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar chamado. Tente novamente.");
    },
  });
}

// ─────────────────────────────────────────────
// useUpdateTicket
// ─────────────────────────────────────────────

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTicketPayload) =>
      ticketsApi.update(id, data as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Chamado atualizado!");
    },
    onError: () => {
      toast.error("Erro ao atualizar chamado.");
    },
  });
}

// ─────────────────────────────────────────────
// useDeleteTicket
// ─────────────────────────────────────────────

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Chamado excluído.");
    },
    onError: () => {
      toast.error("Erro ao excluir chamado.");
    },
  });
}

// ─────────────────────────────────────────────
// useAddComment
// ─────────────────────────────────────────────

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { body: string; is_internal?: boolean }) =>
      ticketsApi.addComment(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", ticketId] });
      toast.success("Comentário adicionado!");
    },
    onError: () => {
      toast.error("Erro ao adicionar comentário.");
    },
  });
}

// ─────────────────────────────────────────────
// useDashboard — Stats + charts combined
// ─────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data.data;
    },
    staleTime: 1000 * 30, // 30s
    refetchInterval: 1000 * 60, // auto-refresh every 1 min
  });
}

export function useDashboardCharts() {
  return useQuery<DashboardCharts>({
    queryKey: ["dashboard", "charts"],
    queryFn: async () => {
      const res = await dashboardApi.getCharts();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ─────────────────────────────────────────────
// useUsers — User list
// ─────────────────────────────────────────────

export function useUsers(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await usersApi.list(params);
      return res.data;
    },
  });
}

// ─────────────────────────────────────────────
// useCategories
// ─────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoriesApi.list();
      return res.data.data;
    },
    staleTime: Infinity, // categories rarely change
  });
}

// ─────────────────────────────────────────────
// useDebounce — debounce a value (e.g., search)
// ─────────────────────────────────────────────

export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// ─────────────────────────────────────────────
// useClickOutside — close dropdowns/modals
// ─────────────────────────────────────────────

export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callback]);

  return ref;
}

// ─────────────────────────────────────────────
// useLocalStorage — typed localStorage hook
// ─────────────────────────────────────────────

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
        /* ignore */
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// ─────────────────────────────────────────────
// useMediaQuery — responsive helpers
// ─────────────────────────────────────────────

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1024px)");
