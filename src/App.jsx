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

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("https://fakestoreapi.com/products")

      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error("No products found.")
      }

      setProducts(response.data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products.")
    } finally {
      setLoading(false)
    }
  }

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

    </div>
  )
}

export default App
