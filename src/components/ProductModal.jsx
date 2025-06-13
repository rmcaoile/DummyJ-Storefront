import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/components/ui/dialog"

function ProductModal({ product, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl bg-white text-black">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>{product.title}</DialogTitle>
            </DialogHeader>
            <img
              src={product.image || ""}
              alt={product.title || "N/A"}
              className="w-full h-60 object-contain mt-5 mb-4"
            />
            <p><strong>Price:</strong> ${product.price ?? "N/A"}</p>
            <p><strong>Category:</strong> {product.category || "N/A"}</p>
            <p><strong>Rating:</strong> {product.rating?.rate ?? "N/A"}</p>
            <p><strong>Description:</strong> {product.description || "N/A"}</p>
            <p><strong>Available Stock:</strong> {product.rating?.count ?? "N/A"}</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductModal
