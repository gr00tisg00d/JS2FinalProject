<script>
import FilterPanel from '@/components/features/filters/FilterPanel.vue'
import CartSummarySection from '@/components/features/cart/CartSummarySection.vue'
import StoreHomeSection from '@/components/features/store/StoreHomeSection.vue'
import StoreIconsSection from '@/components/features/store/StoreIconsSection.vue'
import StoreThemesSection from '@/components/features/store/StoreThemesSection.vue'
import StoreBannersSection from '@/components/features/store/StoreBannersSection.vue'
import StoreSectionNav from '@/components/features/store/StoreSectionNav.vue'
import MobileFilterModal from '@/components/features/filters/MobileFilterModal.vue'
import MobileCartModal from '@/components/features/cart/MobileCartModal.vue'
import CheckoutModal from '@/components/features/checkout/CheckoutModal.vue'
import SidebarPanelShell from '@/components/layout/SidebarPanelShell.vue'
import { Cart, FilterState, StoreItem } from '@/models/storeModels.js'

export default {
  name: 'StorePage',
  components: {
    FilterPanel,
    CartSummarySection,
    StoreHomeSection,
    StoreIconsSection,
    StoreThemesSection,
    StoreBannersSection,
    StoreSectionNav,
    MobileFilterModal,
    MobileCartModal,
    CheckoutModal,
    SidebarPanelShell,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    userProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    const initialPriceCap = StoreItem.getPriceCap(this.items)

    return {
      activeSection: 'icons',
      activeSidebarPanel: 'filters',
      filters: new FilterState(initialPriceCap),
      cart: new Cart(),
      lastOrder: null,
    }
  },
  computed: {
    priceCap() {
      return StoreItem.getPriceCap(this.items)
    },
    filteredIcons() {
      return this.items.filter((item) => this.filters.matches(item))
    },
    featuredItem() {
      return StoreItem.getFeaturedItem(this.items)
    },
    cartItems() {
      return this.cart.items
    },
    cartCount() {
      return this.cart.count
    },
    checkoutTotal() {
      return this.cart.total
    },
    hasEnoughBalance() {
      return this.userProfile.balance >= this.checkoutTotal
    },
    balanceShortfall() {
      return Math.max(0, this.checkoutTotal - this.userProfile.balance)
    },
    canSubmitCheckout() {
      return this.cartItems.length > 0 && this.hasEnoughBalance
    },
    isFilterSidebarOpen() {
      return this.activeSidebarPanel === 'filters'
    },
    isCartSidebarOpen() {
      return this.activeSidebarPanel === 'cart'
    },
    showFilters() {
      return this.activeSection !== 'home'
    },
    showSidebarFilters() {
      return this.showFilters && this.activeSection !== 'icons'
    },
  },
  methods: {
    openSidebarPanel(panel) {
      this.activeSidebarPanel = panel
    },
    setActiveSection(section) {
      this.activeSection = section
    },
    updateSearch(value) {
      this.filters.updateSearch(value)
    },
    updateMinPrice(value) {
      this.filters.updateMinPrice(value)
    },
    updateMaxPrice(value) {
      this.filters.updateMaxPrice(value)
    },
    addItemToCart(item) {
      if (!item) {
        return
      }

      this.cart.addItem(item)
      this.openSidebarPanel('cart')
    },
    clearCart() {
      this.cart.clear()
    },
    removeFromCart(item) {
      this.cart.remove(item)
    },
    incrementQty(item) {
      this.cart.increment(item)
    },
    decrementQty(item) {
      this.cart.decrement(item)
    },
    submitCheckout() {
      if (!this.canSubmitCheckout) {
        return
      }

      this.lastOrder = this.userProfile.applyCheckout(this.cart)

      this.clearCart()
    },
  },
}
</script>

