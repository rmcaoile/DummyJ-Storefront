import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"

import { useAuth } from "@/context/Auth"
import ProductModal from "@/components/ProductModal"
import ProductCard from "@/components/ProductCard"
import ProfileSection from "@/components/ProfileSection"
import SearchBar from "@/components/SearchBar"
import CartSection from "@/components/CartSection"

import { Card, CardContent, CardTitle } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Button } from "@/components/components/ui/button"

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
  const [userCarts, setUserCarts] = useState([]);

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
    const loadCarts = async () => {
      if (!user || !user.id) {
        setUserCarts([]);
        return;
      }

      // Per-user key
      const localKey = `userCarts-${user.id}`;
      const saved = JSON.parse(localStorage.getItem(localKey)) || [];

      if (saved.length > 0) {
        setUserCarts(saved);
        return;
      }

      // Fetch using API if no local data
      try {
        const cartRes = await axios.get("https://fakestoreapi.com/carts");
        const filtered = cartRes.data.filter((cart) => cart.userId === user.id);

        const apiUserCarts = filtered.map((cart) => ({
          ...cart,
          products: cart.products.map((p) => {
            const full = products.find((fp) => fp.id === p.productId);
            return full
              ? { ...full, quantity: p.quantity || 1 }
              : { id: p.productId, title: "Unknown Product", price: 0, quantity: p.quantity || 1 };
          }),
        }));

        setUserCarts(apiUserCarts);
      } catch (err) {
        console.error("Failed to fetch API carts", err);
        setUserCarts([]);
      }
    };

    loadCarts();
  }, [user, products]);

  
  // Saving user carts to local storage
  useEffect(() => {
    if (user && user.id) {
      const localKey = `userCarts-${user.id}`;
      localStorage.setItem(localKey, JSON.stringify(userCarts));
    }
  }, [user, userCarts]);


  const openModal = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const categories = ["All", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title + " " + product.category)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  
  const handleAddToCart = async (productId) => {
    console.log("Add to Cart clicked for product ID:", productId);

    if (!user || !user.id) {
      alert("Please log in to add items to your cart.");
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      alert("Product not found.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if a cart already exists for today
    const cartIndex = userCarts.findIndex(
      (cart) => cart.userId === user.id && cart.date === today
    );

    let updatedCarts;

    if (cartIndex !== -1) {
      // Add to existing cart
      const existingCart = { ...userCarts[cartIndex] };
      const existingProductIndex = existingCart.products.findIndex(
        (p) => p.id === productId
      );

      // If item already exist
      if (existingProductIndex !== -1) {
        // Increase quantity
        existingCart.products[existingProductIndex].quantity += 1;
      } else {
        // Add new product with quantity 1
        existingCart.products.push({ ...product, quantity: 1 });
      }

      updatedCarts = [...userCarts];
      updatedCarts[cartIndex] = existingCart;
      
      // console.log(updatedCarts);
      // For exercise — send PUT to update the cart in fakestoreapi
      axios.put(`https://fakestoreapi.com/carts/${existingCart.id}`, {
        id: existingCart.id,
        userId: existingCart.userId,
        products: existingCart.products
      })
      .then(response => console.log("Cart updated:", response.data))
      .catch(err => console.error("Failed to update cart:", err));

    } else {
      // Create new cart
      const newCart = {
        id: Date.now(), // local ID
        userId: user.id,
        date: today,
        products: [{ ...product, quantity: 1 }],
      };
      updatedCarts = [newCart, ...userCarts];      
      console.log(updatedCarts);

      // For exercise
      axios.post('https://fakestoreapi.com/carts', updatedCarts[0])
        .then(response => console.log("Added new cart", response.data))
        .catch(err => console.error("Failed to add new cart:", err));
    }
    
    // Local Storage save
    setUserCarts(updatedCarts);
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

          <CartSection userCarts={userCarts} />
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
        onAddToCart={handleAddToCart}
      />

    </div>
  )
}

export default App
