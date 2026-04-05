<script>
import CartPanel from './CartPanel.vue'

export default {
  name: 'CartSummarySection',
  components: {
    CartPanel,
  },
  props: {
    cartItems: {
      type: Array,
      required: true,
    },
    checkoutTotal: {
      type: Number,
      required: true,
    },
    dismissModalOnCheckout: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove-item', 'increment-item', 'decrement-item'],
}
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <cart-panel
      :items="cartItems"
      @remove-item="$emit('remove-item', $event)"
      @increment-item="$emit('increment-item', $event)"
      @decrement-item="$emit('decrement-item', $event)"
    ></cart-panel>
    <div class="cart-total-row mt-3 small">
      <span class="text-body-secondary">Order total</span>
      <span class="fw-semibold"><i class="bi bi-coin align-middle"></i> {{ checkoutTotal }}</span>
    </div>
    <button
      class="btn btn-primary w-100 mt-3"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#checkoutModal"
      :data-bs-dismiss="dismissModalOnCheckout ? 'modal' : null"
      :disabled="cartItems.length === 0"
    >
      Checkout
    </button>
  </div>
</template>

<style scoped>
.cart-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-inline: 0;
  padding-top: 0.9rem;
  border: 0;
  border-top: 1px solid rgba(255, 250, 251, 0.08);
  border-radius: 0;
  background: transparent;
}
</style>
