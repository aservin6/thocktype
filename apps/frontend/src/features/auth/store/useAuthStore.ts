import { create } from "zustand";
import { type PublicUser } from "@typing-test/shared";

type AuthState = {
  user: PublicUser | null;
};

type AuthActions = {
  setUser(user: PublicUser | null): void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));
