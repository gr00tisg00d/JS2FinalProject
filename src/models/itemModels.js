import { CartLine, InventoryEntry } from './cartModels.js'

export class StoreItem {
  constructor({
    title,
    img,
    cost,
    shortDescription = '',
    description = '',
    perk = '',
    bestFor = '',
    itemType = 'item',
    ...attributes
  }) {
    this.title = title
    this.img = img
    this.cost = cost
    this.shortDescription = shortDescription
    this.description = description
    this.perk = perk
    this.bestFor = bestFor
    this.itemType = itemType
    Object.assign(this, attributes)
  }

  matchesSearch(searchTerm) {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return true
    }

    return this.title.toLowerCase().includes(normalizedSearch)
  }

  isWithinPriceRange(minPrice, maxPrice) {
    return this.cost >= minPrice && this.cost <= maxPrice
  }

  toCartLine(quantity = 1) {
    return new CartLine(this, quantity)
  }

  toInventoryEntry(quantity = 1) {
    return new InventoryEntry({
      title: this.title,
      img: this.img,
      itemType: this.itemType,
      qty: quantity,
    })
  }

  static getPriceCap(items) {
    return Math.max(1, ...items.map((item) => item.cost))
  }

  static getFeaturedItem(items) {
    return [...items].sort((left, right) => right.cost - left.cost)[0] ?? null
  }

  static getRarityTier(item, maxPrice) {
    const safeCap = Math.max(1, maxPrice)
    const priceRatio = item.cost / safeCap

    if (priceRatio >= 0.85) {
      return 'legendary'
    }

    if (priceRatio >= 0.65) {
      return 'epic'
    }

    if (priceRatio >= 0.4) {
      return 'rare'
    }

    return 'common'
  }
}

export class IconItem extends StoreItem {
  constructor(data) {
    super({ ...data, itemType: 'icon' })
  }
}

export const createIconCatalog = (items) => items.map((item) => new IconItem(item))
