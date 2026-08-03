import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AppShell from './components/common/AppShell'
import NotFound from './components/common/NotFound'

import Welcome from './features/auth/Welcome'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import ForgotPassword from './features/auth/ForgotPassword'
import Dashboard from './features/dashboard/Dashboard'
import ReportIssue from './features/report/ReportIssue'
import MyReports from './features/myReports/MyReports'
import TrackComplaint from './features/trackComplaint/TrackComplaint'
import Profile from './features/profile/Profile'
import NotificationCenter from './features/notifications/NotificationCenter'
import Settings from './features/settings/Settings'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public / auth routes */}
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Citizen app routes (protected) */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="report" element={<ReportIssue />} />
                  <Route path="my-reports" element={<MyReports />} />
                  <Route path="track/:id" element={<TrackComplaint />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="notifications" element={<NotificationCenter />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
