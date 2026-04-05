<script>
export default {
  name: 'FilterPanel',
  data() {
    return {
      isCollapsed: false,
    }
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    priceCap: {
      type: Number,
      required: true,
    },
  },
  emits: ['update-search', 'update-min-price', 'update-max-price'],
}
</script>

<template>
  <div class="filter-panel d-flex flex-column gap-3">
    <input
      class="form-control form-control-sm"
      type="text"
      placeholder="Search items..."
      :value="filters.search"
      @input="$emit('update-search', $event.target.value)"
    />
    <button
      class="filter-toggle-button"
      type="button"
      @click="isCollapsed = !isCollapsed"
      :aria-expanded="String(!isCollapsed)"
    >
      <span>{{ isCollapsed ? 'Show price range' : 'Hide price range' }}</span>
      <i class="bi" :class="isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'"></i>
    </button>
    <div class="filter-panel-body" :class="{ collapsed: isCollapsed }">
      <div class="filter-panel-body-inner d-flex flex-column gap-3">
        <section class="filter-group">
          <div class="filter-slider-row">
            <div class="filter-slider-labels">
              <label class="filter-label">Minimum price</label>
              <span class="filter-value">\${{ filters.minPrice }}</span>
            </div>
            <input
              class="form-range"
              type="range"
              min="1"
              :max="priceCap"
              step="1"
              :value="filters.minPrice"
              @input="$emit('update-min-price', Number($event.target.value))"
            />
          </div>
          <div class="filter-slider-row">
            <div class="filter-slider-labels">
              <label class="filter-label">Maximum price</label>
              <span class="filter-value">\${{ filters.maxPrice }}</span>
            </div>
            <input
              class="form-range"
              type="range"
              min="1"
              :max="priceCap"
              step="1"
              :value="filters.maxPrice"
              @input="$emit('update-max-price', Number($event.target.value))"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  padding-top: 0.15rem;
}

.filter-toggle-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgba(255, 250, 251, 0.08);
  border-radius: 0.9rem;
  background: rgba(19, 21, 21, 0.2);
  color: #fffafb;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
}

.filter-toggle-button:hover {
  border-color: rgba(51, 153, 137, 0.34);
  background: rgba(51, 153, 137, 0.12);
  transform: translateY(-1px);
}

.filter-toggle-button i {
  font-size: 0.95rem;
}

.filter-panel-body {
  display: grid;
  grid-template-rows: 1fr;
  min-height: 0;
  overflow: hidden;
  transition: grid-template-rows 0.28s ease;
}

.filter-panel-body.collapsed {
  grid-template-rows: 0fr;
}

.filter-panel-body-inner {
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.1rem;
}

.filter-group {
  padding: 0.95rem;
  border: 1px solid rgba(255, 250, 251, 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(19, 21, 21, 0.26), rgba(19, 21, 21, 0.14));
  box-shadow: inset 0 1px 0 rgba(255, 250, 251, 0.03);
}

.filter-label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-slider-row + .filter-slider-row {
  margin-top: 0.95rem;
}

.filter-slider-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.filter-slider-labels .filter-label {
  margin-bottom: 0.3rem;
}

.filter-value {
  font-size: 0.82rem;
  font-weight: 700;
  color: #fffafb;
}
</style>
