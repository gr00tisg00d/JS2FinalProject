<script>
const bannerHeroImage = new URL('../../../Images/banners/banner01.jpg', import.meta.url).href

export default {
  name: 'StoreIconsSection',
  data() {
    return {
      hoveredItem: null,
      hoveredIndex: -1,
      activeCardElement: null,
      previewAnimationFrame: null,
      previewStyle: {},
      previewPlacement: 'above',
      viewportWidth: typeof window === 'undefined' ? 1200 : window.innerWidth,
    }
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    filters: {
      type: Object,
      required: true,
    },
    priceCap: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'add-item',
    'update-search',
    'update-min-price',
    'update-max-price',
    'update-rarity',
    'update-sort',
  ],
  computed: {
    heroBackgroundStyle() {
      return {
        '--store-hero-image': `url('${bannerHeroImage}')`,
      }
    },
    itemRows() {
      const cardsPerRow = this.getCardsPerRow()
      const rows = []

      for (let index = 0; index < this.items.length; index += cardsPerRow) {
        rows.push(
          this.items.slice(index, index + cardsPerRow).map((item, offset) => ({
            item,
            index: index + offset,
          })),
        )
      }

      return rows
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.syncPreviewToActiveCard, true)
    document.addEventListener('click', this.handleDocumentClick)
    document.addEventListener('keydown', this.handleDocumentKeydown)
  },
  beforeUnmount() {
    this.stopPreviewTracking()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.syncPreviewToActiveCard, true)
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('keydown', this.handleDocumentKeydown)
  },
  methods: {
    normalizePriceInput(rawValue, fallbackValue) {
      const numericValue = Number(rawValue)

      if (!Number.isFinite(numericValue)) {
        return fallbackValue
      }

      return Math.max(1, Math.min(this.priceCap, Math.round(numericValue)))
    },
    getRarityTier(item) {
      const priceRatio = item.cost / this.priceCap

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
    },
    getRarityLabel(item) {
      return {
        common: 'Common',
        rare: 'Rare',
        epic: 'Epic',
        legendary: 'Legendary',
      }[this.getRarityTier(item)]
    },
    handleResize() {
      this.viewportWidth = window.innerWidth
      this.syncPreviewToActiveCard()
    },
    stopPreviewTracking() {
      if (this.previewAnimationFrame !== null) {
        window.cancelAnimationFrame(this.previewAnimationFrame)
        this.previewAnimationFrame = null
      }
    },
    startPreviewTracking() {
      this.stopPreviewTracking()

      const updatePosition = () => {
        if (this.hoveredItem && this.activeCardElement) {
          this.syncPreviewToActiveCard()
          this.previewAnimationFrame = window.requestAnimationFrame(updatePosition)
        }
      }

      this.previewAnimationFrame = window.requestAnimationFrame(updatePosition)
    },
    syncPreviewToActiveCard() {
      if (!this.activeCardElement || !this.hoveredItem) {
        return
      }

      const rect = this.activeCardElement.getBoundingClientRect()
      const containerRect = this.activeCardElement
        .closest('.store-content-panel')
        ?.getBoundingClientRect() ?? {
        left: 16,
        right: window.innerWidth - 16,
        top: 16,
        bottom: window.innerHeight - 16,
      }
      const horizontalPadding = 16
      const verticalPadding = 16
      const previewWidth = Math.min(
        288,
        Math.max(220, containerRect.right - containerRect.left - horizontalPadding * 2),
      )
      const fallbackLeft = rect.left - previewWidth - gap
      const canPlaceRight = preferredRight + previewWidth <= containerRight
      const canPlaceLeft = fallbackLeft >= containerLeft
      const left = canPlaceRight
        ? preferredRight
        : canPlaceLeft
          ? fallbackLeft
          : Math.max(containerLeft, Math.min(rect.left, containerRight - previewWidth))
      const centeredTop = rect.top + (rect.height - previewHeight) / 2
      const top = Math.max(containerTop, Math.min(centeredTop, containerBottom - previewHeight))

      this.previewPlacement = canPlaceRight ? 'right' : canPlaceLeft ? 'left' : 'overlay'
      this.previewStyle = {
        width: `${previewWidth}px`,
        left: `${left}px`,
        top: `${top}px`,
      }
    },
    handleDocumentClick(event) {
      if (!event.target.closest('.store-item-card')) {
        this.hidePreview()
      }
    },
    handleDocumentKeydown(event) {
      if (event.key === 'Escape') {
        this.hidePreview()
      }
    },
    getCardsPerRow() {
      if (this.viewportWidth >= 1200) {
        return 6
      }

      if (this.viewportWidth >= 992) {
        return 4
      }

      if (this.viewportWidth >= 768) {
        return 3
      }

      return 2
    },
    isHovered(index) {
      return this.hoveredIndex === index
    },
    isInHoveredRow(index) {
      if (this.hoveredIndex < 0 || this.viewportWidth < 768) {
        return false
      }

      return (
        Math.floor(index / this.getCardsPerRow()) ===
        Math.floor(this.hoveredIndex / this.getCardsPerRow())
      )
    },
    isCollapsed(index) {
      return this.isInHoveredRow(index) && !this.isHovered(index)
    },
    togglePreview(item, index, event) {
      if (this.hoveredIndex === index) {
        this.hidePreview()
        return
      }

      const card = event.currentTarget
      this.hoveredItem = item
      this.hoveredIndex = index
      this.activeCardElement = card
      this.syncPreviewToActiveCard()
      this.startPreviewTracking()
    },
    handleCardKeydown(item, index, event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.togglePreview(item, index, event)
      }
    },
    hidePreview() {
      this.stopPreviewTracking()
      this.hoveredItem = null
      this.hoveredIndex = -1
      this.activeCardElement = null
    },
    updateMinPriceFromField(event) {
      this.$emit(
        'update-min-price',
        this.normalizePriceInput(event.target.value, this.filters.minPrice),
      )
    },
    updateMaxPriceFromField(event) {
      this.$emit(
        'update-max-price',
        this.normalizePriceInput(event.target.value, this.filters.maxPrice),
      )
    },
  },
}
</script>

