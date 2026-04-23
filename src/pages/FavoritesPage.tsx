import { Link } from 'react-router-dom';
import { useFavorites, useHouses } from '../store/houseStore';
import HouseList from '../components/HouseList';

export default function FavoritesPage() {
  const favorites = useFavorites();
  const allHouses = useHouses();
  
  // Get full house objects for favorites
  const favoriteHouses = allHouses.filter(house => favorites.some(fav => fav.id === house.id));
  
  if (favoriteHouses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>❤️ My Favorites</h1>
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          padding: '3rem',
          marginTop: '2rem',
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
            You haven't added any favorites yet.
          </p>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            Click the heart icon on any property to add it to your favorites!
          </p>
          <Link
            to="/rentals"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              display: 'inline-block',
            }}
          >
            Browse Rentals →
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>❤️ My Favorites</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        You have {favoriteHouses.length} favorite property{favoriteHouses.length !== 1 ? 's' : ''}
      </p>
      <HouseList houses={favoriteHouses} />
    </div>
  );
}