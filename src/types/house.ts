// Define the shape of a House object
export interface House {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  isAvailable: boolean;
  description?: string; // Optional field with '?'
}

// We use 'interface' instead of 'type' because:
// - Interfaces are better for objects that describe shapes
// - They can be extended later if needed
// - They give better error messages in TypeScript

// If we needed a union type or primitive, we'd use 'type':
// type Status = 'available' | 'booked' | 'maintenance';