import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { ShoppingCart } from "lucide-react"

import { useAuth } from "@/context/Auth"
import ProductModal from "@/components/ProductModal"
import ProductCard from "@/components/ProductCard"
import ProfileSection from "@/components/ProfileSection"
import SearchBar from "@/components/SearchBar"

import { Card, CardContent, CardTitle } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Button } from "@/components/components/ui/button"
import { Badge } from "@/components/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/components/ui/sheet"

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
        const res = await axios.get("https://fakestoreapi.com/products")
        if (!Array.isArray(res.data)) throw new Error("No products found.")
        setProducts(res.data)
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
      if (!user || user.id == null) {
        console.log("Skipping cart fetch")
        setUserCarts([])
        return
      }

      try {
        const cartRes = await axios.get("https://fakestoreapi.com/carts")
        const filteredCarts = cartRes.data.filter((cart) => cart.userId === user.id)

        const cartsWithDetails = filteredCarts.map((cart) => ({
          ...cart,
          products: cart.products.map((p) => {
            const fullProduct = products.find((fp) => fp.id === p.productId)
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

        setUserCarts(cartsWithDetails)
      } catch (err) {
        console.error("Error fetching carts:", err)
        setError((prev) => (prev ? prev + " Failed to load carts." : "Failed to load carts."))
        setUserCarts([])
      }
    }

    fetchCarts()
  }, [user, products])

  const openModal = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const totalCartItems = userCarts.reduce((total, cart) => total + cart.products.length, 0)
  const categories = ["All", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title + " " + product.category)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleAddToCart = async (productId) => {
    if (!user || !user.id) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const latestCart = userCarts[0];

      let updatedCart;
      if (latestCart) {
        // Add product to existing cart
        const updatedProducts = [...latestCart.products, { productId, quantity: 1 }];
        updatedCart = {
          userId: user.id,
          date: new Date().toISOString().split("T")[0],
          products: updatedProducts.map(p => ({
            productId: p.productId || p.id,
            quantity: p.quantity || 1
          }))
        };
        await axios.put(`https://fakestoreapi.com/carts/${latestCart.id}`, updatedCart);
      } else {
        // Create new cart
        updatedCart = {
          userId: user.id,
          date: new Date().toISOString().split("T")[0],
          products: [{ productId, quantity: 1 }]
        };
        await axios.post("https://fakestoreapi.com/carts", updatedCart);
      }

      alert("Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert("Something went wrong adding to cart.");
    }
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

          <Sheet>
            <SheetTrigger asChild>
              <div className="cursor-pointer relative group">
                <ShoppingCart className="w-7 h-7 text-white" />
                <Badge className="absolute -top-2 -right-3 bg-white text-black h-5 min-w-5 rounded-full px-1 font-mono tabular-nums group-hover:scale-110 transition-transform duration-200">
                  {totalCartItems}
                </Badge>
              </div>
            </SheetTrigger>

            <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto bg-[#242424]">
              <SheetHeader>
                <SheetTitle>Your Cart History</SheetTitle>
              </SheetHeader>

              {userCarts.length === 0 ? (
                <div className="mt-4 text-gray-500 text-center">No cart history found.</div>
              ) : (
                userCarts.map((cart) => (
                  <div key={cart.id} className="text-black mb-6 border p-4 rounded bg-white shadow-sm mx-5">
                    <h3 className="font-semibold mb-2">Cart ID: {cart.id}</h3>
                    {cart.products.map((product, index) => (
                      <div key={`${cart.id}-${index}`} className="flex items-center gap-4 mb-3">
                        <img src={product.image} alt={product.title} className="w-12 h-12 object-contain" />
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-600">${product.price?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            onClick={() =>
              setCategoryFilter((prev) => (prev === category ? "All" : category))
            }
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
      />

    </div>
  )
}

export default App
