import { useState, useCallback, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { fetchCategories, fetchProducts } from "@/state/products/productSlice"
import { addToCart } from "@/state/cart/cartSlice"
import { PRODUCTS_PAGE_SIZE } from "@/api/config"
import { useAuth } from "@/context/Auth"

import { Card, CardContent } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Button } from "@/components/components/ui/button"

import ProductModal from "@/components/ProductModal"
import ProductCard from "@/components/ProductCard"
import ProfileSection from "@/components/ProfileSection"
import SearchBar from "@/components/SearchBar"
import CartSection from "@/components/CartSection"
import Pagination from "@/components/Pagination"

const formatCategory = (slug) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

function HomePage() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const products = useSelector(state => state.products.items)
  const total = useSelector(state => state.products.total)
  const categories = useSelector(state => state.products.categories)
  const loading = useSelector(state => state.products.loading)
  const error = useSelector(state => state.products.error)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [page, setPage] = useState(1)

  const isHomeFromHomePage = useRef(true)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProducts({ page, category: categoryFilter, search: searchTerm }))
  }, [dispatch, page, categoryFilter, searchTerm])

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

  // Search and filtering happen on the server, so changing either has to reset to page 1 
  const handleSearch = useCallback(() => {
    setPage(1)
    setSearchTerm(searchInput)
  }, [searchInput])

  const handleCategoryClick = useCallback((category) => {
    setPage(1)
    setCategoryFilter((prev) => (prev === category ? "All" : category))
  }, [])

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

  const allCategories = ["All", ...categories]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Dummy Store</h1>
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSearch={handleSearch}
          />
          <div className="flex items-center gap-6 sm:gap-8">
            <ProfileSection />
            <CartSection onProductClick={openModalfromCart}/>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {allCategories.map((category) => (
          <Button
            key={category}
            variant="outline"
            onClick={() => handleCategoryClick(category)}
            className={
              categoryFilter === category
                ? "bg-white text-black hover:bg-gray-100 cursor-pointer"
                : "text-white hover:bg-gray-800 cursor-pointer"
            }
          >
            {category === "All" ? category : formatCategory(category)}
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
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No results found.
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openModal(product)}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        total={total}
        limit={PRODUCTS_PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onAddToCart={handleAddToCart}
        showButton={isHomeFromHomePage.current}
      />
      </div>
    </>
  )
}

export default HomePage
