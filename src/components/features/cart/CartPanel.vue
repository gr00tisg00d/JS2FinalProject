<script>
export default {
  name: 'CartPanel',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ['remove-item', 'increment-item', 'decrement-item'],
}
</script>

<template>
  <div class="cart-panel d-flex flex-column gap-3">
    <div v-if="items.length === 0" class="cart-empty-state">
      <div class="cart-empty-title">Your cart is empty</div>
      <div class="cart-empty-copy">
        Add something from the store to see your order summary here.
      </div>
    </div>
    <div v-else class="cart-list d-flex flex-column gap-2">
      <div v-for="item in items" :key="item.title" class="cart-item">
        <img :src="item.img" class="cart-item-image" />
        <div class="cart-item-content">
          <div class="cart-item-topline">
            <div class="cart-item-title text-truncate">{{ item.title }}</div>
            <span class="cart-qty-pill">Qty {{ item.qty }}</span>
          </div>
          <div class="cart-item-meta">
            <span><i class="bi bi-coin align-middle"></i> {{ item.cost * item.qty }}</span>
          </div>
          <div class="cart-item-actions">
            <div class="btn-group btn-group-sm cart-qty-controls">
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="$emit('decrement-item', item)"
              >
                -
              </button>
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="$emit('increment-item', item)"
              >
                +
              </button>
            </div>
            <button
              class="btn btn-sm btn-outline-primary cart-remove-btn"
              type="button"
              @click="$emit('remove-item', item)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  padding-top: 0.15rem;
}

.cart-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.1rem;
}

.cart-empty-state {
  padding: 1.1rem;
  border: 1px dashed var(--screen-border);
  border-radius: 1rem;
  background: rgba(7, 23, 36, 0.24);
}

.cart-empty-title {
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--screen-text);
}

.cart-empty-copy {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--screen-muted);
}

.cart-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 0.85rem;
  padding: 0.85rem;
  border: 1px solid var(--screen-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(7, 23, 36, 0.32), rgba(7, 23, 36, 0.14));
}

.cart-item-image {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border: 1px solid var(--screen-border);
  border-radius: 0.85rem;
  background: rgba(7, 23, 36, 0.38);
}

.cart-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.cart-item-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}

.cart-item-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--screen-text);
}

.cart-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.85rem;
  font-size: 0.78rem;
  color: var(--screen-muted);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.cart-qty-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.28rem 0.6rem;
  border: 1px solid rgba(255, 214, 90, 0.34);
  border-radius: 999px;
  background: rgba(255, 214, 90, 0.14);
  color: var(--screen-text);
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.cart-qty-controls .btn,
.cart-remove-btn {
  border-radius: 0.75rem;
}

.cart-remove-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

@media (max-width: 575.98px) {
  .cart-item-topline,
  .cart-item-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .cart-item-image {
    width: 100%;
    height: 120px;
  }

  .cart-remove-btn {
    justify-content: center;
  }
}
</style>
