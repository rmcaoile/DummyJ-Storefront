import { createContext, useContext, useState } from "react"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  const login = async (credentials) => {
    try {
        // Log-in and get token
        const res = await axios.post("https://fakestoreapi.com/auth/login", credentials)
        console.log(res.data)
        const authToken = res.data.token
        setToken(authToken)
      
        // Get all users
        const usersRes = await axios.get("https://fakestoreapi.com/users")

        // Find specific user using username
        const matchedUser = usersRes.data.find(user => user.username === credentials.username)

        if (!matchedUser) {
            setError("User not found.")
            return
        }

        setUser(matchedUser)
        console.log(matchedUser)
        setError(null)
    } catch (err) {
      console.error("Login failed:", err)
      setError("Invalid username or password.")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
