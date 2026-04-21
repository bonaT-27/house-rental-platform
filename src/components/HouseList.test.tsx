import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HouseList from './HouseList';
import { House } from '../types/house';

// Mock house data
const mockHouses: House[] = [
  {
    id: '1',
    title: 'Beachfront Villa',
    price: 299,
    location: 'Malibu, CA',
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://example.com/house1.jpg',
    isAvailable: true,
  },
  {
    id: '2',
    title: 'Downtown Loft',
    price: 199,
    location: 'Austin, TX',
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: 'https://example.com/house2.jpg',
    isAvailable: false,
  },
];

describe('HouseList', () => {
  describe('Loading States', () => {
    it('shows loading skeleton when houses is undefined', () => {
      render(<HouseList houses={undefined} />);
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
      expect(screen.queryByTestId('house-list-grid')).not.toBeInTheDocument();
    });

    it('shows loading skeleton with title when provided', () => {
      render(<HouseList houses={undefined} title="Available Properties" />);
      
      expect(screen.getByText('Available Properties')).toBeInTheDocument();
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('shows empty state when houses array is empty', () => {
      render(<HouseList houses={[]} />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('🏠 No houses found')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });

    it('shows empty state with title when provided', () => {
      render(<HouseList houses={[]} title="My Listings" />);
      
      expect(screen.getByText('My Listings')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('Success States', () => {
    it('renders all houses correctly', () => {
      render(<HouseList houses={mockHouses} />);
      
      expect(screen.getByTestId('house-list-grid')).toBeInTheDocument();
      expect(screen.getByText('Beachfront Villa')).toBeInTheDocument();
      expect(screen.getByText('Downtown Loft')).toBeInTheDocument();
    });

    it('displays title with house count when title is provided', () => {
      render(<HouseList houses={mockHouses} title="Featured Properties" />);
      
      expect(screen.getByText('Featured Properties (2)')).toBeInTheDocument();
    });

    it('does not show title when not provided', () => {
      render(<HouseList houses={mockHouses} />);
      
      expect(screen.queryByText(/Featured Properties/)).not.toBeInTheDocument();
    });

    it('passes click handler to HouseCard components', () => {
      const mockOnClick = vi.fn();
      render(<HouseList houses={mockHouses} onHouseClick={mockOnClick} />);
      
      // Find and click the first house card
      const firstHouseTitle = screen.getByText('Beachfront Villa');
      const card = firstHouseTitle.closest('div');
      fireEvent.click(card!);
      
      expect(mockOnClick).toHaveBeenCalledWith('1');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles empty click handler gracefully', () => {
      // Should not throw error
      render(<HouseList houses={mockHouses} />);
      
      const firstHouseTitle = screen.getByText('Beachfront Villa');
      const card = firstHouseTitle.closest('div');
      
      // This should not throw an error
      expect(() => fireEvent.click(card!)).not.toThrow();
    });
  });

  describe('TypeScript Generics', () => {
    it('accepts readonly arrays', () => {
      const readonlyHouses: readonly House[] = [...mockHouses];
      render(<HouseList houses={readonlyHouses as unknown as House[]} />);
      
      expect(screen.getByText('Beachfront Villa')).toBeInTheDocument();
    });
  });
});