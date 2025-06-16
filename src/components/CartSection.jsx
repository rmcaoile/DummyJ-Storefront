import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import axios from "axios"

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
          <SheetTitle>Your Cart History</SheetTitle>
        </SheetHeader>

        {userCarts.length === 0 ? (
          <div className="mt-4 text-gray-500 text-center">No cart history found.</div>
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
      </SheetContent>
    </Sheet>
  );
}

export default CartSection;
