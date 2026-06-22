import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Marketplace from '../pages/Marketplace';
import Community from '../pages/Community';
import SinglePost from '../pages/SinglePost';
import RideEvents from '../pages/RideEvents';
import RideEventDetails from '../pages/RideEventDetails';
import CreateRideEvent from '../pages/CreateRideEvent';
import ProductDetails from '../pages/ProductDetails';
import Garage from '../pages/Garage';
import SellBike from '../pages/SellBike';
import EditBike from '../pages/EditBike';
import UserProfile from '../pages/UserProfile';
import Forbidden from '../pages/Forbidden';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        }
      />

      <Route
        path="/community/post/:id"
        element={
          <ProtectedRoute>
            <SinglePost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ride-events"
        element={
          <ProtectedRoute>
            <RideEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ride-events/create"
        element={
          <ProtectedRoute>
            <CreateRideEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ride-events/:id/edit"
        element={
          <ProtectedRoute>
            <CreateRideEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ride-events/:id"
        element={
          <ProtectedRoute>
            <RideEventDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/garage"
        element={
          <ProtectedRoute>
            <Garage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell-bike"
        element={
          <ProtectedRoute>
            <SellBike />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-bike/:id"
        element={
          <ProtectedRoute>
            <EditBike />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin-only example route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 403 Forbidden */}
      <Route path="/403" element={<Forbidden />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
