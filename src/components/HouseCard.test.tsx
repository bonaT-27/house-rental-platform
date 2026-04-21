import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HouseCard from "./HouseCard";
import { House } from "../types/house";

// Mock house data for testing
const mockHouse: House = {
  id: "1",
  title: "Beachfront Villa",
  price: 299,
  location: "Malibu, CA",
  bedrooms: 3,
  bathrooms: 2,
  imageUrl: "https://example.com/house.jpg",
  isAvailable: true,
  description: "Beautiful beachfront property",
};

describe("HouseCard", () => {
  it("renders house information correctly", () => {
    render(<HouseCard house={mockHouse} />);

    // Check for title
    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();

    // Check for price - using regex pattern instead of exact string
    // This matches "$299", "ETB 299", "USD 299", "299 USD", etc.
    const priceElement = screen.getByText(/299/);
    expect(priceElement).toBeInTheDocument();

    // Check for "/night" text
    expect(screen.getByText("/night")).toBeInTheDocument();

    // Check for location - using more flexible matching
    expect(screen.getByText(/Malibu, CA/)).toBeInTheDocument();

    // Check for bedrooms and bathrooms - using regex pattern
    expect(screen.getByText(/🛏️\s*3\s*beds?/)).toBeInTheDocument();
    expect(screen.getByText(/🛁\s*2\s*baths?/)).toBeInTheDocument();

    // Check for available badge
    expect(screen.getByText("✓ Available")).toBeInTheDocument();
  });

  it('shows "Not Available" badge when house is unavailable', () => {
    const unavailableHouse = { ...mockHouse, isAvailable: false };
    render(<HouseCard house={unavailableHouse} />);

    expect(screen.getByText("✗ Not Available")).toBeInTheDocument();
  });

  it("calls onClick with house id when clicked", () => {
    const mockOnClick = vi.fn();
    render(<HouseCard house={mockHouse} onClick={mockOnClick} />);

    const card = screen.getByText("Beachfront Villa").closest("div");
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith("1");
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick if not provided", () => {
    const mockOnClick = vi.fn();
    render(<HouseCard house={mockHouse} />);

    const card = screen.getByText("Beachfront Villa").closest("div");
    fireEvent.click(card!);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
