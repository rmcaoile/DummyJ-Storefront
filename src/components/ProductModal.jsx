import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { fetchProductById } from "@/state/products/productSlice"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button"
import { Star, ShoppingCart, ChevronDown, ChevronUp, Package } from "lucide-react"
import { cn } from "@/components/lib/utils"

function ProductModal({ product, isOpen, onClose, onAddToCart, showButton }) {
  const dispatch = useDispatch()
  const hydrated = useSelector((state) =>
    product ? state.products.byId[product.id] : null
  )

  useEffect(() => {
    if (!isOpen || !product) return
    if (product.description || hydrated) return
    dispatch(fetchProductById(product.id))
  }, [dispatch, isOpen, product, hydrated])

  const current = hydrated ?? product
  const [expanded, setExpanded] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const descRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setExpanded(false)
    }
  }, [isOpen])

  const checkOverflow = () => {
    if (descRef.current && current.description) {
      const { scrollHeight, clientHeight } = descRef.current
      const hasOverflow = scrollHeight > clientHeight + 4
      setShowReadMore(hasOverflow)
    }
  }

  useLayoutEffect(() => {
    if (!current) return
    checkOverflow()
    const rafId = requestAnimationFrame(checkOverflow)
    return () => cancelAnimationFrame(rafId)
  }, [current?.description, expanded])

  if (!current) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-white text-black",
        "max-w-[calc(100%-1rem)] sm:max-w-[420px] lg:max-w-5xl",
        "max-h-[calc(100%-1rem)] sm:max-h-[90vh]",
        "overflow-hidden"
      )}>
        <DialogClose className="text-gray-400 hover:text-gray-600 transition-colors" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden h-full">
          <div className="relative bg-gray-50 lg:border-r lg:border-gray-100 flex items-center justify-center p-2 lg:p-8 overflow-hidden min-h-0 min-h-[150px] lg:min-h-[350px]">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <img
                src={current.image || ""}
                alt={current.title || "N/A"}
                className="w-full h-auto max-h-[150px] lg:max-h-none object-contain drop-shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 pr-4 lg:pr-8 min-h-0">
              <DialogHeader className="mb-4 lg:mb-6 flex-shrink-0">
                <DialogTitle className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight pr-10">
                  {current.title}
                </DialogTitle>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="capitalize">{current.category || "N/A"}</span>
                  <span className="flex items-center gap-1">
                    <Package className="size-3.5" />
                    {current.rating?.count ?? "N/A"} in stock
                  </span>
                </div>
              </DialogHeader>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6 p-4 bg-gray-50 rounded-xl flex-shrink-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-2xl lg:text-3xl font-bold text-gray-900 whitespace-nowrap">
                    ${current.price ?? "N/A"}
                  </span>
                  {current.rating?.rate && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
                      <Star className="text-yellow-400 size-5 fill-current" />
                      <span className="text-lg font-semibold text-gray-900">
                        {current.rating.rate.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({current.rating.count ?? 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 min-h-0">
                {current.description && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 lg:p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 shrink-0 w-full sm:w-28 flex-shrink-0">
                      Description
                    </dt>
                    <dd className="text-sm text-gray-900 leading-relaxed flex-1 min-w-0">
                      <div
                        ref={descRef}
                        className={cn(
                          "break-words transition-all duration-200",
                          expanded ? "whitespace-pre-wrap" : "whitespace-pre-wrap line-clamp-2 sm:line-clamp-3 lg:line-clamp-5"
                        )}
                      >
                        {current.description}
                      </div>
                      {showReadMore && (
                        <button
                          type="button"
                          onClick={() => setExpanded(!expanded)}
                          className="mt-2 text-sm font-medium text-black hover:text-gray-700 flex items-center gap-1"
                        >
                          {expanded ? (
                            <>
                              <ChevronUp className="size-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-4" />
                              Read More
                            </>
                          )}
                        </button>
                      )}
                    </dd>
                  </div>
                )}
              </div>
            </div>

            {showButton && (
              <div className="flex-shrink-0 pt-4 lg:pt-6 border-t border-gray-100 bg-white/95 backdrop-blur-sm z-10 px-4 lg:px-8 pb-4 lg:pb-6">
                <Button
                  className={cn(
                    "w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg font-medium rounded-xl",
                    "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
                    "transition-all duration-200 shadow-sm hover:shadow-md",
                    "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
                    "flex items-center justify-center gap-2"
                  )}
                  onClick={() => {
                    onAddToCart(current.id)
                    onClose(false)
                  }}
                >
                  <ShoppingCart className="size-5 flex-shrink-0" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ label, value, multiline }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 lg:p-4 bg-gray-50/50 rounded-lg border border-gray-100">
      <dt className="text-sm font-medium text-gray-500 shrink-0 w-full sm:w-28">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 leading-relaxed flex-1 min-w-0 break-words">
        {multiline ? (
          <p className="whitespace-pre-wrap">{value}</p>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

export default ProductModal