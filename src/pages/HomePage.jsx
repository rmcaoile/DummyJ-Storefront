import { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "sonner";

import { fetchCategories, fetchProducts } from "@/state/products/productSlice"
import { addToCart } from "@/state/cart/cartSlice"
import { PRODUCTS_PAGE_SIZE } from "@/api/config"
import { useAuth } from "@/context/Auth"
import { cn } from "@/components/lib/utils"

import { Card, CardContent } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Button } from "@/components/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

  const allCategories = useMemo(() => ["All", ...categories], [categories])

  const isHomeFromHomePage = useRef(true)
  const headerRef = useRef(null)
  const railRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [railOverflow, setRailOverflow] = useState({ left: false, right: false })

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const update = () => setHeaderHeight(header.offsetHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // With 24 categories the rail scrolls, so the arrows have to appear and
  // disappear based on the current scroll offset, not just on whether the rail
  // overflows at all.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const update = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth

      setRailOverflow({
        left: rail.scrollLeft > 1,
        right: rail.scrollLeft < maxScroll - 1,
      })
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(rail)
    rail.addEventListener("scroll", update, { passive: true })

    return () => {
      observer.disconnect()
      rail.removeEventListener("scroll", update)
    }
  }, [allCategories])

  const scrollRail = (direction) => {
    const rail = railRef.current
    if (!rail) return

    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" })
  }

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

  // Clearing the query drops the search term but keeps the active category
  const handleClearSearch = useCallback(() => {
    setPage(1)
    setSearchTerm("")
  }, [])

  const handleAddToCart = (productId) => {
    if (!user || !user.id) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) {
      toast.error("Product not found.");
      return;
    }
    dispatch(addToCart({ userId: user.id, product }));
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <h1 className="w-full text-center text-2xl font-bold sm:w-auto sm:text-left sm:text-3xl">Redux Store</h1>
          <div className="flex w-full min-w-0 items-center gap-6 sm:flex-1 sm:gap-8">
            <SearchBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
            <div className="flex shrink-0 items-center gap-6 sm:gap-8">
              <ProfileSection />
              <CartSection onProductClick={openModalfromCart}/>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">

      {/* Category Filters */}
      <div
        className="sticky z-30 -mx-4 mb-6 sm:-mx-6 lg:-mx-8"
        style={{ top: headerHeight }}
      >
        <div className="relative">
          <div
            ref={railRef}
            role="group"
            aria-label="Categories"
            className="flex snap-x gap-2 overflow-x-auto border-b border-border/60 bg-background/80 py-2 pl-4 pr-10 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:pl-6 sm:pr-12 sm:scroll-pl-6 lg:pl-8 lg:scroll-pl-8 scroll-pl-4"
          >
            {allCategories.map((category) => {
              const isActive = categoryFilter === category

              return (
                <Button
                  key={category}
                  size="sm"
                  variant="ghost"
                  aria-pressed={isActive}
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "shrink-0 snap-start cursor-pointer rounded-full text-xs sm:text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {category === "All" ? category : formatCategory(category)}
                </Button>
              )
            })}
          </div>

          {/* Fades signal there are more categories off-screen */}
          {railOverflow.left && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent sm:w-12" />
          )}
          {railOverflow.right && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent sm:w-12" />
          )}

          {/* Arrows only render while there is something hidden in that direction */}
          {railOverflow.left && (
            <Button
              size="icon"
              variant="outline"
              aria-label="Scroll categories left"
              onClick={() => scrollRail(-1)}
              className="absolute left-1 top-1/2 z-10 size-7 -translate-y-1/2 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 sm:left-2"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
          {railOverflow.right && (
            <Button
              size="icon"
              variant="outline"
              aria-label="Scroll categories right"
              onClick={() => scrollRail(1)}
              className="absolute right-1 top-1/2 z-10 size-7 -translate-y-1/2 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 sm:right-2"
            >
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {loading ? (
          [...Array(PRODUCTS_PAGE_SIZE)].map((_, i) => (
            <Card key={i} className="pt-3 sm:pt-5 pb-2 bg-white">
              <CardContent className="p-2 sm:p-4 space-y-2">
                <Skeleton className="w-full h-28 sm:h-48 rounded mb-4" />
                <Skeleton className="h-4 sm:h-6 w-3/4" />
                <Skeleton className="h-3 sm:h-4 w-1/2" />
                <Skeleton className="h-3 sm:h-4 w-1/4" />
                <Skeleton className="h-3 sm:h-4 w-1/8" />
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
