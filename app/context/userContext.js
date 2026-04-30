"use client";
import { create } from "zustand";

export const UserDataStore = create((set) => ({
  user: "",
  isAuthenticated: "",
  setUser: (val) => set({ user: val }),
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  clear: () => set({ user: "", isAuthenticated: "" }),
}));
