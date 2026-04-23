// Makes specific keys optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Makes specific keys required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Makes all nested properties readonly
export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};

// Example: Pick specific keys
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Example: Nullable type
export type Nullable<T> = T | null;

// Example: Async function type
export type AsyncFunction<T = void> = () => Promise<T>;

// Example: Component Props with children
export type PropsWithChildren<P = object> = P & { children?: React.ReactNode };

// Example usage for House update form
import { House } from './house';

export type HouseUpdateForm = PartialBy<House, 'id' | 'isAvailable'> & {
  // id is required for update, but optional for create
  id?: string;
};

export type ReadonlyHouse = ReadonlyDeep<House>;

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}