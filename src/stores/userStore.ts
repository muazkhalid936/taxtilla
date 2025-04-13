import { create } from "zustand";

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  token: string;
  businessType?: "customer" | "supplier";
  // Add more fields as needed
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  // Optionally, add more actions like clearUser, updateUser, etc.
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));
