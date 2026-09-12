import { apiClient, getOrCreateGuestId } from "./apiClient";

export interface UserProfile {
  _id: string;
  email?: string;
  username?: string;
  role: "user" | "admin";
  isGuest: boolean;
}

export const authApi = {
  /**
   * Register guest ID session with backend
   */
  initGuestSession: async (): Promise<{ guestId: string }> => {
    const guestId = getOrCreateGuestId();
    try {
      await apiClient<{ guestId: string }>("/auth/guest", {
        method: "POST",
        body: JSON.stringify({ guestId }),
      });
    } catch {
      // Guest initialization fails gracefully offline
    }
    return { guestId };
  },

  /**
   * Get current authenticated user session if token exists
   */
  getCurrentUser: async (): Promise<UserProfile | null> => {
    try {
      const res = await apiClient<{ user: UserProfile }>("/auth/me");
      return res.user;
    } catch {
      return null;
    }
  },
};
