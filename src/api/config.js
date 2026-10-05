export const API_BASE_URL = "https://dummyjson.com"

export const LIST_ALL_PARAMS = { limit: 0 }

export const PRODUCTS_PAGE_SIZE = 20

export function buildProductsUrl({
  page = 1,
  limit = PRODUCTS_PAGE_SIZE,
  category = "All",
  search = "",
} = {}) {
  const skip = (page - 1) * limit
  const term = search.trim()

  if (term) {
    return {
      url: `/products/search?q=${encodeURIComponent(term)}&limit=${limit}&skip=${skip}`,
      categoryScoped: category && category !== "All",
    }
  }

  if (category && category !== "All") {
    return {
      url: `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`,
      categoryScoped: false,
    }
  }

  return {
    url: `/products?limit=${limit}&skip=${skip}`,
    categoryScoped: false,
  }
}