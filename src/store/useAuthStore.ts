import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  user_id: string;
  full_name: string;
  is_new_user?: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any) => ({
      accessToken: null as string | null,
      user: null as User | null,
      setAuth: (token, user) => set({ accessToken: token, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'auth-storage',
      // By default it uses localStorage, but user requested sessionStorage for the token in the prompt notes,
      // wait, the prompt says "JWT simpan di memory + fallback ke sessionStorage sesuai kebijakan app."
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
