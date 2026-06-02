import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SchoolState {
  token: string | null;
  isValidated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set: any) => ({
      token: null as string | null,
      isValidated: false as boolean,
      setToken: (token) => set({ token, isValidated: true }),
      clearToken: () => set({ token: null, isValidated: false }),
    }),
    {
      name: 'school-token-storage',
      storage: createJSONStorage(() => sessionStorage), // ensure it's imported
    }
  )
);
