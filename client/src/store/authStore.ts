import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../@/lib/types";

const authStore = (set: any) => ({
  userProfile: null as User | null,
  addUser: (user: any) => set({ userProfile: user }),
  logout: () => set({ userProfile: null }),
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth",
  })
);

export default useAuthStore;
