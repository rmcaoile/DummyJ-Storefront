import { Card, CardContent, CardTitle } from "@/components/components/ui/card"

function ProductCard({ product, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="transition duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-lg bg-white cursor-pointer pt-5 pb-2"
    >
      <CardContent className="p-4 space-y-2 text-black">
        <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />
        <CardTitle className="text-base mt-5">{product.title || "N/A"}</CardTitle>
        <p className="text-sm text-muted-foreground">Price: ${product.price ?? "N/A"}</p>
        <p className="text-sm text-muted-foreground">Category: {product.category || "N/A"}</p>
        <p className="text-sm text-green-600 font-medium">Rating: {product.rating?.rate ?? "N/A"}</p>
      </CardContent>
    </Card>
  )
}

export default ProductCard
