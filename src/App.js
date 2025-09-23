import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

// Components
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import SheetMusicLibrary from "./components/SheetMusicLibrary";
import MusicTheory from "./components/MusicTheory";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return !user ? children : <Navigate to="/" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Router>
        {user && <Navbar />}
        <main className={user ? "pt-16" : ""}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <SheetMusicLibrary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/theory"
              element={
                <ProtectedRoute>
                  <MusicTheory />
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
          </Routes>
        </main>
        <Toaster />
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
