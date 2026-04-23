import { Outlet, NavLink } from 'react-router-dom';
import { useFavoritesCount } from '../store/houseStore';

export default function Layout() {
  const favoritesCount = useFavoritesCount();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
              🏠 House Rental
            </h1>
          </NavLink>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Home
            </NavLink>
            
            <NavLink
              to="/rentals"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Rentals
            </NavLink>
            
            <NavLink
              to="/favorites"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Favorites {favoritesCount > 0 && `(${favoritesCount})`}
            </NavLink>
            
            <NavLink
              to="/add-house"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Add House
            </NavLink>
            
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              About
            </NavLink>
          </div>
        </nav>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <Outlet />
      </main>
      
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white',
        marginTop: '2rem',
      }}>
        <p>🏡 House Rental Platform - Built with React + TypeScript + Zustand</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          © 2024 - All rights reserved
        </p>
      </footer>
    </div>
  );
}