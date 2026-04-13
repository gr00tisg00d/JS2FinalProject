import { StoreItem } from './itemModels.js'

export class FilterState {
  constructor(maxPrice) {
    this.search = ''
    this.minPrice = 1
    this.maxPrice = maxPrice
    this.rarity = 'all'
    this.sortBy = 'featured'
  }

  updateSearch(value) {
    this.search = value
  }

  updateMinPrice(value) {
    this.minPrice = Math.min(Number(value), this.maxPrice)
  }

  updateMaxPrice(value) {
    this.maxPrice = Math.max(Number(value), this.minPrice)
  }

  updateRarity(value) {
    this.rarity = value
  }

  updateSort(value) {
    this.sortBy = value
  }

  matches(item, maxPrice) {
    const matchesRarity =
      this.rarity === 'all' || StoreItem.getRarityTier(item, maxPrice) === this.rarity

    return (
      matchesRarity &&
      item.matchesSearch(this.search) &&
      item.isWithinPriceRange(this.minPrice, this.maxPrice)
    )
  }

  sortItems(items) {
    const sortedItems = [...items]

    switch (this.sortBy) {
      case 'price-asc':
        return sortedItems.sort((left, right) => left.cost - right.cost)
      case 'price-desc':
        return sortedItems.sort((left, right) => right.cost - left.cost)
      case 'name-asc':
        return sortedItems.sort((left, right) => left.title.localeCompare(right.title))
      case 'rarity-desc':
        return sortedItems.sort((left, right) => right.cost - left.cost)
      default:
        return sortedItems
    }
  }
}
