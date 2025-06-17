import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Auth";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [userCarts, setUserCarts] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const addToCart = async (productId) => {
    // console.log("Add to Cart clicked for product ID:", productId);

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
    <CartContext.Provider value={{ products, userCarts, setUserCarts, addToCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
}
