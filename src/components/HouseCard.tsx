import { House } from '../types/house';
import { useIsFavorite, useHouseStore } from '../store/houseStore';

interface HouseCardProps {
  house: House;
  onClick?: (id: string) => void;
}

export default function HouseCard({ house, onClick }: HouseCardProps): React.ReactElement {
  const isFavorite = useIsFavorite(house.id);
  const toggleFavorite = useHouseStore((state) => state.toggleFavorite);
  
  const handleClick = () => {
    if (onClick) {
      onClick(house.id);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering house click
    toggleFavorite(house.id);
  };
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(house.price);
  
  return (
    <div 
      onClick={handleClick}
      className="house-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '16px',
        margin: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '24px',
          transition: 'transform 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      
      <img 
        src={house.imageUrl} 
        alt={house.title}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '12px'
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://picsum.photos/id/104/400/300';
        }}
      />
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>
        {house.title}
      </h3>
      
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '8px 0' }}>
        {formattedPrice}
        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#666' }}>
          /night
        </span>
      </p>
      
      <p style={{ color: '#666', margin: '8px 0' }}>
        📍 {house.location}
      </p>
      
      <p style={{ color: '#666', margin: '8px 0' }}>
        🛏️ {house.bedrooms} bed{house.bedrooms !== 1 ? 's' : ''} • 
        🛁 {house.bathrooms} bath{house.bathrooms !== 1 ? 's' : ''}
      </p>
      
      <div style={{ marginTop: '12px' }}>
        <span 
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            backgroundColor: house.isAvailable ? '#e6f7e6' : '#ffe6e6',
            color: house.isAvailable ? '#2e7d32' : '#c62828',
          }}
        >
          {house.isAvailable ? '✓ Available' : '✗ Not Available'}
        </span>
      </div>
    </div>
  );
}