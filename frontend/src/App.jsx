import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ModalProvider } from "./context/ModalContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <NotificationProvider>
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredPermission="dashboard">
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/inventory" 
                  element={
                    <ProtectedRoute requiredPermission="inventory">
                      <Inventory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/billing" 
                  element={
                    <ProtectedRoute requiredPermission="billing">
                      <Billing />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute requiredPermission="reports">
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute requiredPermission="settings">
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </BrowserRouter>
          </ModalProvider>
        </NotificationProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
