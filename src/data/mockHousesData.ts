import { House } from '../types/house';

// Using 'as const' for maximum immutability
// This makes the array and all its properties readonly
export const mockHousesData = [
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
] as const; // 'as const' makes the array deeply readonly

// Type assertion to ensure the data matches House[] type
// This catches any type mismatches at compile time
export const mockHouses: readonly House[] = mockHousesData;

// Alternative: If you need a mutable version (not recommended)
// export const mockHousesMutable: House[] = [...mockHousesData];