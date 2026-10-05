import { Search, X } from "lucide-react"

function SearchBar({ searchInput, setSearchInput, onSearch, onClear }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const handleClear = () => {
    setSearchInput("")
    onClear()
  }

  return (
    <div className="flex w-full min-w-0 flex-1 justify-center">
      <div className="relative flex w-full max-w-md min-w-0">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 border-r-0 rounded-l-md shadow-sm p-2 pr-9"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div
        className="bg-white flex items-center justify-center p-2 cursor-pointer border border-gray-300 border-l-0 rounded-r-md shadow-sm"
        onClick={onSearch}
      >
        <Search className="text-black" />
      </div>
    </div>
  )
}

export default SearchBar
