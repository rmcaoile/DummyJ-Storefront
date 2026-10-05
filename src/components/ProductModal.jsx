import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { fetchProductById } from "@/state/products/productSlice"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button"

function ProductModal({ product, isOpen, onClose, onAddToCart, showButton }) {
  const dispatch = useDispatch()
  const hydrated = useSelector((state) =>
    product ? state.products.byId[product.id] : null
  )

  // Products opened from the cart are line items, which have no description or
  // category. Fetch the full record once so those fields fill in.
  useEffect(() => {
    if (!isOpen || !product) return
    if (product.description || hydrated) return
    dispatch(fetchProductById(product.id))
  }, [dispatch, isOpen, product, hydrated])

  const current = hydrated ?? product

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl bg-white text-black">
        {current && (
          <>
            <DialogHeader>
              <DialogTitle>{current.title}</DialogTitle>
            </DialogHeader>

            <img
              src={current.image || ""}
              alt={current.title || "N/A"}
              className="w-full h-60 object-contain mt-5 mb-4"
            />

            <p><strong>Price:</strong> ${current.price ?? "N/A"}</p>
            <p><strong>Category:</strong> {current.category || "N/A"}</p>
            <p><strong>Rating:</strong> {current.rating?.rate ?? "N/A"}</p>
            <p><strong>Description:</strong> {current.description || "N/A"}</p>
            <p><strong>Available Stock:</strong> {current.rating?.count ?? "N/A"}</p>

            {showButton && (
              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => {
                    onAddToCart(current.id);
                    onClose(false);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}


export default ProductModal
