import { createContext, useContext, useState, useCallback } from 'react'
import { currentUser } from '../mock/data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('cl_auth') === '1')
  const [user, setUser] = useState(currentUser)

  const login = useCallback(async (_credentials) => {
    // Mock network delay — backend to be wired later.
    await new Promise((res) => setTimeout(res, 900))
    localStorage.setItem('cl_auth', '1')
    setIsAuthenticated(true)
    return { success: true }
  }, [])

  const signup = useCallback(async (formData) => {
    await new Promise((res) => setTimeout(res, 1200))
    setUser((prev) => ({ ...prev, ...formData }))
    localStorage.setItem('cl_auth', '1')
    setIsAuthenticated(true)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cl_auth')
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
