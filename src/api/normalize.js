const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toImage = (raw) => raw.thumbnail ?? raw.images?.[0] ?? ""

const toRating = (raw) => ({
  rate: toNumber(raw.rating),
  count: Array.isArray(raw.reviews) ? raw.reviews.length : 0,
})

export function normalizeProduct(raw) {
  if (!raw) return null

  return {
    ...raw,
    id: raw.id,
    title: raw.title ?? "",
    price: toNumber(raw.price),
    category: raw.category ?? "",
    description: raw.description ?? "",
    image: toImage(raw),
    rating: toRating(raw),
  }
}

export function normalizeProducts(payload) {
  const list = payload?.products ?? []
  return list.map(normalizeProduct).filter(Boolean)
}

export function normalizeUser(raw) {
  if (!raw) return null

  const address = raw.address ?? {}

  return {
    ...raw,
    name: {
      firstname: raw.firstName ?? "",
      lastname: raw.lastName ?? "",
    },
    address: {
      ...address,
      number: address.number ?? "",
      street: address.address ?? "",
      city: address.city ?? "",
      zipcode: address.postalCode ?? "",
      geolocation: {
        lat: address.coordinates?.lat ?? "",
        long: address.coordinates?.lng ?? "",
      },
    },
  }
}

export function normalizeUsers(payload) {
  const list = payload?.users ?? []
  return list.map(normalizeUser).filter(Boolean)
}

export function normalizeCart(raw) {
  if (!raw) return null

  return {
    ...raw,
    products: (raw.products ?? []).map((item) => ({
      ...item,
      productId: item.id,
      image: toImage(item),
      price: toNumber(item.price),
      rating: toRating(item),
    })),
  }
}

export function normalizeCarts(payload) {
  const list = payload?.carts ?? []
  return list.map(normalizeCart).filter(Boolean)
}

export function extractToken(payload) {
  return payload?.accessToken ?? null
}