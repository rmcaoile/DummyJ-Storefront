import { Card, CardContent, CardTitle } from "@/components/components/ui/card"
import { Button } from "@/components/components/ui/button"

function ProductCard({ product, onClick, onAddToCart }) {
  return (
    <Card
      onClick={onClick}
      className="transition duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-lg bg-white pt-3 pb-2 sm:pt-5"
    >
      <CardContent className="p-2 sm:p-4 flex flex-col h-full text-black">
        <img src={product.image} alt={product.title} className="w-full h-28 sm:h-48 object-contain" />
        <CardTitle className="text-xs sm:text-base mt-2 sm:mt-5 line-clamp-2">{product.title || "N/A"}</CardTitle>
        <p className="text-[11px] sm:text-sm text-muted-foreground">Price: ${product.price ?? "N/A"}</p>
        <p className="text-[11px] sm:text-sm text-muted-foreground">Category: {product.category || "N/A"}</p>
        <p className="text-[11px] sm:text-sm text-green-600 font-medium">Rating: {product.rating?.rate ?? "N/A"}</p>
        <div className="mt-auto">
          <Button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAddToCart(product.id); 
            }} 
            className="w-full mt-2 sm:mt-3 cursor-pointer bg-black text-white px-1 sm:px-4 py-1 sm:py-2 rounded text-[11px] sm:text-sm hover:bg-gray-800 transition"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


export default ProductCard
