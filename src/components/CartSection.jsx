import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/components/ui/sheet"

function CartSection({ userCarts }) {
  const totalCartItems = userCarts.reduce(
    (total, cart) => total + cart.products.length, 0
  );

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
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-600">
                        ${product.price?.toFixed(2)} × {product.quantity || 1} = $
                        {(product.price * (product.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* View Cart button */}
        <div className="p-4 border-t border-gray-700 bg-[#242424] sticky bottom-0">
          <button
            className="w-full py-2 px-4 bg-white text-white rounded font-semibold hover:bg-gray-200 transition-colors duration-200"
            onClick={() => console.log("Navigating to full cart page")}
          >
            View Cart
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CartSection;
