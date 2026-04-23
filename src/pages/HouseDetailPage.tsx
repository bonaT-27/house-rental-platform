import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHouses, useIsLoading, useIsFavorite, useHouseStore } from '../store/houseStore';

export default function HouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const houses = useHouses();
  const isLoading = useIsLoading();
  const isFavorite = useIsFavorite(id || '');
  const toggleFavorite = useHouseStore((state) => state.toggleFavorite);
  
  const house = houses.find(h => h.id === id);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ marginTop: '1rem' }}>Loading property details...</p>
      </div>
    );
  }
  
  // Handle house not found
  if (!house) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>🏠 Property Not Found</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/rentals"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
          }}
        >
          Browse All Rentals →
        </Link>
      </div>
    );
  }
  
  const handleBookNow = () => {
    console.log('Booking house:', house.id, house.title);
    alert(`Thank you for your interest in ${house.title}! This feature is coming soon.`);
  };
  
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#e0e0e0',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <img
          src={house.imageUrl}
          alt={house.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            minHeight: '400px',
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/id/104/800/600';
          }}
        />
        
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>{house.title}</h1>
            <button
              onClick={() => toggleFavorite(house.id)}
              style={{
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
          
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            📍 {house.location}
          </p>
          
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2e7d32',
            marginBottom: '1rem',
          }}>
            ${house.price}
            <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>
              /night
            </span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1rem 0',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee',
            marginBottom: '1rem',
          }}>
            <div>
              <strong>🛏️ Bedrooms</strong>
              <p>{house.bedrooms} {house.bedrooms === 1 ? 'bed' : 'beds'}</p>
            </div>
            <div>
              <strong>🛁 Bathrooms</strong>
              <p>{house.bathrooms} {house.bathrooms === 1 ? 'bath' : 'baths'}</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <strong>📝 Description</strong>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              {house.description || 'No description available for this property.'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleBookNow}
              disabled={!house.isAvailable}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: house.isAvailable ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: house.isAvailable ? 'pointer' : 'not-allowed',
              }}
            >
              {house.isAvailable ? '📅 Book Now' : '❌ Not Available'}
            </button>
          </div>
          
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#999' }}>
            {house.isAvailable 
              ? '✓ Available for immediate booking' 
              : '✗ Currently not available'}
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}