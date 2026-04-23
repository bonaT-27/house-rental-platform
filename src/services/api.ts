import { z } from 'zod';

// Custom API Error class
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isValidationError: boolean;
  
  constructor(message: string, statusCode: number, isValidationError = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isValidationError = isValidationError;
    
    // Maintain proper stack trace
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  static fromResponse(response: Response, data?: unknown): ApiError {
    const message = typeof data === 'object' && data && 'message' in data 
      ? String(data.message) 
      : `HTTP Error ${response.status}`;
    
    const isValidation = response.status === 400 || response.status === 422;
    return new ApiError(message, response.status, isValidation);
  }
}

// Type guard for checking if an error is an ApiError
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// Type guard for safe error handling
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Generic response interceptor type
type RequestInterceptor = (url: string, options: RequestInit) => RequestInit;
type ResponseInterceptor = <T>(data: T) => T;

class ApiService {
  private baseURL: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  
  constructor(baseURL = import.meta.env.VITE_API_URL || '/api') {
    this.baseURL = baseURL;
  }
  
  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }
  
  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }
  
  // Apply request interceptors
  private applyRequestInterceptors(url: string, options: RequestInit): RequestInit {
    let modifiedOptions = { ...options };
    for (const interceptor of this.requestInterceptors) {
      modifiedOptions = interceptor(url, modifiedOptions);
    }
    return modifiedOptions;
  }
  
  // Apply response interceptors
  private applyResponseInterceptors<T>(data: T): T {
    let modifiedData = data;
    for (const interceptor of this.responseInterceptors) {
      modifiedData = interceptor(modifiedData);
    }
    return modifiedData;
  }
  
  // Generic request method
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    const requestOptions = this.applyRequestInterceptors(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    try {
      const response = await fetch(fullUrl, requestOptions);
      
      let data: unknown;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        throw ApiError.fromResponse(response, data);
      }
      
      return this.applyResponseInterceptors(data as T);
    } catch (error) {
      if (isApiError(error)) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Unknown error occurred', 500);
    }
  }
  
  // GET request
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  // POST request
  async post<T, U>(url: string, data: U, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  // PUT request
  async put<T, U>(url: string, data: U, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  // DELETE request
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
  
  // PATCH request
  async patch<T, U>(url: string, data: U, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Helper function to validate response with Zod schema
export function validateResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  throw new ApiError(
    `Response validation failed: ${result.error.issues.map(i => i.message).join(', ')}`,
    500,
    true
  );
}

// Create and export singleton instance
export const api = new ApiService();

// Example interceptor usage
api.addRequestInterceptor((url, options) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  console.log(`[API Request] ${options.method} ${url}`);
  return options;
});

api.addResponseInterceptor(<T>(data: T): T => {
  console.log('[API Response]', data);
  return data;
});