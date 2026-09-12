const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://testdii-platform.onrender.com/api";


export interface ApiError {
  message: string;
  status?: number;
}

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "GUEST_DEFAULT_123";
  let guestId = localStorage.getItem("sbti_guest_id");
  if (!guestId) {
    guestId = "GUEST_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
    localStorage.setItem("sbti_guest_id", guestId);
  }
  return guestId;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("testdii_token");
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const primaryUrl = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Create AbortSignal timeout so requests allow Render free tier cold starts (15s)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);


  try {
    const res = await fetch(primaryUrl, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `API Error (${res.status})`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // ignore JSON parse error
      }
      throw { message: errorMessage, status: res.status } as ApiError;
    }

    return (await res.json()) as T;
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If 127.0.0.1 fails, attempt localhost fallback quickly
    if (!API_BASE_URL.includes("localhost") && primaryUrl.includes("127.0.0.1")) {
      const fallbackUrl = primaryUrl.replace("127.0.0.1", "localhost");
      try {
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 3000);
        const resFallback = await fetch(fallbackUrl, {
          ...options,
          headers,
          signal: fallbackController.signal,
        });
        clearTimeout(fallbackTimeout);
        if (resFallback.ok) {
          return (await resFallback.json()) as T;
        }
      } catch {
        // continue to throw standard error
      }
    }

    if (err.status) {
      throw err;
    }

    throw {
      message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.",
      status: 0,
    } as ApiError;
  }
}

export { API_BASE_URL };
