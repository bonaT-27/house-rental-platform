import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RentalsPage from './pages/RentalsPage';
import HouseDetailPage from './pages/HouseDetailPage';
import AddHousePage from './pages/AddHousePage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Route configuration with TypeScript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'rentals',
        element: <RentalsPage />,
      },
      {
        path: 'rentals/:id',
        element: <HouseDetailPage />,
      },
      {
        path: 'add-house',
        element: <AddHousePage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Type for route parameters
export type RouteParams = {
  'rentals/:id': { id: string };
};

// Helper function for type-safe navigation
export function getRoutePath<T extends keyof RouteParams>(
  route: T,
  params?: RouteParams[T]
): string;
export function getRoutePath(route: string, params?: Record<string, string | number>): string {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
}