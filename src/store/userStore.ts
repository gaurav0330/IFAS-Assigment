import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileFormData } from '../types';

interface UserStoreState {
  profile: ProfileFormData | null;
  saveProfile: (data: ProfileFormData) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      profile: null,
      saveProfile: (data) => set({ profile: data }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'ifas-user-profile-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
