import { create } from "zustand";

export interface UserState {
  user: any | null;
  settings: Record<string, string>;
  loading: boolean;
  setUser: (user: any | null) => void;
  setSettings: (settings: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  settings: {},
  loading: true,
  setUser: (user) => set({ user }),
  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ loading }),
}));
