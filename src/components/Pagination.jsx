import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/components/ui/button"

const WINDOW = 2

function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const pages = []
  for (
    let current = Math.max(1, page - WINDOW);
    current <= Math.min(totalPages, page + WINDOW);
    current += 1
  ) {
    pages.push(current)
  }

  const first = pages[0]
  const last = pages[pages.length - 1]

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <p className="text-sm text-gray-400">
        Showing <span className="font-medium text-white">{from}</span>-
        <span className="font-medium text-white">{to}</span> of{" "}
        <span className="font-medium text-white">{total}</span> products
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="text-white hover:text-black disabled:text-gray-600 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Button>

        {first > 1 && <span className="px-1 text-gray-500">&hellip;</span>}

        {pages.map((current) => (
          <Button
            key={current}
            variant="outline"
            onClick={() => onPageChange(current)}
            className={
              current === page
                ? "w-9 bg-white text-black hover:bg-gray-100 cursor-pointer"
                : "w-9 text-white hover:bg-gray-800 cursor-pointer"
            }
          >
            {current}
          </Button>
        ))}

        {last < totalPages && <span className="px-1 text-gray-500">&hellip;</span>}

        <Button
          variant="ghost"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="text-white hover:text-black disabled:text-gray-600 cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination