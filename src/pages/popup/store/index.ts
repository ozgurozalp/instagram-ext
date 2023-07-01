import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { User } from "@src/types";

export interface MainStore {
  unfollowers: User[];
  setUnfollowers: (unfollowers: User[]) => void;
  clearUnfollowers: () => void;
  removeUnfollower: (id: string) => void;
  changeUserLoading: (id: string, loading: boolean) => void;
}

export const useMainStore = create<MainStore>()(
  devtools(
    persist(
      (set) => ({
        unfollowers: [],
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
      }),
      {
        name: "main-storage",
      }
    )
  )
);
