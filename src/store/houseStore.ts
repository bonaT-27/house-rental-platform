import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { House } from '../types/house';
import { houseSchema, HouseFormData } from '../schemas/houseSchema';
import { z } from 'zod';

interface HouseState {
  houses: House[];
  isLoading: boolean;
  error: string | null;
  favorites: Set<string>;
  
  fetchHouses: () => Promise<void>;
  addHouse: (houseData: HouseFormData) => Promise<void>;
  removeHouse: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAllHouses: () => void;
  updateHouse: (id: string, updates: Partial<House>) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchHousesFromAPI = async (): Promise<House[]> => {
  await delay(1500);
  
  return [
    {
      id: '1',
      title: 'Beachfront Villa',
      price: 299,
      location: 'Malibu, CA',
      bedrooms: 3,
      bathrooms: 2,
      imageUrl: 'https://picsum.photos/id/104/400/300',
      isAvailable: true,
      description: 'Beautiful beachfront property with ocean views',
    },
    {
      id: '2',
      title: 'Downtown Loft',
      price: 199,
      location: 'Austin, TX',
      bedrooms: 2,
      bathrooms: 1,
      imageUrl: 'https://picsum.photos/id/106/400/300',
      isAvailable: false,
      description: 'Modern loft in the heart of downtown',
    },
    {
      id: '3',
      title: 'Mountain Cabin',
      price: 349,
      location: 'Aspen, CO',
      bedrooms: 4,
      bathrooms: 3,
      imageUrl: 'https://picsum.photos/id/107/400/300',
      isAvailable: true,
      description: 'Cozy cabin with stunning mountain views',
    },
    {
      id: '4',
      title: 'Urban Studio',
      price: 149,
      location: 'New York, NY',
      bedrooms: 1,
      bathrooms: 1,
      imageUrl: 'https://picsum.photos/id/108/400/300',
      isAvailable: true,
      description: 'Perfect studio for solo travelers',
    },
    {
      id: '5',
      title: 'Luxury Penthouse',
      price: 599,
      location: 'Miami, FL',
      bedrooms: 4,
      bathrooms: 4,
      imageUrl: 'https://picsum.photos/id/109/400/300',
      isAvailable: false,
      description: 'Spectacular ocean view penthouse',
    },
  ];
};

export const useHouseStore = create<HouseState>()(
  devtools(
    persist(
      (set) => ({
        houses: [],
        isLoading: false,
        error: null,
        favorites: new Set<string>(),
        
        fetchHouses: async () => {
          set({ isLoading: true, error: null }, false, 'fetchHouses/start');
          
          try {
            const houses = await fetchHousesFromAPI();
            set({ houses, isLoading: false }, false, 'fetchHouses/success');
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch houses',
              isLoading: false 
            }, false, 'fetchHouses/error');
          }
        },
        
        addHouse: async (houseData: HouseFormData) => {
          set({ isLoading: true, error: null }, false, 'addHouse/start');
          
          try {
            const validatedData = houseSchema.parse(houseData);
            const newHouse: House = {
              ...validatedData,
              id: Date.now().toString(),
            };
            
            set((state) => ({
              houses: [newHouse, ...state.houses],
              isLoading: false,
            }), false, 'addHouse/success');
          } catch (error) {
            const errorMessage = error instanceof z.ZodError 
              ? error.issues.map(e => e.message).join(', ')
              : 'Failed to add house';
            
            set({ 
              error: errorMessage,
              isLoading: false 
            }, false, 'addHouse/error');
            
            throw error;
          }
        },
        
        removeHouse: (id: string) => {
          set((state) => {
            const newFavorites = new Set(state.favorites);
            newFavorites.delete(id);
            
            return {
              houses: state.houses.filter(house => house.id !== id),
              favorites: newFavorites,
            };
          }, false, 'removeHouse');
        },
        
        toggleFavorite: (id: string) => {
          set((state) => {
            const newFavorites = new Set(state.favorites);
            if (newFavorites.has(id)) {
              newFavorites.delete(id);
            } else {
              newFavorites.add(id);
            }
            return { favorites: newFavorites };
          }, false, 'toggleFavorite');
        },
        
        clearAllHouses: () => {
          if (import.meta.env.DEV) {
            set({ houses: [], favorites: new Set() }, false, 'clearAllHouses');
          } else {
            console.warn('clearAllHouses is only available in development mode');
          }
        },
        
        updateHouse: (id: string, updates: Partial<House>) => {
          set((state) => ({
            houses: state.houses.map(house =>
              house.id === id ? { ...house, ...updates } : house
            ),
          }), false, 'updateHouse');
        },
      }),
      {
        name: 'house-rental-storage',
        partialize: (state) => ({
          favorites: Array.from(state.favorites),
          houses: state.houses,
        }),
        onRehydrateStorage: () => {
          console.log('🔄 Rehydrating Zustand store...');
          return (state, error) => {
            if (error) {
              console.error('Error rehydrating store:', error);
            } else if (state) {
              if (state.favorites && Array.isArray(state.favorites)) {
                state.favorites = new Set(state.favorites);
              }
              console.log('✅ Store rehydrated successfully');
            }
          };
        },
      }
    ),
    { name: 'HouseStore' }
  )
);

// ✅ SIMPLE SELECTORS - return primitives or memoized values
export const useHouses = () => useHouseStore((state) => state.houses);
export const useIsLoading = () => useHouseStore((state) => state.isLoading);
export const useError = () => useHouseStore((state) => state.error);

// ✅ useMemo to prevent infinite loops with arrays
import { useMemo } from 'react';

export const useFavorites = () => {
  const houses = useHouses();
  const favoritesSet = useHouseStore((state) => state.favorites);
  
  return useMemo(() => {
    return Array.from(favoritesSet)
      .map(id => houses.find(house => house.id === id))
      .filter((house): house is House => house !== undefined);
  }, [houses, favoritesSet]);
};

export const useAvailableHouses = () => {
  const houses = useHouses();
  
  return useMemo(() => {
    return houses.filter(house => house.isAvailable);
  }, [houses]);
};

// ✅ Return primitive values, not objects
export const useTotalCount = () => useHouseStore((state) => state.houses.length);
export const useAvailableCount = () => useHouseStore((state) => state.houses.filter(h => h.isAvailable).length);
export const useFavoritesCount = () => useHouseStore((state) => state.favorites.size);

// ✅ For backward compatibility with App.tsx, create a hook that returns all counts
export const useHouseCount = () => {
  const total = useTotalCount();
  const available = useAvailableCount();
  const favorites = useFavoritesCount();
  
  return { total, available, favorites };
};

export const useIsFavorite = (id: string) => useHouseStore((state) => 
  state.favorites.has(id)
);