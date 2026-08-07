import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RequireAuth, RequireSuperAdmin } from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import Duplicates from './pages/Duplicates'
import Notifications from './pages/Notifications'
import Hotspots from './pages/Hotspots'
import Settings from './pages/Settings'
import AdminManagement from './pages/AdminManagement'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/duplicates" element={<Duplicates />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/hotspots" element={<Hotspots />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/admin-management"
              element={
                <RequireSuperAdmin>
                  <AdminManagement />
                </RequireSuperAdmin>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
