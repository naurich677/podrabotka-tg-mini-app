import { create } from 'zustand';

export type Screen =
  | 'splash'
  | 'selectLanguage'
  | 'selectRole'
  | 'phoneVerification'
  | 'workerFeed'
  | 'workerFilters'
  | 'workerJobDetail'
  | 'workerApplications'
  | 'workerFavorites'
  | 'workerHistory'
  | 'employerDashboard'
  | 'employerCreateShift'
  | 'employerShiftList'
  | 'employerApplications'
  | 'employerAttendance'
  | 'employerPaymentTracking'
  | 'profile'
  | 'profileEdit'
  | 'notifications';

export interface User {
  id: string;
  telegramId: number;
  telegramUsername?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  role: 'worker' | 'employer';
  phone?: string;
  phoneVerified: boolean;
  language: 'ru' | 'kz';
  city: string;
  workerProfile?: Record<string, unknown>;
  employerProfile?: Record<string, unknown>;
}

interface AppState {
  // Navigation
  currentScreen: Screen;
  screenHistory: Screen[];
  navigateTo: (screen: Screen) => void;
  goBack: () => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Language
  language: 'ru' | 'kz';
  setLanguage: (lang: 'ru' | 'kz') => void;

  // Onboarding
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;

  // Selected job
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;

  // Selected application
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;

  // Selected shift (employer)
  selectedShiftId: string | null;
  setSelectedShiftId: (id: string | null) => void;

  // Favorites (stored as array of job IDs)
  favorites: string[];
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;

  // Filters
  filters: {
    category?: string;
    district?: string;
    date?: string;
    paymentType?: string;
    search?: string;
  };
  setFilters: (filters: Record<string, string | undefined>) => void;
  clearFilters: () => void;

  // Loading
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentScreen: 'splash',
  screenHistory: [],
  navigateTo: (screen) => set((state) => ({
    currentScreen: screen,
    screenHistory: [...state.screenHistory, state.currentScreen],
  })),
  goBack: () => set((state) => {
    const history = [...state.screenHistory];
    const prev = history.pop();
    return {
      currentScreen: prev || (state.user?.role === 'worker' ? 'workerFeed' : 'employerDashboard'),
      screenHistory: history,
    };
  }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Language
  language: 'ru',
  setLanguage: (language) => set({ language }),

  // Onboarding
  isOnboarded: false,
  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  // Selected items
  selectedJobId: null,
  setSelectedJobId: (selectedJobId) => set({ selectedJobId }),
  selectedApplicationId: null,
  setSelectedApplicationId: (selectedApplicationId) => set({ selectedApplicationId }),
  selectedShiftId: null,
  setSelectedShiftId: (selectedShiftId) => set({ selectedShiftId }),

  // Favorites
  favorites: [],
  toggleFavorite: (jobId) => set((state) => ({
    favorites: state.favorites.includes(jobId)
      ? state.favorites.filter(id => id !== jobId)
      : [...state.favorites, jobId],
  })),
  isFavorite: (jobId) => get().favorites.includes(jobId),

  // Filters
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),

  // Loading
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
