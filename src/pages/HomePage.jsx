import { useState, useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchProducts } from "@/state/products/productSlice"
import { addToCart } from "@/state/cart/cartSlice"
import { useAuth } from "@/context/Auth"

import { Card, CardContent } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Button } from "@/components/components/ui/button"

import ProductModal from "@/components/ProductModal"
import ProductCard from "@/components/ProductCard"
import ProfileSection from "@/components/ProfileSection"
import SearchBar from "@/components/SearchBar"
import CartSection from "@/components/CartSection"

function HomePage() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const products = useSelector(state => state.products.items)
  const loading = useSelector(state => state.products.loading)
  const error = useSelector(state => state.products.error)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const isHomeFromHomePage =  useRef(true)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const openModal = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)    
    isHomeFromHomePage.current = true
  }, [])

  const openModalfromCart = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    isHomeFromHomePage.current = false
  }, [])

  const categories = ["All", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title + " " + product.category)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })
  
  const handleAddToCart = (productId) => {
    if (!user || !user.id) {
      alert("Please log in to add items to your cart.");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) {
      alert("Product not found.");
      return;
    }
    dispatch(addToCart({ userId: user.id, product }));
  };

  return (
    <div className="p-6 px-20">
      <div className="flex flex-row justify-between items-center mb-10 mt-5">
        <h1 className="text-3xl font-bold p-0 flex-1">Fake Store</h1>
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={() => setSearchTerm(searchInput)}
        />        
        <div className="flex flex-1 justify-end items-center gap-8">
          <ProfileSection />
          <CartSection onProductClick={openModalfromCart}/>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "outline" : "default"}
            onClick={() =>
              setCategoryFilter((prev) => (prev === category ? "All" : category))
            }
            className="cursor-pointer"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onAddToCart={handleAddToCart}
        showButton={isHomeFromHomePage.current}
      />

    </div>
  )
}

export default HomePage
