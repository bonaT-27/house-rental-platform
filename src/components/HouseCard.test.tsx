import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {HouseCard } from './HouseCard';
import type { House } from '../types/house';

// Create typed mock functions
const mockUseIsFavorite = vi.fn();
const mockToggleFavorite = vi.fn();

// Mock the Zustand store with proper typing
vi.mock('../store/houseStore', () => ({
  useIsFavorite: () => mockUseIsFavorite(),
  useHouseStore: (selector: (state: unknown) => unknown) => {
    if (selector.toString().includes('toggleFavorite')) {
      return mockToggleFavorite;
    }
    return false;
  },
}));

describe('HouseCard', () => {
  const mockHouse: House = {
    id: '1',
    title: 'Beachfront Villa',
    price: 299,
    location: 'Malibu, CA',
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://example.com/house.jpg',
    isAvailable: true,
    description: 'Beautiful beachfront property',
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIsFavorite.mockReturnValue(false);
    mockToggleFavorite.mockReset();
  });

  describe('Rendering', () => {
    it('renders house title correctly', () => {
      render(<HouseCard house={mockHouse} />);
      expect(screen.getByText('Beachfront Villa')).toBeInTheDocument();
    });

    it('renders price formatted as USD', () => {
      render(<HouseCard house={mockHouse} />);
      const priceElement = screen.getByText(/299/);
      expect(priceElement).toBeInTheDocument();
      expect(screen.getByText('/night')).toBeInTheDocument();
    });

    it('renders location correctly', () => {
      render(<HouseCard house={mockHouse} />);
      expect(screen.getByText(/Malibu, CA/)).toBeInTheDocument();
    });

    it('renders bedrooms and bathrooms correctly', () => {
      render(<HouseCard house={mockHouse} />);
      expect(screen.getByText(/3 bed/)).toBeInTheDocument();
      expect(screen.getByText(/2 bath/)).toBeInTheDocument();
    });

    it('shows "Available" badge when available', () => {
      render(<HouseCard house={mockHouse} />);
      const badge = screen.getByText('✓ Available');
      expect(badge).toBeInTheDocument();
    });

    it('shows "Not Available" badge when unavailable', () => {
      const unavailableHouse = { ...mockHouse, isAvailable: false };
      render(<HouseCard house={unavailableHouse} />);
      const badge = screen.getByText('✗ Not Available');
      expect(badge).toBeInTheDocument();
    });

    it('displays image with correct src and alt attributes', () => {
      render(<HouseCard house={mockHouse} />);
      const image = screen.getByAltText('Beachfront Villa') as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain('https://example.com/house.jpg');
    });

    it('uses fallback image when image URL fails to load', () => {
      render(<HouseCard house={mockHouse} />);
      const image = screen.getByAltText('Beachfront Villa') as HTMLImageElement;
      fireEvent.error(image);
      expect(image.src).toContain('picsum.photos');
    });
  });

  describe('Interactions', () => {
    it('calls onClick with correct house id when card is clicked', async () => {
      const user = userEvent.setup();
      render(<HouseCard house={mockHouse} onClick={mockOnClick} />);
      
      const card = screen.getByText('Beachfront Villa').closest('div');
      if (card) await user.click(card);
      
      expect(mockOnClick).toHaveBeenCalledWith('1');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not provided', async () => {
      const user = userEvent.setup();
      render(<HouseCard house={mockHouse} />);
      
      const card = screen.getByText('Beachfront Villa').closest('div');
      if (card) await user.click(card);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('calls toggleFavorite when favorite button is clicked', async () => {
      const user = userEvent.setup();
      render(<HouseCard house={mockHouse} />);
      
      const favoriteButton = screen.getByRole('button');
      await user.click(favoriteButton);
      
      expect(mockToggleFavorite).toHaveBeenCalledWith('1');
    });

    it('stops propagation when favorite button is clicked', async () => {
      const user = userEvent.setup();
      const parentOnClick = vi.fn();
      
      render(
        <div onClick={parentOnClick}>
          <HouseCard house={mockHouse} onClick={mockOnClick} />
        </div>
      );
      
      const favoriteButton = screen.getByRole('button');
      await user.click(favoriteButton);
      
      expect(parentOnClick).not.toHaveBeenCalled();
      expect(mockOnClick).not.toHaveBeenCalled();
      expect(mockToggleFavorite).toHaveBeenCalled();
    });
  });

  describe('Favorite button states', () => {
    it('shows filled heart (❤️) when house is favorite', () => {
      mockUseIsFavorite.mockReturnValue(true);
      render(<HouseCard house={mockHouse} />);
      
      const favoriteButton = screen.getByText('❤️');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('shows outline heart (🤍) when house is not favorite', () => {
      mockUseIsFavorite.mockReturnValue(false);
      render(<HouseCard house={mockHouse} />);
      
      const favoriteButton = screen.getByText('🤍');
      expect(favoriteButton).toBeInTheDocument();
    });
  });
});