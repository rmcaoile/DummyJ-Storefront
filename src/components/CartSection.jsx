import { ShoppingCart, Plus, Minus, Trash } from "lucide-react"
import { Badge } from "@/components/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/components/ui/sheet"
import { Button } from "@/components/components/ui/button"

function CartSection({ userCarts, setUserCarts }) {
  const totalCartItems = userCarts.reduce(
    (total, cart) => total + cart.products.length, 0
  );

  const handleQuantityChange = (cartId, productId, delta) => {
    const updatedCarts = userCarts
      .map(cart => {
        if (cart.id !== cartId) return cart
        let updatedProducts = cart.products.map(p => {
          if (p.id !== productId) return p
          const currentQuantity = p.quantity || 1
          const newQuantity = currentQuantity + delta
          if (newQuantity < 1) return null;     // If minus is selected while quantity is 1 return null
          return { ...p, quantity: newQuantity }
        }).filter(p => p !== null)              // Remove item in cart if quantity is zero
        return { ...cart, products: updatedProducts }
      })
      .filter(cart => cart.products.length > 0);   // Remove cart if there are no more items
    setUserCarts(updatedCarts)
  }

  const handleRemoveProduct = (cartId, productId) => {
    const updatedCarts = userCarts
      .map(cart => {
        if (cart.id !== cartId) return cart
        const updatedProducts = cart.products.filter(p => p.id !== productId)
        return { ...cart, products: updatedProducts }
      })
      .filter(cart => cart.products.length > 0); 
    setUserCarts(updatedCarts)   // Remove cart if there are no more items
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer relative group">
          <ShoppingCart className="w-7 h-7 text-white" />
          <Badge className="absolute -top-2 -right-3 bg-white text-black h-5 min-w-5 rounded-full px-1 font-mono tabular-nums group-hover:scale-110 transition-transform duration-200">
            {totalCartItems}
          </Badge>
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto bg-[#242424] "
      >
        <SheetHeader>
          <SheetTitle className="text-xl">Your Cart History</SheetTitle>
        </SheetHeader>

        {/* Scrollable cart */}
        <div className="flex-1 overflow-y-auto mt-2">
          {userCarts.length === 0 ? (
            <div className="text-gray-400 text-center">No cart history found.</div>
          ) : (
            userCarts.map((cart) => (
              <div
                key={cart.id}
                className="text-black mb-6 border p-4 rounded bg-white shadow-sm mx-5"
              >
                <h3 className="font-semibold mb-2">Cart ID: {cart.id}</h3>
                {cart.products.map((product, index) => (
                  <div
                    key={`${cart.id}-${index}`}
                    className="flex items-center gap-4 mb-3"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-contain"
                    />
                    {/* TODO: fix ui */}
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex-1">
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-800">
                          ${product.price?.toFixed(2)} × {product.quantity || 1} = $
                          {(product.price * (product.quantity || 1)).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center  ml-4">
                        <div className="flex items-center gap-2 border border-gray-500 rounded">
                          <div
                            className="p-2 hover:bg-gray-200 rounded transition duration-200"
                            onClick={() => handleQuantityChange(cart.id, product.id, -1)}
                          >
                            <Minus className="w-3 h-3 text-gray-900" />
                          </div>
                          <span>{product.quantity || 1}</span>
                          <div
                            className="p-2 hover:bg-gray-200 rounded transition duration-200"
                            onClick={() => handleQuantityChange(cart.id, product.id, 1)}
                          >
                            <Plus className="w-3 h-3 text-gray-900" />
                          </div>
                        </div>

                        <div className="cursor-pointer">
                          <p
                            className="text-gray-900 text-sm hover:text-red-500 transition duration-200"
                            onClick={() => handleRemoveProduct(cart.id, product.id)}
                          >
                            Remove
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* View Cart button */}
        {userCarts.length > 0 &&
            <div className="p-4 border-t border-gray-700 bg-[#242424] sticky bottom-0">
              <Button
                className="w-full py-2 px-4 bg-white text-black rounded font-semibold hover:bg-gray-700 hover:text-white transition-colors duration-200"
                onClick={() => console.log("Navigating to full cart page")}
              >
                View Cart
              </Button>
            </div>          
        }
      </SheetContent>
    </Sheet>
  );
}

export default CartSection;
