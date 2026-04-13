import { Cart } from './cartModels.js'
import { FilterState } from './filterModels.js'
import { StoreItem } from './itemModels.js'

export class StoreSession {
  constructor({ items, userProfile }) {
    this.items = items
    this.userProfile = userProfile
    this.activeSection = 'icons'
    this.activeSidebarPanel = 'filters'
    this.filters = new FilterState(StoreItem.getPriceCap(items))
    this.cart = new Cart()
    this.lastOrder = null
  }

  get priceCap() {
    return StoreItem.getPriceCap(this.items)
  }

  get filteredItems() {
    return this.filters.sortItems(
      this.items.filter((item) => this.filters.matches(item, this.priceCap)),
    )
  }

  get featuredItem() {
    return StoreItem.getFeaturedItem(this.items)
  }

  get cartItems() {
    return this.cart.items
  }

  get cartCount() {
    return this.cart.count
  }

  get checkoutTotal() {
    return this.cart.total
  }

  get hasEnoughBalance() {
    return this.userProfile.balance >= this.checkoutTotal
  }

  get balanceShortfall() {
    return Math.max(0, this.checkoutTotal - this.userProfile.balance)
  }

  get canSubmitCheckout() {
    return this.cartItems.length > 0 && this.hasEnoughBalance
  }

  get isFilterSidebarOpen() {
    return this.activeSidebarPanel === 'filters'
  }

  get isCartSidebarOpen() {
    return this.activeSidebarPanel === 'cart'
  }

  get showFilters() {
    return this.activeSection !== 'home'
  }

  get showSidebarFilters() {
    return this.showFilters && this.activeSection !== 'icons'
  }

  openSidebarPanel(panel) {
    this.activeSidebarPanel = panel
  }

  setActiveSection(section) {
    this.activeSection = section
  }

  updateSearch(value) {
    this.filters.updateSearch(value)
  }

  updateMinPrice(value) {
    this.filters.updateMinPrice(value)
  }

  updateMaxPrice(value) {
    this.filters.updateMaxPrice(value)
  }

  updateRarity(value) {
    this.filters.updateRarity(value)
  }

  updateSort(value) {
    this.filters.updateSort(value)
  }

  addItemToCart(item) {
    if (!item) {
      return
    }

    this.cart.addItem(item)
    this.openSidebarPanel('cart')
  }

  clearCart() {
    this.cart.clear()
  }

  removeFromCart(item) {
    this.cart.remove(item)
  }

  incrementQty(item) {
    this.cart.increment(item)
  }

  decrementQty(item) {
    this.cart.decrement(item)
  }

  submitCheckout() {
    if (!this.canSubmitCheckout) {
      return
    }

    this.lastOrder = this.userProfile.applyCheckout(this.cart)
    this.clearCart()
  }
}
