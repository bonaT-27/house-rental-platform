import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Filter state type
interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL
  const [filters, setFilters] = useState<FilterState>({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });
  
  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 300);
  
  // Update URL when debounced filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.location) params.set('location', debouncedFilters.location);
    if (debouncedFilters.minPrice) params.set('minPrice', debouncedFilters.minPrice);
    if (debouncedFilters.maxPrice) params.set('maxPrice', debouncedFilters.maxPrice);
    if (debouncedFilters.bedrooms) params.set('bedrooms', debouncedFilters.bedrooms);
    
    setSearchParams(params);
  }, [debouncedFilters, setSearchParams]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
    });
    setSearchParams({});
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'end',
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            📍 Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="City, state..."
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            💰 Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            💰 Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="10000"
            min="0"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            🛏️ Bedrooms
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
            }}
          >
            <option value="">Any</option>
            <option value="1">1+ bedroom</option>
            <option value="2">2+ bedrooms</option>
            <option value="3">3+ bedrooms</option>
            <option value="4">4+ bedrooms</option>
          </select>
        </div>
        
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}