<template>
  <div class="store-catalog d-flex flex-column" :class="{ 'has-active-item': hoveredItem }">
    <div
      class="store-catalog-focus-overlay"
      :class="{ 'is-active': hoveredItem }"
      aria-hidden="true"
    ></div>

    <!-- Icons Header -->
    <div class="store-catalog-hero app-surface rounded p-2 p-lg-3" :style="heroBackgroundStyle">
      <div class="store-catalog-header">
        <h2 class="store-catalog-title mb-0">Icon Library</h2>
        <div class="store-catalog-pill">
          <span class="store-catalog-pill-value">{{ items.length }}</span>
        </div>
      </div>
    </div>

    <div class="store-inline-filters" :style="heroBackgroundStyle">
      <div class="store-inline-filter-search">
        <label class="visually-hidden" for="icon-search-input">Search icons</label>
        <div class="store-inline-search-field">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            id="icon-search-input"
            class="form-control form-control-sm"
            type="text"
            placeholder="Search icons"
            aria-label="Search icons"
            :value="filters.search"
            @input="$emit('update-search', $event.target.value)"
          />
        </div>
      </div>
      <div class="store-inline-filter-select">
        <label class="visually-hidden" for="icon-rarity-filter">Filter by rarity</label>
        <div class="store-inline-select-shell">
          <select
            id="icon-rarity-filter"
            class="form-select form-select-sm"
            aria-label="Filter by rarity"
            :value="filters.rarity"
            @change="$emit('update-rarity', $event.target.value)"
          >
            <option value="all">Rarity: All</option>
            <option value="common">Rarity: Common</option>
            <option value="rare">Rarity: Rare</option>
            <option value="epic">Rarity: Epic</option>
            <option value="legendary">Rarity: Legendary</option>
          </select>
        </div>
      </div>
      <div class="store-inline-filter-select">
        <label class="visually-hidden" for="icon-sort-filter">Sort icons</label>
        <div class="store-inline-select-shell">
          <select
            id="icon-sort-filter"
            class="form-select form-select-sm"
            aria-label="Sort icons"
            :value="filters.sortBy"
            @change="$emit('update-sort', $event.target.value)"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="name-asc">Sort: Name A to Z</option>
            <option value="rarity-desc">Sort: Rarity</option>
          </select>
        </div>
      </div>
      <div class="store-inline-price-group">
        <span class="store-inline-price-chip">Price</span>
        <div class="store-inline-price-inputs">
          <label class="visually-hidden" for="icon-min-price">Minimum price</label>
          <div class="store-inline-price-field">
            <span class="store-inline-price-prefix">$</span>
            <input
              id="icon-min-price"
              class="form-control form-control-sm"
              type="number"
              inputmode="numeric"
              min="1"
              :max="filters.maxPrice"
              step="1"
              :value="filters.minPrice"
              @change="updateMinPriceFromField"
            />
          </div>
          <span class="store-inline-price-separator" aria-hidden="true">-</span>
          <label class="visually-hidden" for="icon-max-price">Maximum price</label>
          <div class="store-inline-price-field">
            <span class="store-inline-price-prefix">$</span>
            <input
              id="icon-max-price"
              class="form-control form-control-sm"
              type="number"
              inputmode="numeric"
              :min="filters.minPrice"
              :max="priceCap"
              step="1"
              :value="filters.maxPrice"
              @change="updateMaxPriceFromField"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty List Placeholder -->
    <div v-if="items.length === 0" class="store-empty-state app-surface rounded p-4">
      <div class="store-empty-title">No matching icons</div>
      <div class="store-empty-copy">
        Try widening the search or adjusting the price sliders to see more items.
      </div>
    </div>

    <!-- Display Icon Cards -->
    <div v-else class="store-item-grid">
      <div class="store-item-row" v-for="(row, rowIndex) in itemRows" :key="'row-' + rowIndex">
        <div
          class="store-item-cell"
          v-for="entry in row"
          :key="entry.item.title"
          :class="{
            'is-hovered': isHovered(entry.index),
            'is-in-hover-row': isInHoveredRow(entry.index),
            'is-collapsed': isCollapsed(entry.index),
          }"
        >
          <div
            class="card app-surface h-100 store-item-card"
            :class="[
              `tier-${getRarityTier(entry.item)}`,
              {
                'is-hovered': isHovered(entry.index),
                'is-collapsed': isCollapsed(entry.index),
              },
            ]"
            role="button"
            tabindex="0"
            :aria-expanded="String(isHovered(entry.index))"
            @click.stop="togglePreview(entry.item, entry.index, $event)"
            @keydown="handleCardKeydown(entry.item, entry.index, $event)"
          >
            <div class="store-item-media-wrap">
              <div class="store-item-rarity-badge" aria-label="Item rarity">
                <i class="bi bi-stars" aria-hidden="true"></i>
              </div>
              <img
                class="card-img-top store-item-image"
                :src="entry.item.img"
                :alt="entry.item.title"
              />
              <div class="store-item-price-badge">
                <i class="bi bi-coin align-middle"></i> {{ entry.item.cost }}
              </div>
            </div>
            <div class="card-body store-item-body">
              <div class="store-item-name text-truncate">{{ entry.item.title }}</div>
            </div>
            <div class="card-footer border-0 bg-transparent store-item-footer">
              <button
                class="btn btn-sm btn-primary w-100 store-item-button"
                type="button"
                @click.stop="$emit('add-item', entry.item)"
              >
                Unlock Icon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Moves the icon preview modal to the body element. This is because of the navbar overlaying the preview. -->
    <teleport to="body">
      <div
        v-if="hoveredItem"
        class="icon-hover-modal is-visible"
        :class="previewPlacement === 'below' ? 'is-below' : 'is-above'"
        :style="previewStyle"
      >
        <p class="small mb-0">{{ hoveredItem.shortDescription }}</p>
      </div>
    </teleport>
  </div>
</template>

<style scoped></style>
