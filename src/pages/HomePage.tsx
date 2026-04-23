import { useState } from 'react';
import { Link } from 'react-router-dom';
import HouseList from '../components/HouseList';
import { House } from '../types/house';

// Mock data with more houses
const mockHouses: House[] = [
  {
    id: '1',
    title: 'Beachfront Villa',
    price: 299,
    location: 'Malibu, CA',
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://picsum.photos/id/104/400/300',
    isAvailable: true,
    description: 'Beautiful beachfront property',
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
    description: 'Modern loft in city center',
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
    description: 'Cozy cabin with mountain views',
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
    description: 'Perfect for solo travelers',
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
    description: 'Ocean view penthouse',
  },
];

export default function HomePage() {
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleHouseClick = (id: string) => {
    setSelectedHouseId(id);
    console.log(`Selected house: ${id}`);
  };

  // Simulate loading for demonstration
  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        marginBottom: '3rem',
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Find Your Dream Rental
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Discover the perfect place to call home
        </p>
        <Link
          to="/rentals"
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
        >
          Browse Rentals →
        </Link>
      </section>
      
      {/* Interactive Demo Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Try the Demo</h2>
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={toggleLoading}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              {isLoading ? 'Show Houses' : 'Show Loading State'}
            </button>
            
            {selectedHouseId && (
              <p style={{ color: 'green', marginTop: '10px' }}>
                Selected house ID: {selectedHouseId}
              </p>
            )}
          </div>
        </div>

        <HouseList 
          houses={isLoading ? undefined : mockHouses}
          title="Available Properties"
          onHouseClick={handleHouseClick}
        />
      </section>
      
      {/* Features Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
      }}>
        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Easy Search</h3>
          <p>Find properties by location, price, and amenities</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
          <h3>Save Favorites</h3>
          <p>Save your favorite properties and revisit them anytime</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <h3>Instant Booking</h3>
          <p>Book your dream rental with just a few clicks</p>
        </div>
      </section>
    </div>
  );
}