import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByText("🏠 House Rental Platform")).toBeInTheDocument();
  });

  it("displays total properties count", () => {
    // Use test ID instead of text matcher
    const totalCountElement = screen.getByTestId("total-count");
    expect(totalCountElement).toHaveTextContent("Total: 5 properties");
  });

  it("shows all properties initially", () => {
    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText("Downtown Loft")).toBeInTheDocument();
    expect(screen.getByText("Mountain Cabin")).toBeInTheDocument();
    expect(screen.getByText("Urban Studio")).toBeInTheDocument();
    expect(screen.getByText("Luxury Penthouse")).toBeInTheDocument();
  });

  it("filters to show only available houses", () => {
    const availableButton = screen.getByText("✓ Available Only (3)");
    fireEvent.click(availableButton);

    // Should show available houses
    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText("Mountain Cabin")).toBeInTheDocument();
    expect(screen.getByText("Urban Studio")).toBeInTheDocument();

    // Should NOT show unavailable houses
    expect(screen.queryByText("Downtown Loft")).not.toBeInTheDocument();
    expect(screen.queryByText("Luxury Penthouse")).not.toBeInTheDocument();
  });

  it('shows all properties when "Show All" is clicked after filtering', () => {
    // First filter to available
    const availableButton = screen.getByText("✓ Available Only (3)");
    fireEvent.click(availableButton);

    // Then show all
    const allButton = screen.getByText("🏠 Show All (5)");
    fireEvent.click(allButton);

    // All properties should be visible again
    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText("Downtown Loft")).toBeInTheDocument();
  });

  it("toggles random house availability", () => {
    const toggleButton = screen.getByText("🎲 Toggle Random House");

    // Get initial available count
    const initialCount = screen.getByTestId("available-count");
    expect(initialCount).toBeInTheDocument();

    // Click toggle button
    fireEvent.click(toggleButton);

    // The available count element should still be there
    const updatedCount = screen.getByTestId("available-count");
    expect(updatedCount).toBeInTheDocument();
  });

  it("resets to original data when reset button is clicked", () => {
    // Toggle random house
    const toggleButton = screen.getByText("🎲 Toggle Random House");
    fireEvent.click(toggleButton);

    // Check if data modified indicator appears
    expect(screen.getByTestId("modified-indicator")).toBeInTheDocument();

    // Reset to original
    const resetButton = screen.getByText("🔄 Reset to Original");
    fireEvent.click(resetButton);

    // Data modified indicator should disappear
    expect(screen.queryByTestId("modified-indicator")).not.toBeInTheDocument();

    // All original properties should be back
    expect(screen.getByText("Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText("Luxury Penthouse")).toBeInTheDocument();
  });

  it("shows correct title based on filter", () => {
    // Initially shows "All Properties"
    expect(screen.getByText("All Properties (5)")).toBeInTheDocument();

    // After filtering shows "Available Properties"
    const availableButton = screen.getByText("✓ Available Only (3)");
    fireEvent.click(availableButton);

    expect(screen.getByText("Available Properties (3)")).toBeInTheDocument();
  });
});
