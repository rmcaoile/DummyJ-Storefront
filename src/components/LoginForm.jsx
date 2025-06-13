import { useState } from "react"
import { useAuth } from "../context/Auth"
import { Button } from "@/components/components/ui/button"
import { Input } from "@/components/components/ui/input"
import { Label } from "@/components/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/components/ui/card"
import { Alert, AlertDescription } from "@/components/components/ui/alert"

function LoginForm() {
  const { login, error, user } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ username, password })
  }

  return (
    <Card className="max-w-md mx-auto shadow-none border-none py-3 gap-1">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Profile */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {user ? (
          <p className="text-green-600 font-medium text-center">
            Logged in as <strong>{user.username}</strong>
          </p>
        ) : (
          <div>
            <p className="mb-3">Enter your e-mail and password:</p>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div>
                <Label htmlFor="username" className="mb-1">Username <span className="text-red-300">*</span></Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1">Password <span className="text-red-300">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LoginForm
