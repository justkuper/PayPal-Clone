import { createContext, useContext, useState, useEffect } from 'react'
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser()
      const session = await fetchAuthSession()
      setUser({ username: currentUser.username, ...session })
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const result = await signIn({ username: email, password })
    await checkUser()
    return result
  }

  async function register(email, password, name) {
    return await signUp({
      username: email,
      password,
      options: { userAttributes: { email, name } },
    })
  }

  async function confirmCode(email, code) {
    return await confirmSignUp({ username: email, confirmationCode: code })
  }

  async function logout() {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, confirmCode, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
