export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>About House Rental Platform</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginTop: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h2>🏠 Our Mission</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
          To provide a seamless, type-safe, and delightful house rental experience 
          using modern web technologies.
        </p>
        
        <h2>⚙️ Built With</h2>
        <ul style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
          <li>React 18 with TypeScript</li>
          <li>Zustand for state management</li>
          <li>React Router for navigation</li>
          <li>React Hook Form + Zod for validation</li>
          <li>Vitest + Testing Library for testing</li>
        </ul>
        
        <h2>🎯 Features</h2>
        <ul style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
          <li>Browse available properties</li>
          <li>Search and filter by location, price, bedrooms</li>
          <li>Save favorites to localStorage</li>
          <li>Add new properties with validation</li>
          <li>Responsive design for all devices</li>
          <li>Full TypeScript support</li>
        </ul>
      </div>
    </div>
  );
}