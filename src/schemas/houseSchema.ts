import { z } from 'zod';

// Define the house schema with all validations
export const houseSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  
  price: z.number()
    .positive('Price must be a positive number')
    .max(10000, 'Price cannot exceed $10,000 per night'),
  
  location: z.string()
    .min(1, 'Location is required'),
  
  bedrooms: z.number()
    .int('Bedrooms must be a whole number')
    .min(1, 'Must have at least 1 bedroom')
    .max(10, 'Cannot have more than 10 bedrooms'),
  
  bathrooms: z.number()
    .min(0.5, 'Must have at least 0.5 bathrooms')
    .max(5, 'Cannot have more than 5 bathrooms'),
  
  imageUrl: z.string()
    .url('Must be a valid URL'),
  
  isAvailable: z.boolean(),
  
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
}).refine(
  (data) => {
    if (data.price > 5000 && data.isAvailable === true) {
      return false;
    }
    return true;
  },
  {
    message: 'Luxury houses priced above $5000 must be pre-booked and cannot be available',
    path: ['price'],
  }
);

// Infer TypeScript type from the schema
export type HouseFormData = z.infer<typeof houseSchema>;

// Helper function to validate data with proper error handling
export function validateHouse(data: unknown): HouseFormData {
  try {
    return houseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ✅ CORRECT: Use 'issues' array in Zod v4
      const errorMessages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

// Alternative: Safe validation that returns result object
export function validateHouseSafe(data: unknown): {
  success: boolean;
  data?: HouseFormData;
  error?: string;
  errors?: z.ZodError;
} {
  const result = houseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error, error: result.error.issues.map(i => i.message).join(', ') };
}

// Example: Using satisfies operator with partial data
export const defaultHouseValues = {
  title: 'Beautiful Villa',
  price: 299,
  location: 'Miami, FL',
  bedrooms: 3,
  bathrooms: 2,
  imageUrl: 'https://example.com/house.jpg',
  isAvailable: true,
  description: 'A beautiful villa with ocean views',
} satisfies Partial<HouseFormData>;

// Pre-defined validation error messages
export const validationMessages = {
  title: {
    tooShort: 'Title must be at least 3 characters',
    tooLong: 'Title cannot exceed 100 characters',
  },
  price: {
    negative: 'Price must be a positive number',
    tooHigh: 'Price cannot exceed $10,000 per night',
    luxuryConstraint: 'Luxury houses priced above $5000 must be pre-booked',
  },
  location: {
    required: 'Location is required',
  },
  bedrooms: {
    min: 'Must have at least 1 bedroom',
    max: 'Cannot have more than 10 bedrooms',
    integer: 'Bedrooms must be a whole number',
  },
  bathrooms: {
    min: 'Must have at least 0.5 bathrooms',
    max: 'Cannot have more than 5 bathrooms',
  },
  imageUrl: {
    invalid: 'Must be a valid URL',
  },
  description: {
    tooLong: 'Description cannot exceed 500 characters',
  },
} as const;