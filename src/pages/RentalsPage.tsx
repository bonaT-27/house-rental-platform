import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HouseList from '../components/HouseList';
import FilterBar from '../components/FilterBar';
import { useHouses, useIsLoading } from '../store/houseStore';

export default function RentalsPage() {
  const houses = useHouses();
  const isLoading = useIsLoading();
  const [searchParams] = useSearchParams();
  
  // Get filters from URL
  const locationFilter = searchParams.get('location') || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 10000;
  const bedrooms = Number(searchParams.get('bedrooms')) || 0;
  
  // Filter houses based on URL params
  const filteredHouses = useMemo(() => {
    return houses.filter(house => {
      const matchesLocation = locationFilter === '' || 
        house.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesPrice = house.price >= minPrice && house.price <= maxPrice;
      const matchesBedrooms = bedrooms === 0 || house.bedrooms >= bedrooms;
      
      return matchesLocation && matchesPrice && matchesBedrooms;
    });
  }, [houses, locationFilter, minPrice, maxPrice, bedrooms]);
  
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
        <p style={{ marginTop: '1rem' }}>Loading rentals...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Browse All Rentals</h1>
      <FilterBar />
      <div style={{ marginTop: '2rem' }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Found {filteredHouses.length} property{filteredHouses.length !== 1 ? 's' : ''}
        </p>
        <HouseList houses={filteredHouses} />
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