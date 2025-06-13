import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/components/ui/popover"
import LoginForm from "@/components/LoginForm"
import { useAuth } from "@/context/Auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar"
import { Button } from "@/components/components/ui/button"

const ProfileSection = () => {
  const { user, logout } = useAuth()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarImage
              className="border border-gray-300 rounded-full"
              src="/pfp-placeholder.jpg"
            />
            <AvatarFallback>pfp</AvatarFallback>
          </Avatar>
          <div>
            {!user && <p className="text-sm">Login / Signup</p>}
            <p className="font-bold">{user ? user.username : "Profile"}</p>
          </div>

        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80  bg-gray-600">
        {/* TODO: fix ui */}
        {user ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <LoginForm />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default ProfileSection
