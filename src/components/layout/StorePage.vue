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
import { StoreSession } from '@/models/storeModels.js'
import { themeOptions } from '@/data/themes.js'
import { bannerOptions } from '@/data/banners.js'

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
    return {
      session: new StoreSession({
        items: this.items,
        userProfile: this.userProfile,
      }),
    }
  },
  computed: {
    themeCount() {
      return themeOptions.length
    },
    bannerCount() {
      return bannerOptions.length
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
          :is-open="session.isFilterSidebarOpen"
          @toggle="session.openSidebarPanel('filters')"
        >
          <store-section-nav
            class="mb-3"
            :active-section="session.activeSection"
            @select-section="session.setActiveSection($event)"
          ></store-section-nav>
          <div v-if="session.showSidebarFilters" class="sidebar-filter-slot">
            <filter-panel
              :filters="session.filters"
              :price-cap="session.priceCap"
              @update-search="session.updateSearch($event)"
              @update-min-price="session.updateMinPrice($event)"
              @update-max-price="session.updateMaxPrice($event)"
            ></filter-panel>
          </div>
          <div
            v-else-if="session.activeSection === 'icons'"
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
          :is-open="session.isCartSidebarOpen"
          @toggle="session.openSidebarPanel('cart')"
        >
          <!-- Actions Slot -->
          <template #actions>
            <button
              class="btn btn-sm btn-outline-primary"
              type="button"
              @click="session.clearCart()"
            >
              Clear
            </button>
          </template>
          <cart-summary-section
            :cart-items="session.cartItems"
            :checkout-total="session.checkoutTotal"
            @remove-item="session.removeFromCart($event)"
            @increment-item="session.incrementQty($event)"
            @decrement-item="session.decrementQty($event)"
          ></cart-summary-section>
        </sidebar-panel-shell>
      </aside>

      <!-- Store grid -->
      <section class="col-12 col-lg-9 d-flex flex-column app-surface py-2 store-content-panel">
        <div class="store-scroll">
          <!-- Home -->
          <store-home-section
            v-if="session.activeSection === 'home'"
            :featured-item="session.featuredItem"
            :icon-count="items.length"
            :theme-count="themeCount"
            :banner-count="bannerCount"
            :cart-count="session.cartCount"
            @navigate-section="session.setActiveSection($event)"
            @add-item="session.addItemToCart($event)"
          ></store-home-section>

          <!-- Icon Section -->
          <store-icons-section
            v-else-if="session.activeSection === 'icons'"
            :items="session.filteredItems"
            :filters="session.filters"
            :price-cap="session.priceCap"
            @update-search="session.updateSearch($event)"
            @update-min-price="session.updateMinPrice($event)"
            @update-max-price="session.updateMaxPrice($event)"
            @add-item="session.addItemToCart($event)"
          ></store-icons-section>

          <!-- Others -->
          <store-themes-section
            v-else-if="session.activeSection === 'themes'"
            :user-profile="userProfile"
          ></store-themes-section>
          <store-banners-section
            v-else-if="session.activeSection === 'banners'"
            :user-profile="userProfile"
          ></store-banners-section>
        </div>
      </section>
    </div>

    <mobile-filter-modal
      :active-section="session.activeSection"
      :show-filters="session.showFilters"
      :filters="session.filters"
      :price-cap="session.priceCap"
      @select-section="session.setActiveSection($event)"
      @update-search="session.updateSearch($event)"
      @update-min-price="session.updateMinPrice($event)"
      @update-max-price="session.updateMaxPrice($event)"
    ></mobile-filter-modal>
    <mobile-cart-modal
      :cart-items="session.cartItems"
      :cart-count="session.cartCount"
      :checkout-total="session.checkoutTotal"
      @clear-cart="session.clearCart()"
      @remove-item="session.removeFromCart($event)"
      @increment-item="session.incrementQty($event)"
      @decrement-item="session.decrementQty($event)"
    ></mobile-cart-modal>
    <checkout-modal
      :cart-items="session.cartItems"
      :cart-count="session.cartCount"
      :checkout-total="session.checkoutTotal"
      :wallet-balance="userProfile.balance"
      :has-enough-balance="session.hasEnoughBalance"
      :balance-shortfall="session.balanceShortfall"
      :can-submit="session.canSubmitCheckout"
      :last-order="session.lastOrder"
      @submit-order="session.submitCheckout()"
      @remove-item="session.removeFromCart($event)"
      @increment-item="session.incrementQty($event)"
      @decrement-item="session.decrementQty($event)"
    ></checkout-modal>
  </main>
</template>

<style scoped></style>
