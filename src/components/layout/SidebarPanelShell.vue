<script>
export default {
  name: 'SidebarPanelShell',
  props: {
    eyebrow: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['toggle'],
}
</script>

<template>
  <!-- Container -->
  <div
    class="rounded app-surface store-sidebar-panel"
    :class="isOpen ? 'is-expanded' : 'is-collapsed'"
  >
    <!-- Header Content -->
    <div class="panel-header p-3" :class="{ 'panel-header-split': !!$slots.actions }">
      <!-- Cart Panel(actions) -->
      <template v-if="$slots.actions">
        <button
          class="sidebar-panel-toggle sidebar-panel-toggle-label"
          type="button"
          @click="$emit('toggle')"
          :aria-expanded="String(isOpen)"
        >
          <span>
            <span class="panel-eyebrow">{{ eyebrow }}</span>
            <span class="panel-title">{{ title }}</span>
          </span>
        </button>

        <slot v-if="isOpen" name="actions"></slot>

        <button
          class="sidebar-panel-toggle sidebar-panel-toggle-icon"
          type="button"
          @click="$emit('toggle')"
          :aria-expanded="String(isOpen)"
        >
          <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </button>
      </template>

      <!-- Filter Panel -->
      <button
        v-else
        class="sidebar-panel-toggle"
        type="button"
        @click="$emit('toggle')"
        :aria-expanded="String(isOpen)"
      >
        <span>
          <span class="panel-eyebrow">{{ eyebrow }}</span>
          <span class="panel-title">{{ title }}</span>
        </span>
        <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
    </div>

    <!-- Body Content -->
    <div class="sidebar-panel-body" :class="{ collapsed: !isOpen }">
      <div class="sidebar-panel-body-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-sidebar-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-color: var(--screen-border);
  background:
    radial-gradient(circle at top right, rgba(255, 214, 90, 0.12), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(8, 19, 29, 0.16)),
    linear-gradient(180deg, rgba(15, 50, 77, 0.94), rgba(8, 19, 29, 0.94));
}

.store-sidebar-panel.is-expanded {
  flex: 1 1 auto;
}

.store-sidebar-panel.is-collapsed {
  flex: 0 0 auto;
}

.store-sidebar-panel::before {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--screen-accent), rgba(142, 230, 255, 0.82));
  opacity: 0.85;
}

.sidebar-panel-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
}

.sidebar-panel-toggle-label {
  flex: 1 1 auto;
  justify-content: flex-start;
}

.sidebar-panel-toggle-icon {
  width: auto;
  flex: 0 0 auto;
  justify-content: center;
}

.sidebar-panel-toggle i {
  font-size: 1rem;
  color: var(--screen-highlight);
}

.sidebar-panel-body {
  display: grid;
  grid-template-rows: 1fr;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  transition: grid-template-rows 0.28s ease;
}

.sidebar-panel-body.collapsed {
  grid-template-rows: 0fr;
  flex: 0 0 auto;
}

.sidebar-panel-body-inner {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
</style>
