import { useState } from 'react';
import HouseList from './components/HouseList';
import { AddHouseForm } from './components/AddHouseForm';
import { mockHouses } from './data/mockHousesData';
import { House } from './types/house';
import { HouseFormData as HouseFormDataType } from './schemas/houseSchema';

type ViewMode = 'list' | 'add';

function App() {
  const [houses, setHouses] = useState<House[]>([...mockHouses] as House[]);
  const [filter, setFilter] = useState<'all' | 'available'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleAddHouse = (formData: HouseFormDataType) => {
    const newHouse: House = {
      ...formData,
      id: (houses.length + 1).toString(),
    };
    
    setHouses(prev => [...prev, newHouse]);
    setViewMode('list'); // Switch back to list view
    console.log('New house added:', newHouse);
  };

  const filteredHouses = filter === 'available' 
    ? houses.filter(house => house.isAvailable)
    : houses;

  const totalHouses = houses.length;
  const availableHouses = houses.filter(h => h.isAvailable).length;

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
          
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '20px',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <strong>Total:</strong> {totalHouses} properties
            </div>
            <div>
              <strong>Available:</strong> {availableHouses} properties
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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

            {viewMode === 'list' && (
              <>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: filter === 'all' ? '#007bff' : '#e0e0e0',
                    color: filter === 'all' ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Show All ({totalHouses})
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
                    fontWeight: 'bold'
                  }}
                >
                  Available Only ({availableHouses})
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {viewMode === 'list' ? (
          <HouseList 
            houses={filteredHouses}
            title={filter === 'available' ? 'Available Properties' : 'All Properties'}
          />
        ) : (
          <AddHouseForm 
            onSuccess={handleAddHouse}
            onCancel={() => setViewMode('list')}
          />
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
        <p>🏡 House Rental Platform - Built with React + TypeScript</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
          Add new properties with our validated form!
        </p>
      </footer>
    </div>
  );
}

export default App;