import type { Trip } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const JWT_STORAGE_KEY = "hpt-jwt";

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  exp: number;
}

export function getJwt(): string | null {
  return localStorage.getItem(JWT_STORAGE_KEY);
}

export function setJwt(token: string) {
  localStorage.setItem(JWT_STORAGE_KEY, token);
}

export function clearJwt() {
  localStorage.removeItem(JWT_STORAGE_KEY);
}

// 只做解碼，不驗證簽章──簽章驗證交給後端在每次 API 呼叫時做，這裡純粹是為了在 UI 顯示使用者資訊
export function decodeJwt(token: string): JwtPayload {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

  return JSON.parse(new TextDecoder("utf-8").decode(bytes));
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const jwt = getJwt();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(
      res.status,
      `${options.method ?? "GET"} ${path} 失敗（${res.status}）`,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export interface AuthResponse {
  token: string;
}

export function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export interface TripRequestBody {
  date: string;
  peakIds: number[];
  note?: string;
}

export function fetchTrips(): Promise<Trip[]> {
  return request<Trip[]>("/api/trips");
}

export function createTrip(body: TripRequestBody): Promise<Trip> {
  return request<Trip>("/api/trips", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateTrip(id: string, body: TripRequestBody): Promise<Trip> {
  return request<Trip>(`/api/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteTrip(id: string): Promise<void> {
  return request<void>(`/api/trips/${id}`, {
    method: "DELETE",
  });
}
