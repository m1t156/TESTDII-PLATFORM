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
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://testdii-platform.onrender.com/api";
  const cleanBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const primaryUrl = `${cleanBaseUrl}${formattedEndpoint}`;
  
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Create AbortSignal timeout for Render free tier cold starts (15s)
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
  } catch (primaryErr: any) {
    clearTimeout(timeoutId);

    // Fallback: If primary URL failed and it wasn't already the direct Render URL, retry directly against live Render Backend
    const liveRenderUrl = `https://testdii-platform.onrender.com/api${formattedEndpoint}`;
    if (primaryUrl !== liveRenderUrl) {
      try {
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 15000);
        const retryRes = await fetch(liveRenderUrl, {
          ...options,
          headers,
          signal: retryController.signal,
        });
        clearTimeout(retryTimeout);

        if (retryRes.ok) {
          return (await retryRes.json()) as T;
        }
      } catch (retryErr) {
        console.error("Retry to live Render backend failed:", retryErr);
      }
    }

    if (primaryErr.status) {
      throw primaryErr;
    }

    throw {
      message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.",
      status: 0,
    } as ApiError;
  }
}


export { API_BASE_URL };
