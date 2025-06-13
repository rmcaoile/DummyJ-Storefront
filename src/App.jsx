import { useState, useEffect } from "react"
import { useAuth } from "@/context/Auth"
import axios from "axios"
import ProfileSection from "@/components/ProfileSection"
import ProductModal from "@/components/ProductModal"
import ProductCard from "@/components/ProductCard"
import SearchBar from "@/components/SearchBar"

import { Card, CardContent, CardTitle } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Button } from "@/components/components/ui/button"
import { ShoppingCart, Search } from "lucide-react"


function App() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const [userCarts, setUserCarts] = useState([])

  // Fetch products 
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const productRes = await axios.get("https://fakestoreapi.com/products")
        if (!Array.isArray(productRes.data)) throw new Error("No products found.")
        console.log(productRes.data)
        setProducts(productRes.data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, []) 


  // Fetch user carts 
  useEffect(() => {
    const fetchCarts = async () => {
      if (!user || user.id == null ) {
        console.log("Skipping cart fetch")
        setUserCarts([])
        return
      }
      
      try {
        const cartRes = await axios.get("https://fakestoreapi.com/carts")
        const filteredCarts = cartRes.data.filter(cart => cart.userId === user.id)

        const cartsWithDetails = filteredCarts.map(cart => ({
          ...cart,
          products: cart.products.map(p => {
            const fullProduct = products.find(fp => fp.id === p.productId)
            if (!fullProduct) {
              console.warn(`No product found for productId ${p.productId}`)
              return { ...p, title: "Unknown Product", price: 0 }
            }
            return {
              ...p,
              ...fullProduct,
            }
          }),
        }))

        console.log(cartsWithDetails)
        setUserCarts(cartsWithDetails)
      } catch (err) {
        console.error("Error fetching carts:", err)
        setError(prev => prev ? prev + " Failed to load carts." : "Failed to load carts.")
        setUserCarts([])
      }
    }
    fetchCarts()
  }, [user, products]) 


  const openModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title + " " + product.category)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })


  return (
    <div className="p-6 px-20">

      <div className="flex flex-row justify-between items-center mb-10 mt-5">      
        {/* Store Name */}
        <h1 className="text-3xl font-bold p-0 flex-1">Fake Store</h1>

        {/* Search Bar */}
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={() => setSearchTerm(searchInput)}
        />

        <div className="flex flex-1 justify-end items-center gap-8">  
          {/* Profile Section */}
          <ProfileSection />

          {/* Shopping Cart */}
          <div>
            {/* TODO: Badge */}
            <ShoppingCart className="w-7 h-7 text-white cursor-pointer" />
          </div>
        </div>
      </div>


      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            onClick={() => 
              setCategoryFilter((prev) =>
                prev === category ? "All" : category
              )}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Skeleton for loading */}
        {loading ? (
          [...Array(12)].map((_, i) => (
            <Card key={i} className="pt-5 pb-2 bg-white">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="w-full h-48 rounded mb-4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/8" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full flex justify-center">
            <div className="bg-red-100 text-red-700 p-4 rounded w-full max-w-md text-center">
              <h2 className="font-bold text-lg mb-2">Error</h2>
              <p>{error}</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No results found.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openModal(product)}
            />
          ))
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
      />

      {userCarts.length > 0 && (
        <div className="my-10">
          <h2 className="text-xl font-bold mb-4">Your Cart History</h2>
          {userCarts.map((cart) => (
            <div key={cart.id} className="text-black mb-6 border p-4 rounded bg-white shadow-sm">
              <h3 className="font-semibold mb-2">Cart ID: {cart.id}</h3>
              {cart.products.map((product, index) => (
                <div key={`${cart.id}-${index}`} className="flex items-center gap-4 mb-3">
                  <img src={product.image} alt={product.title} className="w-12 h-12 object-contain" />
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-600">
                      ${product.price?.toFixed(2)} × {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}



    </div>
  )
}

export default App
