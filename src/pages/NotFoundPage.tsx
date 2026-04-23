import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#e74c3c' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
        }}
      >
        Go Home →
      </Link>
    </div>
  );
}