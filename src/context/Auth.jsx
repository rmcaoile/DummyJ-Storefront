import { createContext, useContext, useState, useEffect  } from "react"
import { toast } from "sonner";

import { api } from "@/api/client"
import { LIST_ALL_PARAMS } from "@/api/config"
import { extractToken, normalizeUsers } from "@/api/normalize"

const AuthContext = createContext()

function toCamelCase(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  // Get auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (credentials) => {
    try {
        // Log-in and get token
        const res = await api.post("/auth/login", credentials)
        const authToken = extractToken(res.data)

        if (!authToken) {
          setError("Invalid username or password.")
          toast.error("Login failed: invalid username or password.");
          return
        }

        // Get all users
        const usersRes = await api.get("/users", { params: LIST_ALL_PARAMS })

        // Find specific user using username
        const matchedUser = normalizeUsers(usersRes.data).find(user => user.username === credentials.username)
        
        if (!matchedUser) {
          setError("User not found.")
          toast.error("Login failed: user not found.");
          return
        }
        
        // Save state
        setToken(authToken)
        setUser(matchedUser)
        setError(null)

        // Save too Local storage
        localStorage.setItem("token", authToken)
        localStorage.setItem("user", JSON.stringify(matchedUser))     
        
        toast.success(`Welcome, ${toCamelCase(matchedUser.name.firstname)}!`);
    } catch (err) {
      console.error("Login failed:", err)
      setError("Invalid username or password.")
      toast.error("Login failed: Invalid username or password.");
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast("You have been logged out.");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
