import { Search } from "lucide-react"

function SearchBar({ searchInput, setSearchInput, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="flex flex-1 items-center">
      <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-md p-2 border border-gray-300 border-r-0 rounded-l-md shadow-sm"
      />
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
