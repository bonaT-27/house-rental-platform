import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import type { House } from "./types/house";

// Mock data
const mockHouses: House[] = [
  {
    id: "1",
    title: "Beachfront Villa",
    price: 299,
    location: "Malibu, CA",
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://example.com/house1.jpg",
    isAvailable: true,
  },
  {
    id: "2",
    title: "Downtown Loft",
    price: 199,
    location: "Austin, TX",
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: "https://example.com/house2.jpg",
    isAvailable: false,
  },
  {
    id: "3",
    title: "Mountain Cabin",
    price: 349,
    location: "Aspen, CO",
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: "https://example.com/house3.jpg",
    isAvailable: true,
  },
  {
    id: "4",
    title: "Urban Studio",
    price: 149,
    location: "New York, NY",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://example.com/house4.jpg",
    isAvailable: true,
  },
  {
    id: "5",
    title: "Luxury Penthouse",
    price: 599,
    location: "Miami, FL",
    bedrooms: 4,
    bathrooms: 4,
    imageUrl: "https://example.com/house5.jpg",
    isAvailable: false,
  },
];

// Mock functions
const mockFetchHouses = vi.fn();
const mockAddHouse = vi.fn();
const mockRemoveHouse = vi.fn();
const mockToggleFavorite = vi.fn();
const mockClearAllHouses = vi.fn();

// Mock the store with all required exports
vi.mock("./store/houseStore", () => ({
  // Selectors
  useHouses: () => mockHouses,
  useIsLoading: () => false,
  useError: () => null,
  useAvailableHouses: () => mockHouses.filter((h) => h.isAvailable),
  useTotalCount: () => mockHouses.length,
  useAvailableCount: () => mockHouses.filter((h) => h.isAvailable).length,
  useFavoritesCount: () => 0,
  useIsFavorite: () => false,
  useFavorites: () => [],
  // Store hook
  useHouseStore: (selector: (state: unknown) => unknown) => {
    const state = {
      fetchHouses: mockFetchHouses,
      addHouse: mockAddHouse,
      removeHouse: mockRemoveHouse,
      toggleFavorite: mockToggleFavorite,
      clearAllHouses: mockClearAllHouses,
    };
    return selector(state);
  },
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchHouses.mockImplementation(() => Promise.resolve());
  });

  it("renders the app title", () => {
    render(<App />);
    expect(screen.getByText("🏠 House Rental Platform")).toBeInTheDocument();
  });

  it("displays total properties count", async () => {
    render(<App />);

    // Use getAllByText and check the first matching element
    await waitFor(() => {
      const totalElements = screen.getAllByText((content) => {
        // Normalize the content by removing whitespace and line breaks
        const normalized = content.replace(/\s+/g, " ").trim();
        return (
          normalized.includes("Total:") &&
          normalized.includes("5") &&
          normalized.includes("properties")
        );
      });
      expect(totalElements.length).toBeGreaterThan(0);
    });
  });

  it("shows all properties initially", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
      expect(screen.getByText("Downtown Loft")).toBeInTheDocument();
      expect(screen.getByText("Mountain Cabin")).toBeInTheDocument();
      expect(screen.getByText("Urban Studio")).toBeInTheDocument();
      expect(screen.getByText("Luxury Penthouse")).toBeInTheDocument();
    });
  });

  it("filters to show only available houses", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    });

    const availableButton = screen.getByRole("button", {
      name: /Available Only/,
    });
    await user.click(availableButton);

    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText("Mountain Cabin")).toBeInTheDocument();
    expect(screen.getByText("Urban Studio")).toBeInTheDocument();
    expect(screen.queryByText("Downtown Loft")).not.toBeInTheDocument();
    expect(screen.queryByText("Luxury Penthouse")).not.toBeInTheDocument();
  });

  it('shows all properties when "Show All" is clicked after filtering', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    });

    const availableButton = screen.getByRole("button", {
      name: /Available Only/,
    });
    await user.click(availableButton);

    const allButton = screen.getByRole("button", { name: /Show All/ });
    await user.click(allButton);

    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText("Downtown Loft")).toBeInTheDocument();
  });

  it("navigates to add house form and back", async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = screen.getByRole("button", { name: /Add New Property/ });
    await user.click(addButton);

    expect(screen.getByText("🏠 Add New Property")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancel/ });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    });
  });

  it("navigates to favorites view", async () => {
    const user = userEvent.setup();
    render(<App />);

    const favoritesButton = screen.getByRole("button", { name: /Favorites/ });
    await user.click(favoritesButton);

    expect(screen.getByText(/My Favorites/)).toBeInTheDocument();
  });

  it("shows correct title based on filter after navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("All Properties (5)")).toBeInTheDocument();
    });

    const availableButton = screen.getByRole("button", {
      name: /Available Only/,
    });
    await user.click(availableButton);

    expect(screen.getByText("Available Properties (3)")).toBeInTheDocument();
  });
});
