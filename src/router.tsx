import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load pages for code splitting
// eslint-disable-next-line react-refresh/only-export-components
const HomePage = lazy(() => import("./pages/HomePage"));
// eslint-disable-next-line react-refresh/only-export-components
const RentalsPage = lazy(() => import("./pages/RentalsPage"));
// eslint-disable-next-line react-refresh/only-export-components
const HouseDetailPage = lazy(() => import("./pages/HouseDetailPage"));
// eslint-disable-next-line react-refresh/only-export-components
const AddHousePage = lazy(() => import("./pages/AddHousePage"));
// eslint-disable-next-line react-refresh/only-export-components
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
// eslint-disable-next-line react-refresh/only-export-components
const AboutPage = lazy(() => import("./pages/AboutPage"));
// eslint-disable-next-line react-refresh/only-export-components
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading component for Suspense
// eslint-disable-next-line react-refresh/only-export-components
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.2rem",
      color: "#666",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 1rem",
        }}
      />
      Loading...
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Route configuration with lazy loading
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "rentals",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RentalsPage />
          </Suspense>
        ),
      },
      {
        path: "rentals/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <HouseDetailPage />
          </Suspense>
        ),
      },
      {
        path: "add-house",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AddHousePage />
          </Suspense>
        ),
      },
      {
        path: "favorites",
        element: (
          <Suspense fallback={<PageLoader />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
