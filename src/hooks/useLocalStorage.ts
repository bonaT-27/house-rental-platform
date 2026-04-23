import { useState, useCallback, useEffect } from 'react';

// Type guard to check if value is valid JSON
function isValidJSON(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

// Generic localStorage hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get stored value from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (item && isValidJSON(item)) {
        const parsed = JSON.parse(item) as T;
        
        // Type guard to ensure parsed value matches expected type
        if (parsed !== null && typeof parsed === 'object') {
          return parsed;
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);
  
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Update localStorage and state
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch custom event for cross-tab communication
          window.dispatchEvent(new Event('local-storage'));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );
  
  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
      if (e instanceof StorageEvent && e.key !== key) return;
      setStoredValue(readValue());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, readValue]);
  
  return [storedValue, setValue];
}

// Preferences type
export interface Preferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
  showAvailableOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

// Example usage hook for preferences
export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage<Partial<Preferences>>('house-rental-preferences', {
    theme: 'system',
    defaultView: 'grid',
    itemsPerPage: 12,
    showAvailableOnly: false,
    sortBy: 'newest',
  });
  
  const updatePreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [setPreferences]
  );
  
  const resetPreferences = useCallback(() => {
    setPreferences({
      theme: 'system',
      defaultView: 'grid',
      itemsPerPage: 12,
      showAvailableOnly: false,
      sortBy: 'newest',
    });
  }, [setPreferences]);
  
  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
}