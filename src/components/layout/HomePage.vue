<script>
export default {
  name: 'HomePage',
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statusDraft: 'Chasing the next unlock...',
      pinnedTip: 'Check the store for limited icon drops.',
    }
  },
}
</script>

<template>
  <main
    class="w-100 flex-grow-1 py-3 px-3 px-lg-4 d-flex flex-column overflow-hidden app-page-shell"
  >
    <section class="app-surface rounded p-3 p-lg-4 h-100 overflow-auto home-page-grid">
      <article class="page-card hero-card">
        <span class="page-eyebrow">Home</span>
        <h1 class="page-title mb-2">Welcome back, debugger.</h1>
        <p class="page-copy mb-0">
          This panel now stays mounted while you move between tabs, so draft text and controls keep
          their state.
        </p>
      </article>

      <article class="page-card stats-card">
        <span class="page-eyebrow">Snapshot</span>
        <div class="stat-grid">
          <div class="stat-pill">
            <span class="stat-label">Balance</span>
            <strong>{{ userProfile.balance }}</strong>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Level</span>
            <strong>{{ userProfile.level }}</strong>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Inventory</span>
            <strong>{{ userProfile.inventory.length }}</strong>
          </div>
        </div>
      </article>

      <article class="page-card note-card">
        <span class="page-eyebrow">Personal Note</span>
        <label class="page-label" for="home-status-draft">Status draft</label>
        <textarea
          id="home-status-draft"
          v-model="statusDraft"
          class="form-control"
          rows="5"
        ></textarea>
      </article>

      <article class="page-card tip-card">
        <span class="page-eyebrow">Pinned Tip</span>
        <label class="page-label" for="home-tip">Quick reminder</label>
        <input id="home-tip" v-model="pinnedTip" class="form-control" type="text" />
      </article>
    </section>
  </main>
</template>

<style scoped>
.app-page-shell {
  min-height: 0;
}

.home-page-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.page-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--screen-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(7, 23, 36, 0.4), rgba(7, 23, 36, 0.2));
}

.hero-card,
.note-card {
  grid-column: span 8;
}

.stats-card,
.tip-card {
  grid-column: span 4;
}

.page-eyebrow {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--screen-accent);
}

.page-title {
  color: var(--screen-text);
}

.page-copy,
.page-label,
.stat-label {
  color: var(--screen-muted);
}

.page-label {
  font-size: 0.85rem;
  font-weight: 700;
}

.stat-grid {
  display: grid;
  gap: 0.75rem;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.85rem;
  border-radius: 0.85rem;
  background: rgba(255, 214, 90, 0.08);
}

.stat-pill strong {
  font-size: 1.15rem;
  color: var(--screen-text);
}

@media (max-width: 991.98px) {
  .hero-card,
  .note-card,
  .stats-card,
  .tip-card {
    grid-column: 1 / -1;
  }
}
</style>
