import { useNavigate } from "react-router-dom"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/components/ui/popover"
import LoginForm from "@/components/LoginForm"
import { useAuth } from "@/context/Auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar"
import { ChevronDown } from "lucide-react";


const ProfileSection = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
            <div className="hidden items-center gap-1 sm:flex">
              <div>
                <p className="text-sm">{user ? "Hello" : "Login"}</p>
                <p className="font-bold flex items-center gap-1">
                  {user ? user.username : "Profile"}
                  <ChevronDown className="w-4 h-4" />
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 sm:hidden" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className={`relative -mr-7 ${
          user ? "w-40 px-0 py-2" : "w-80"
        }`}
      >
        <div className={`absolute -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-popover ${user ? "right-6.5" : "right-11.5"}`} />

        {user ? (
          <div className=" text-sm">
            <div
              className="px-4 py-2 hover:bg-accent hover:text-accent-foreground transition duration-150 ease-in-out cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </div>
            {/* <div
              className="px-4 py-2 hover:bg-gray-100 transition duration-150 ease-in-out hover:text-black hover:font-semibold cursor-pointer "
              onClick={() => console.log("My Orders clicked")}
            >
              My Orders
            </div> */}
            <div
              className="px-4 py-2 hover:bg-accent cursor-pointer transition duration-150 ease-in-out hover:text-accent-foreground hover:font-medium font-medium hover:text-destructive"
                onClick={() => {
                  logout()
                  navigate("/")
                }}
            >
              Logout
            </div>
          </div>
        ) : (
          <LoginForm />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default ProfileSection
