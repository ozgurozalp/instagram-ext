import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { User } from "@/src/types";

export interface MainStore {
  unfollowers: User[] | null;
  isInstagram: boolean;
  btnText: () => string;
  noInstagramText: string;
  setUnfollowers: (unfollowers: User[]) => void;
  clearUnfollowers: () => void;
  removeUnfollower: (id: string) => void;
  changeUserLoading: (id: string, loading: boolean) => void;
}

export const useMainStore = create<MainStore>()(
  devtools(
    persist(
      (set, get) => ({
        isInstagram: false,
        noInstagramText: "Instagram'a git",
        unfollowers: null,
        setUnfollowers: (unfollowers) => set({ unfollowers }),
        clearUnfollowers: () => set({ unfollowers: [] }),
        removeUnfollower: (id) =>
          set((state) => ({
            unfollowers: state.unfollowers.filter((user) => user.id !== id),
          })),
        changeUserLoading: (id, loading) => {
          set((state) => ({
            unfollowers: state.unfollowers.map((user) =>
              user.id === id ? { ...user, unFollowLoading: loading } : user
            ),
          }));
        },
        btnText: () => {
          const { unfollowers } = get();
          let text = "Listeyi Yenile";

          if (!unfollowers) {
            text = "Geri Takip Etmeyenleri Göster";
          } else if (unfollowers.length === 0) {
            text = "Yeniden Kontrol Et";
          }

          return text;
        },
      }),
      {
        name: "main-storage",
      }
    )
  )
);
