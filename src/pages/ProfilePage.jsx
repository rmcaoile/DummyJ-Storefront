import { useState, useCallback } from "react"
import { useAuth } from "@/context/Auth"
import { Navigate, useNavigate } from "react-router-dom"

import ProfileSection from "@/components/ProfileSection"
import CartSection from "@/components/CartSection"
import ProductModal from "@/components/ProductModal"
import { Button } from "@/components/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react";


const ProfilePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const openModal = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  if (!user) return <Navigate to="/" replace />

  const { name, email, username, phone, address } = user


  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <h1 className="w-full text-center text-2xl font-bold sm:w-auto sm:text-left sm:text-3xl cursor-pointer" onClick={() => navigate("/")}>Redux Store</h1>
          <div className="flex w-full min-w-0 items-center justify-end gap-6 sm:flex-1 sm:gap-8">
            <div className="flex shrink-0 items-center gap-6 sm:gap-8">
              <ProfileSection />
              <CartSection onProductClick={openModal}/>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">

      {/* Profile Content */}
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-black text-2xl font-bold text-center mb-6">My Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src="/pfp-placeholder.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <p className="mt-3 text-lg font-semibold text-gray-900">
            {toCamelCase(name.firstname)} {toCamelCase(name.lastname)}
          </p>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>

        <div className="space-y-4 text-gray-800 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" />
            <div>
              <span className="font-semibold">Email:</span> {email}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" />
            <div>
              <span className="font-semibold">Phone:</span> {phone}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" />
            <div>
              <span className="font-semibold">Address:</span><br />
                {address.number} {toCamelCase(address.street)}, {toCamelCase(address.city)}, {address.zipcode}<br />
              <span className="text-xs text-gray-500">
                Lat: {address.geolocation.lat}, Long: {address.geolocation.long}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate("/")}
        className="mt-6 bg-gray-500 text-white hover:bg-gray-600 transition px-4 py-2 rounded mx-auto block cursor-pointer"
      >
        ← Back to Home
      </Button>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
      />
      </div>
    </>
  )
}

export default ProfilePage
