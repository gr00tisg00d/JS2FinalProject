<script>
export default {
  name: 'StoreSectionNav',
  props: {
    activeSection: {
      type: String,
      required: true,
    },
    dismissModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select-section'],
}
</script>

<template>
  <div class="sidebar-nav-grid">
    <button
      class="sidebar-nav-button"
      :class="{ active: activeSection === 'home' }"
      :data-bs-dismiss="dismissModal ? 'modal' : null"
      type="button"
      @click="$emit('select-section', 'home')"
    >
      Home
    </button>
    <button
      class="sidebar-nav-button"
      :class="{ active: activeSection === 'icons' }"
      :data-bs-dismiss="dismissModal ? 'modal' : null"
      type="button"
      @click="$emit('select-section', 'icons')"
    >
      Icons
    </button>
    <button
      class="sidebar-nav-button"
      :class="{ active: activeSection === 'themes' }"
      :data-bs-dismiss="dismissModal ? 'modal' : null"
      type="button"
      @click="$emit('select-section', 'themes')"
    >
      IDE Themes
    </button>
    <button
      class="sidebar-nav-button"
      :class="{ active: activeSection === 'banners' }"
      :data-bs-dismiss="dismissModal ? 'modal' : null"
      type="button"
      @click="$emit('select-section', 'banners')"
    >
      Banners
    </button>
  </div>
</template>

<style scoped>
.sidebar-nav-grid {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.35rem;
  border: 1px solid var(--screen-border);
  background: linear-gradient(180deg, rgba(7, 23, 36, 0.34), rgba(7, 23, 36, 0.14));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.sidebar-nav-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 3rem;
  padding: 0.9rem 1rem;
  border: 1px solid transparent;
  border-left: 3px solid transparent;
  border-radius: 0.8rem;
  background: transparent;
  color: var(--screen-muted);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-align: left;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
}

.sidebar-nav-button:hover {
  border-color: rgba(255, 214, 90, 0.2);
  border-left-color: rgba(255, 214, 90, 0.72);
  background: rgba(255, 214, 90, 0.1);
  color: var(--screen-text);
}

.sidebar-nav-button.active {
  border-color: rgba(142, 230, 255, 0.28);
  border-left-color: var(--screen-highlight);
  background: linear-gradient(90deg, rgba(255, 214, 90, 0.22), rgba(142, 230, 255, 0.06));
  color: var(--screen-text);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 8px 18px rgba(0, 0, 0, 0.08);
}
</style>
