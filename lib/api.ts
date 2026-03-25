const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://e-doctorpharma.onrender.com/api/v1";
const API_PREFIX = "/admin/dashboard";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail || `Erreur ${res.status}`);
  }
  return res.json();
}

const get   = <T>(url: string) => apiFetch<T>(url);
const post  = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: "POST", body: JSON.stringify(body) });
const patch = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: "PATCH", body: JSON.stringify(body) });
const del   = <T>(url: string) => 
  apiFetch<T>(url, { method: "DELETE" });

export const patientsApi = {
  list:   (page = 1) => 
    get(`${API_PREFIX}/patients/?page=${page}`),
  get:    (id: string) =>
    get(`${API_PREFIX}/patients/${id}/`),
  create: (data: unknown) => 
    post(`${API_PREFIX}/patients/`, data),
  update: (id: string, data: unknown) =>
    patch(`${API_PREFIX}/patients/${id}/`, data),
  delete: (id: string) => 
    del(`${API_PREFIX}/patients/${id}/`),
};

export const livreursApi = {
  list:         (page = 1) =>
    get(`${API_PREFIX}/drivers/?page=${page}`),
  get:          (id: string) =>
    get(`${API_PREFIX}/drivers/${id}/`),
  create:       (data: unknown) =>
    post(`${API_PREFIX}/drivers/`, data),
  update:       (id: string, data: unknown) =>
    patch(`${API_PREFIX}/drivers/${id}/`, data),
  delete:       (id: string) =>
    del(`${API_PREFIX}/drivers/${id}/`),
  activate:     (id: string) =>
    post(`${API_PREFIX}/drivers/${id}/activate/`),
  deactivate:   (id: string) =>
    post(`${API_PREFIX}/drivers/${id}/deactivate/`),
  approve:      (id: string) =>
    post(`${API_PREFIX}/drivers/${id}/approve/`),
  reject:       (id: string, reason?: string) =>
    post(`${API_PREFIX}/drivers/${id}/reject/`, reason ? { rejection_reason: reason } : undefined),
  pendingCount: () =>
    get<{ count: number }>(`${API_PREFIX}/drivers/?onboarding_status=PENDING&page=1`),
};

export const pharmaciesApi = {
  list:         (page = 1) =>
    get(`${API_PREFIX}/officines/?page=${page}`),
  get:          (id: string) =>
    get(`${API_PREFIX}/officines/${id}/`),
  create:       (data: unknown) =>
    post(`${API_PREFIX}/officines/`, data),
  update:         (id: string, data: unknown) =>
    patch(`${API_PREFIX}/officines/${id}/`, data),
  delete:         (id: string) =>
    del(`${API_PREFIX}/officines/${id}/`),
  toggleActivate: (id: string) =>
    post(`${API_PREFIX}/officines/${id}/toggle-activate/`),
};

export const commandesApi = {
  list:        (page = 1, status?: string) =>
    get(`${API_PREFIX}/orders/?page=${page}${status ? `&status=${status}` : ""}`),
  get:         (id: string) =>
    get(`/order/${id}/`),
  byOfficine:  (id: string) =>
    get(`${API_PREFIX}/orders/by-officine/${id}/`),
  byPatient:   (id: string) =>
    get(`${API_PREFIX}/orders/by-patient/${id}/`),
  kpi:         () => get(`${API_PREFIX}/orders/kpi/`),
  dailyAmount: () => get(`${API_PREFIX}/orders/daily-amount/`),
  filter:      (params: string) =>
    get(`${API_PREFIX}/orders/filter/?${params}`),
};

export const missionsApi = {
  list:             (page = 1, status?: string) =>
    get(`${API_PREFIX}/missions/?page=${page}${status ? `&status=${status}` : ""}`),
  filter:           (params: string) =>
    get(`${API_PREFIX}/missions/filter/?${params}`),
  pickupByOfficine: (id: string) =>
    get(`${API_PREFIX}/pickups/by-officine/${id}/`),
};

export const walletApi = {
  list: () => get(`/wallet-app/`),
  get:  (id: string) => get(`/wallet-app/${id}/`),
};
