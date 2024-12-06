import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@src/types';

type Tab = 'all' | 'normal' | 'verified';

export interface MainStore {
  unfollowers: User[] | null;
  isInstagram: boolean;
  setUnfollowers: (unfollowers: User[]) => void;
  clearUnfollowers: () => void;
  removeUnfollower: (id: string) => void;
  changeUserLoading: (id: string, loading: boolean) => void;
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
}

export const useMainStore = create<MainStore>()(
  devtools(
    persist(
      set => ({
        selectedTab: 'all',
        setSelectedTab: tab => set({ selectedTab: tab }),
        isInstagram: false,
        unfollowers: null,
        setUnfollowers: unfollowers => set({ unfollowers }),
        clearUnfollowers: () => set({ unfollowers: [] }),
        removeUnfollower: id =>
          set(state => ({
            unfollowers: state.unfollowers?.filter(user => user.id !== id),
          })),
        changeUserLoading: (id, loading) => {
          set(state => ({
            unfollowers: state.unfollowers?.map(user =>
              user.id === id ? { ...user, unFollowLoading: loading } : user,
            ),
          }));
        },
      }),
      {
        name: 'main-storage',
        partialize: state => ({ unfollowers: state.unfollowers }),
      },
    ),
  ),
);
