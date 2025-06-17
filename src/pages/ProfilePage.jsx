import { useState, useCallback } from "react"
import { useCart } from "@/context/CartContext"

import ProfileSection from "@/components/ProfileSection"
import SearchBar from "@/components/SearchBar"
import CartSection from "@/components/CartSection"
import ProductModal from "@/components/ProductModal"

import { useAuth } from "@/context/Auth"
import { useNavigate } from "react-router-dom"


const UserProfilePage = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [searchInput, setSearchInput] = useState("")

  if (!user) return null 

  const { name, email, username, phone, address } = user

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

  const handleAddToCart = async (productId) => {
    await addToCart(productId)
  };

  return (
    <div className="p-6 px-20">
      <div className="flex flex-row justify-between items-center mb-10 mt-5">
        <h1 className="text-3xl font-bold p-0 flex-1 cursor-pointer" onClick={() => navigate("/")}>Fake Store</h1>

        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={() => console.log("Searching", searchInput)}
        />

        <div className="flex flex-1 justify-end items-center gap-8">
          <ProfileSection />
          <CartSection onProductClick={openModal}/>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-black text-2xl font-bold text-center mb-6">My Profile</h2>

        <div className="space-y-4 text-gray-800 text-sm">
          <div>
            <span className="font-semibold">Username:</span> {username}
          </div>
          <div>
            <span className="font-semibold">Full Name:</span> {toCamelCase(name.firstname)} {toCamelCase(name.lastname)}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {phone}
          </div>

          <div>
            <span className="font-semibold">Address:</span><br />
              {address.number} {toCamelCase(address.street)}, {toCamelCase(address.city)}, {address.zipcode}<br />
            <span className="text-xs text-gray-500">
              Lat: {address.geolocation.lat}, Long: {address.geolocation.long}
            </span>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default UserProfilePage
