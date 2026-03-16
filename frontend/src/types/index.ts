// ─────────────────────────────────────────────
// HelpDesk Pro — TypeScript Type Definitions
// ─────────────────────────────────────────────

// ── Auth ──────────────────────────────────────

export type UserRole = "admin" | "agent" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  department?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

// ── Tickets ───────────────────────────────────

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: Category;
  assignee?: User;
  reporter: User;
  tags?: string[];
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface TicketDetail extends Ticket {
  comments: Comment[];
  history: TicketHistory[];
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
  category_id: number;
  assignee_id?: string;
}

export interface UpdateTicketPayload extends Partial<CreateTicketPayload> {
  status?: TicketStatus;
}

// ── Comments ──────────────────────────────────

export interface Comment {
  id: string;
  ticket_id: string;
  user: User;
  body: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentPayload {
  body: string;
  is_internal?: boolean;
}

// ── History ───────────────────────────────────

export interface TicketHistory {
  id: number;
  ticket_id: string;
  user: User;
  action: string;
  from_value?: string;
  to_value?: string;
  created_at: string;
}

// ── Dashboard ─────────────────────────────────

export interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  avg_resolution_hours: number;
  tickets_this_week: number;
  tickets_change_percent: number;
}

export interface ChartDataPoint {
  date: string;
  opened: number;
  resolved: number;
  closed: number;
}

export interface PriorityBreakdown {
  priority: TicketPriority;
  count: number;
  percentage: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  color: string;
}

export interface DashboardCharts {
  weekly_trend: ChartDataPoint[];
  priority_breakdown: PriorityBreakdown[];
  category_breakdown: CategoryBreakdown[];
  agent_performance: AgentPerformance[];
}

export interface AgentPerformance {
  user: User;
  resolved: number;
  avg_hours: number;
  satisfaction: number;
}

// ── API ───────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ── Filters ───────────────────────────────────

export interface TicketFilters {
  search?: string;
  status?: TicketStatus | "all";
  priority?: TicketPriority | "all";
  category_id?: number | "all";
  assignee_id?: string | "all";
  page?: number;
  per_page?: number;
  sort_by?: "created_at" | "updated_at" | "priority";
  sort_order?: "asc" | "desc";
}

// ── Settings ─────────────────────────────────

export interface UserSettings {
  theme: "light" | "dark" | "system";
  email_notifications: boolean;
  browser_notifications: boolean;
  notification_on_assign: boolean;
  notification_on_comment: boolean;
  notification_on_status_change: boolean;
}
