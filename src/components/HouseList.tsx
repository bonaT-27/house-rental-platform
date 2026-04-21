import { House } from '../types/house';
import HouseCard from './HouseCard';

// Define the props interface
interface HouseListProps {
  houses: House[] | undefined;  // Can be undefined for loading state
  title?: string;                // Optional title
  onHouseClick?: (id: string) => void;  // Optional click handler
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div 
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}
    data-testid="loading-skeleton"
  >
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div 
        key={item}
        style={{
          border: '1px solid #eee',
          borderRadius: '12px',
          padding: '16px',
          backgroundColor: '#fafafa',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      >
        <div 
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
        <div 
          style={{
            width: '80%',
            height: '24px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        />
        <div 
          style={{
            width: '60%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        />
        <div 
          style={{
            width: '40%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px'
          }}
        />
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = () => (
  <div 
    style={{
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      margin: '20px'
    }}
    data-testid="empty-state"
  >
    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '8px' }}>
      🏠 No houses found
    </p>
    <p style={{ color: '#999' }}>
      Try adjusting your search or check back later for new listings.
    </p>
  </div>
);

// Add keyframe animation for loading skeleton
const addPulseAnimation = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
};

// Call this when component mounts (optional)
if (typeof window !== 'undefined') {
  addPulseAnimation();
}

export default function HouseList({ 
  houses, 
  title, 
  onHouseClick 
}: HouseListProps): React.ReactElement {
  
  // Loading state: houses is undefined
  if (houses === undefined) {
    return (
      <>
        {title && <h2 style={{ padding: '20px 20px 0 20px', margin: 0 }}>{title}</h2>}
        <LoadingSkeleton />
      </>
    );
  }

  // Empty state: houses is empty array
  if (houses.length === 0) {
    return (
      <>
        {title && <h2 style={{ padding: '20px 20px 0 20px', margin: 0 }}>{title}</h2>}
        <EmptyState />
      </>
    );
  }

  // Success state: render houses
  return (
    <div style={{ padding: '20px' }}>
      {title && (
        <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>
          {title} ({houses.length})
        </h2>
      )}
      
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}
        data-testid="house-list-grid"
      >
        {/* Using map with proper TypeScript generics */}
      {houses.map((house: House): React.ReactElement => (
  <HouseCard 
    key={house.id}
    house={house} 
    onClick={onHouseClick}
  />
))}                                                                                                                                                         
      </div>
    </div>
  );
}