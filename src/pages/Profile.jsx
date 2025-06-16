import { useAuth } from "@/context/Auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/components/ui/card"
import { Button } from "@/components/components/ui/button"
import { Link } from "react-router-dom"

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4">Please log in to view your profile</CardTitle>
            <Link to="/">
              <Button variant="default">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/pfp-placeholder.jpg" />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-bold">{user.username}</p>
              <p className="text-gray-500 text-sm">User ID: {user.id}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p><span className="font-semibold">Email:</span> {user.email || "Not provided"}</p>
            <p><span className="font-semibold">Username:</span> {user.username}</p>
          </div>

          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
