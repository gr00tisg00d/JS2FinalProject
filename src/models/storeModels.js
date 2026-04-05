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
    }) {
        this.title = title
        this.img = img
        this.cost = cost
        this.shortDescription = shortDescription
        this.description = description
        this.perk = perk
        this.bestFor = bestFor
        this.itemType = itemType
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
}

export class IconItem extends StoreItem {
    constructor(data) {
        super({ ...data, itemType: 'icon' })
    }
}

export class InventoryEntry {
    constructor({ title, img, itemType, qty = 0 }) {
        this.title = title
        this.img = img
        this.itemType = itemType
        this.qty = qty
    }

    increment(amount = 1) {
        this.qty += amount
    }
}

export class CartLine {
    constructor(item, qty = 1) {
        this.item = item
        this.qty = qty
    }

    get title() {
        return this.item.title
    }

    get img() {
        return this.item.img
    }

    get cost() {
        return this.item.cost
    }

    get itemType() {
        return this.item.itemType
    }

    get description() {
        return this.item.description
    }

    get perk() {
        return this.item.perk
    }

    get bestFor() {
        return this.item.bestFor
    }

    increment(amount = 1) {
        this.qty += amount
    }

    decrement(amount = 1) {
        this.qty -= amount
    }
}

export class Cart {
    constructor(items = []) {
        this.items = items
    }

    get count() {
        return this.items.reduce((count, item) => count + item.qty, 0)
    }

    get total() {
        return this.items.reduce((total, item) => total + item.cost * item.qty, 0)
    }

    findLine(title) {
        return this.items.find((item) => item.title === title)
    }

    addItem(item) {
        const existingLine = this.findLine(item.title)

        if (existingLine) {
            existingLine.increment()
            return existingLine
        }

        const newLine = item.toCartLine()
        this.items.push(newLine)
        return newLine
    }

    remove(item) {
        const index = this.items.indexOf(item)

        if (index >= 0) {
            this.items.splice(index, 1)
        }
    }

    increment(item) {
        if (item) {
            item.increment()
        }
    }

    decrement(item) {
        if (!item) {
            return
        }

        item.decrement()

        if (item.qty <= 0) {
            this.remove(item)
        }
    }

    clear() {
        this.items.splice(0, this.items.length)
    }
}

export class FilterState {
    constructor(maxPrice) {
        this.search = ''
        this.minPrice = 1
        this.maxPrice = maxPrice
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

    matches(item) {
        return item.matchesSearch(this.search) && item.isWithinPriceRange(this.minPrice, this.maxPrice)
    }
}

export class UserProfileModel {
    constructor({
        balance = 100,
        level = 1,
        inventory = [],
        activeIcon = '',
        activeBanner = '',
        activeIDETheme = '',
    }) {
        this.balance = balance
        this.level = level
        this.inventory = inventory.map((entry) => new InventoryEntry(entry))
        this.activeIcon = activeIcon
        this.activeBanner = activeBanner
        this.activeIDETheme = activeIDETheme
    }

    addInventoryItem(item, quantity) {
        const existingEntry = this.inventory.find((entry) => entry.title === item.title)

        if (existingEntry) {
            existingEntry.increment(quantity)
            return
        }

        this.inventory.push(item.toInventoryEntry(quantity))
    }

    applyCheckout(cart) {
        this.balance -= cart.total

        cart.items.forEach((item) => {
            this.addInventoryItem(item.item, item.qty)
        })

        if (!this.activeIcon) {
            const firstPurchasedIcon = cart.items.find((item) => item.itemType === 'icon')

            if (firstPurchasedIcon) {
                this.activeIcon = firstPurchasedIcon.title
            }
        }

        return {
            items: cart.count,
            total: cart.total,
            remainingBalance: this.balance,
        }
    }
}

export const createIconCatalog = (items) => items.map((item) => new IconItem(item))

export class CatalogOption {
    constructor({ name, description = '' }) {
        this.name = name
        this.description = description
    }
}

export class ThemeOption extends CatalogOption {
    constructor({ name, accent, background, editor, description = '' }) {
        super({ name, description })
        this.accent = accent
        this.background = background
        this.editor = editor
    }
}

export class BannerOption extends CatalogOption {
    constructor({ name, background, tagline = '', description = '' }) {
        super({ name, description: description || tagline })
        this.background = background
        this.tagline = tagline
    }
}

export class SelectableCatalog {
    constructor(items, selectedName = '') {
        this.items = items
        this.selectedName = selectedName || items[0]?.name || ''
    }

    get selectedItem() {
        return this.items.find((item) => item.name === this.selectedName) ?? this.items[0] ?? null
    }

    select(name) {
        if (this.items.some((item) => item.name === name)) {
            this.selectedName = name
        }
    }
}

export class ThemeCatalog extends SelectableCatalog {
    constructor(items, userProfile) {
        super(items, userProfile.activeIDETheme)
        this.userProfile = userProfile
    }

    get themes() {
        return this.items
    }

    get selectedTheme() {
        return this.selectedItem
    }

    get appliedThemeName() {
        return this.userProfile.activeIDETheme
    }

    apply() {
        this.userProfile.activeIDETheme = this.selectedTheme?.name ?? ''
    }
}

export class BannerCatalog extends SelectableCatalog {
    constructor(items, userProfile) {
        super(items, userProfile.activeBanner)
        this.userProfile = userProfile
    }

    get banners() {
        return this.items
    }

    get selectedBanner() {
        return this.selectedItem
    }

    get pinnedBannerName() {
        return this.userProfile.activeBanner
    }

    pin() {
        this.userProfile.activeBanner = this.selectedBanner?.name ?? ''
    }
}

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
        return this.items.filter((item) => this.filters.matches(item))
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

export const createThemeOptions = (items) => items.map((item) => new ThemeOption(item))
export const createBannerOptions = (items) => items.map((item) => new BannerOption(item))