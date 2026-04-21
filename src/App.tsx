import { useState, useMemo } from 'react';
import HouseList from './components/HouseList';
import { mockHouses } from './data/mockHousesData';
import { House } from './types/house';

// Type for filter options
type FilterType = 'all' | 'available';

function App() {
  // State for houses - typed as House[]
  const [houses, setHouses] = useState<House[]>(() => {
    // Initialize with mock data (convert from readonly to mutable for state)
    // Using spread operator to create a mutable copy
    return [...mockHouses] as House[];
  });

  // State for filter type
  const [filter, setFilter] = useState<FilterType>('all');

  // State to track if we've modified any data
  const [isModified, setIsModified] = useState(false);

  // Computed filtered houses using useMemo for performance
  const filteredHouses = useMemo((): House[] => {
    if (filter === 'available') {
      return houses.filter((house: House): boolean => house.isAvailable === true);
    }
    return houses;
  }, [houses, filter]);

  // Handler to toggle availability of a random house (demonstrates state update)
  const toggleRandomAvailability = (): void => {
    if (houses.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * houses.length);
    const updatedHouses = [...houses];
    updatedHouses[randomIndex] = {
      ...updatedHouses[randomIndex],
      isAvailable: !updatedHouses[randomIndex].isAvailable,
    };
    setHouses(updatedHouses);
    setIsModified(true);
  };

  // Handler to reset to original data
  const resetToOriginal = (): void => {
    setHouses([...mockHouses] as House[]);
    setFilter('all');
    setIsModified(false);
  };

  // Handler for house click
  const handleHouseClick = (id: string): void => {
    console.log(`House ${id} clicked`);
    // In a real app, you'd navigate to detail page
    alert(`You clicked on house ${id}`);
  };

  // Get counts for display
  const totalHouses = houses.length;
  const availableHouses = houses.filter((h: House): boolean => h.isAvailable).length;
  const filteredCount = filteredHouses.length;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f7f7f7',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
            🏠 House Rental Platform
          </h1>
          
          {/* Stats Bar */}
<div style={{ 
  display: 'flex', 
  gap: '20px', 
  marginBottom: '20px',
  padding: '10px 0',
  borderBottom: '1px solid #eee'
}}>
  <div data-testid="total-count">
    <strong>Total:</strong> {totalHouses} properties
  </div>
  <div data-testid="available-count">
    <strong>Available:</strong> {availableHouses} properties
  </div>
  {filter === 'available' && (
    <div style={{ color: '#2e7d32' }} data-testid="filtered-count">
      <strong>Showing:</strong> {filteredCount} available
    </div>
  )}
  {isModified && (
    <div style={{ color: '#ff9800' }} data-testid="modified-indicator">
      ⚡ Data modified
    </div>
  )}
</div>
          {/* Filter and Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '10px 20px',
                backgroundColor: filter === 'all' ? '#007bff' : '#e0e0e0',
                color: filter === 'all' ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              🏠 Show All ({totalHouses})
            </button>
            
            <button
              onClick={() => setFilter('available')}
              style={{
                padding: '10px 20px',
                backgroundColor: filter === 'available' ? '#28a745' : '#e0e0e0',
                color: filter === 'available' ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              ✓ Available Only ({availableHouses})
            </button>

            <button
              onClick={toggleRandomAvailability}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🎲 Toggle Random House
            </button>

            <button
              onClick={resetToOriginal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Reset to Original
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <HouseList 
          houses={filteredHouses}
          title={filter === 'available' ? 'Available Properties' : 'All Properties'}
          onHouseClick={handleHouseClick}
        />
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px',
        color: '#666',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
      }}>
        <p>🏡 House Rental Platform - Built with React + TypeScript</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
          Click on any property to see details (coming soon!)
        </p>
      </footer>
    </div>
  );
}

export default App;