import { create } from "zustand";
import { type PublicUser } from "@thockr/shared";

type AuthState = {
  user: PublicUser | null;
  isInitialized: boolean;
};

type AuthActions = {
  setUser(user: PublicUser | null): void;
  setInitialized(isInitialized: boolean): void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isInitialized: false,
  setInitialized: (isInitialized) => set(() => ({ isInitialized })),
}));
