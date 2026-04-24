import { useNavigate } from "react-router-dom";
import { House } from "../types/house";
import{ HouseCard} from "./HouseCard";

interface HouseListProps {
  houses: House[] | undefined;
  title?: string;
  onHouseClick?: (id: string) => void; // Keep optional for backward compatibility
}

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "20px",
      padding: "20px",
    }}
    data-testid="loading-skeleton"
  >
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div
        key={item}
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "16px",
          backgroundColor: "#fafafa",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#e0e0e0",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
        <div
          style={{
            width: "80%",
            height: "24px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            width: "60%",
            height: "20px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            width: "40%",
            height: "20px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
          }}
        />
      </div>
    ))}
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div
    style={{
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      margin: "20px",
    }}
    data-testid="empty-state"
  >
    <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "8px" }}>
      🏠 No houses found
    </p>
    <p style={{ color: "#999" }}>
      Try adjusting your search or check back later for new listings.
    </p>
  </div>
);

export default function HouseList({
  houses,
  title,
  onHouseClick,
}: HouseListProps): React.ReactElement {
  const navigate = useNavigate();

  const handleHouseClick = (id: string) => {
    if (onHouseClick) {
      // Use custom handler if provided (for demo mode)
      onHouseClick(id);
    } else {
      // Navigate to detail page by default
      navigate(`/rentals/${id}`);
    }
  };

  // Loading state
  if (houses === undefined) {
    return (
      <>
        {title && (
          <h2 style={{ padding: "20px 20px 0 20px", margin: 0 }}>{title}</h2>
        )}
        <LoadingSkeleton />
      </>
    );
  }

  // Empty state
  if (houses.length === 0) {
    return (
      <>
        {title && (
          <h2 style={{ padding: "20px 20px 0 20px", margin: 0 }}>{title}</h2>
        )}
        <EmptyState />
      </>
    );
  }

  // Success state
  return (
    <div style={{ padding: "20px" }}>
      {title && (
        <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>
          {title} ({houses.length})
        </h2>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}
        data-testid="house-list-grid"
      >
        {houses.map((house: House) => (
          <HouseCard key={house.id} house={house} onClick={handleHouseClick} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
