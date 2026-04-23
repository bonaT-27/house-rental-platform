import { useEffect, useState } from 'react';
import HouseList from './components/HouseList';
import { AddHouseForm } from './components/AddHouseForm';
import { 
  useTotalCount,
  useAvailableCount,
  useFavoritesCount,
  useHouses, 
  useIsLoading, 
  useError, 
  useAvailableHouses,
  useHouseStore
} from './store/houseStore';
import { HouseFormData } from './schemas/houseSchema';

type ViewMode = 'list' | 'add' | 'favorites';

function App() {
  // Get state from store using selectors
  const houses = useHouses();
  const isLoading = useIsLoading();
  const error = useError();
  const availableHouses = useAvailableHouses();
  const total = useTotalCount();
const available = useAvailableCount();
const favCount = useFavoritesCount();
  
  // Get actions
  const fetchHouses = useHouseStore((state) => state.fetchHouses);
  const addHouse = useHouseStore((state) => state.addHouse);
  const clearAllHouses = useHouseStore((state) => state.clearAllHouses);
  
  // Local state
  const [filter, setFilter] = useState<'all' | 'available'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Check if in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Fetch houses on mount
  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);
  
  const handleAddHouse = async (formData: HouseFormData) => {
    try {
      await addHouse(formData);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to add house:', error);
    }
  };
  
  const handleRefresh = () => {
    fetchHouses();
  };
  
  const handleClearAll = () => {
    if (window.confirm('⚠️ This will delete ALL houses. Are you sure?')) {
      clearAllHouses();
    }
  };
  
  // Determine which houses to display based on filter
  const displayedHouses = filter === 'available' ? availableHouses : houses;
  
  // Get title based on view mode
  const getTitle = () => {
    if (viewMode === 'favorites') return 'My Favorites';
    if (filter === 'available') return 'Available Properties';
    return 'All Properties';
  };
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f7f7f7',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
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
            borderBottom: '1px solid #eee',
            flexWrap: 'wrap'
          }}>
            <div>
              <strong>Total:</strong> {total} properties
            </div>
            <div>
              <strong>Available:</strong> {available} properties
            </div>
            <div>
              <strong>❤️ Favorites:</strong> {favCount}
            </div>
            {isDevelopment && (
              <div style={{ color: '#666', fontSize: '0.875rem' }}>
                🔧 Dev Mode
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px 20px',
                backgroundColor: viewMode === 'list' ? '#007bff' : '#e0e0e0',
                color: viewMode === 'list' ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🏠 View Properties
            </button>
            
            <button
              onClick={() => setViewMode('favorites')}
              style={{
                padding: '10px 20px',
                backgroundColor: viewMode === 'favorites' ? '#e74c3c' : '#e0e0e0',
                color: viewMode === 'favorites' ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ❤️ Favorites ({favCount})
            </button>
            
            <button
              onClick={() => setViewMode('add')}
              style={{
                padding: '10px 20px',
                backgroundColor: viewMode === 'add' ? '#28a745' : '#e0e0e0',
                color: viewMode === 'add' ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ➕ Add New Property
            </button>
            
            <button
              onClick={handleRefresh}
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
              🔄 Refresh
            </button>
            
            {/* Clear All button - only in development */}
            {isDevelopment && (
              <button
                onClick={handleClearAll}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🗑️ Clear All (Dev)
              </button>
            )}
          </div>
          
          {/* Filter Buttons (only show in list view) */}
          {viewMode === 'list' && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === 'all' ? '#007bff' : '#e0e0e0',
                  color: filter === 'all' ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Show All ({total})
              </button>
              
              <button
                onClick={() => setFilter('available')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === 'available' ? '#28a745' : '#e0e0e0',
                  color: filter === 'available' ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Available Only ({available})
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Loading State */}
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            margin: '20px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '20px', color: '#666' }}>Loading properties...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#fee',
            borderRadius: '12px',
            margin: '20px',
            border: '1px solid #fcc'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ color: '#c62828', marginBottom: '12px' }}>Error</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={handleRefresh}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>
          </div>
        )}
        
        {/* Content */}
        {!isLoading && !error && (
          <>
            {viewMode === 'add' ? (
              <AddHouseForm 
                onSuccess={handleAddHouse}
                onCancel={() => setViewMode('list')}
              />
            ) : (
              <HouseList 
                houses={displayedHouses}
                title={getTitle()}
              />
            )}
          </>
        )}
      </main>
      
      <footer style={{
        textAlign: 'center',
        padding: '30px',
        color: '#666',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
      }}>
        <p>🏡 House Rental Platform - Built with React + TypeScript + Zustand</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
          💾 Favorites are saved to localStorage and survive page reloads!
        </p>
      </footer>
    </div>
  );
}

export default App;