<template>
  <main class="container flex-grow-1 py-3 d-flex flex-column overflow-hidden store-page-main">
    <!-- Mobile: open filter/cart modals -->
    <div
      class="position-fixed top-50 end-0 translate-middle-y me-3 d-flex flex-column gap-2 d-lg-none z-3"
    >
      <button
        class="btn btn-primary rounded-circle"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#filterModal"
      >
        <i class="bi bi-funnel"></i>
      </button>
      <button
        class="btn btn-primary rounded-circle"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#cartModal"
      >
        <i class="bi bi-cart"></i>
        <span
          v-if="cartCount > 0"
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >{{ cartCount }}</span
        >
      </button>
    </div>

    <div class="row g-3 store-container">
      <!-- Desktop sidebar -->
      <aside class="col-lg-3 d-none d-lg-flex flex-column store-sidebar-column">
        <!-- Filter Panel -->
        <sidebar-panel-shell
          class="store-filter-sidebar"
          eyebrow="Browse"
          title="Filters"
          :is-open="isFilterSidebarOpen"
          @toggle="openSidebarPanel('filters')"
        >
          <store-section-nav
            class="mb-3"
            :active-section="activeSection"
            @select-section="setActiveSection"
          ></store-section-nav>
          <div v-if="showSidebarFilters" class="sidebar-filter-slot">
            <filter-panel
              :filters="filters"
              :price-cap="priceCap"
              @update-search="updateSearch"
              @update-min-price="updateMinPrice"
              @update-max-price="updateMaxPrice"
            ></filter-panel>
          </div>
          <div
            v-else-if="activeSection === 'icons'"
            class="small text-body-secondary sidebar-empty-state"
          ></div>
          <div v-else class="small text-body-secondary sidebar-empty-state">
            No filters on Home.
          </div>
        </sidebar-panel-shell>

        <!-- Cart Panel -->
        <sidebar-panel-shell
          class="cart-sidebar-panel"
          eyebrow="Basket"
          title="Cart"
          :is-open="isCartSidebarOpen"
          @toggle="openSidebarPanel('cart')"
        >
          <!-- Actions Slot -->
          <template #actions>
            <button class="btn btn-sm btn-outline-primary" type="button" @click="clearCart">
              Clear
            </button>
          </template>
          <cart-summary-section
            :cart-items="cartItems"
            :checkout-total="checkoutTotal"
            @remove-item="removeFromCart"
            @increment-item="incrementQty"
            @decrement-item="decrementQty"
          ></cart-summary-section>
        </sidebar-panel-shell>
      </aside>

      <!-- Store grid -->
      <section class="col-12 col-lg-9 d-flex flex-column app-surface py-2 store-content-panel">
        <div class="store-scroll">
          <!-- Home -->
          <store-home-section
            v-if="activeSection === 'home'"
            :featured-item="featuredItem"
            :icon-count="items.length"
            :theme-count="3"
            :banner-count="3"
            :cart-count="cartCount"
            @navigate-section="setActiveSection"
            @add-item="addItemToCart"
          ></store-home-section>

          <!-- Icon Section -->
          <store-icons-section
            v-else-if="activeSection === 'icons'"
            :items="filteredIcons"
            :filters="filters"
            :price-cap="priceCap"
            @update-search="updateSearch"
            @update-min-price="updateMinPrice"
            @update-max-price="updateMaxPrice"
            @add-item="addItemToCart"
          ></store-icons-section>

          <!-- Others -->
          <store-themes-section v-else-if="activeSection === 'themes'"></store-themes-section>
          <store-banners-section v-else-if="activeSection === 'banners'"></store-banners-section>
        </div>
      </section>
    </div>

    <mobile-filter-modal
      :active-section="activeSection"
      :show-filters="showFilters"
      :filters="filters"
      :price-cap="priceCap"
      @select-section="setActiveSection"
      @update-search="updateSearch"
      @update-min-price="updateMinPrice"
      @update-max-price="updateMaxPrice"
    ></mobile-filter-modal>
    <mobile-cart-modal
      :cart-items="cartItems"
      :cart-count="cartCount"
      :checkout-total="checkoutTotal"
      @clear-cart="clearCart"
      @remove-item="removeFromCart"
      @increment-item="incrementQty"
      @decrement-item="decrementQty"
    ></mobile-cart-modal>
    <checkout-modal
      :cart-items="cartItems"
      :cart-count="cartCount"
      :checkout-total="checkoutTotal"
      :wallet-balance="userProfile.balance"
      :has-enough-balance="hasEnoughBalance"
      :balance-shortfall="balanceShortfall"
      :can-submit="canSubmitCheckout"
      :last-order="lastOrder"
      @submit-order="submitCheckout"
      @remove-item="removeFromCart"
      @increment-item="incrementQty"
      @decrement-item="decrementQty"
    ></checkout-modal>
  </main>
</template>

<style scoped></style>
