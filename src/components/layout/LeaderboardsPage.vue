<script>
const leaderboardRows = [
  { name: 'ByteBandit', score: 9820, streak: 18 },
  { name: 'NullPointer', score: 9410, streak: 14 },
  { name: 'CrashCart', score: 9030, streak: 11 },
  { name: 'RetroKernel', score: 8760, streak: 9 },
]

export default {
  name: 'LeaderboardsPage',
  data() {
    return {
      timeframe: 'weekly',
      highlightOnly: false,
      rows: leaderboardRows,
    }
  },
  computed: {
    visibleRows() {
      if (!this.highlightOnly) {
        return this.rows
      }

      return this.rows.slice(0, 2)
    },
  },
}
</script>

<template>
  <main
    class="w-100 flex-grow-1 py-3 px-3 px-lg-4 d-flex flex-column overflow-hidden app-page-shell"
  >
    <section class="app-surface rounded p-3 p-lg-4 h-100 d-flex flex-column gap-3 overflow-auto">
      <div class="leaderboard-header">
        <div>
          <span class="page-eyebrow">Leaderboards</span>
          <h1 class="page-title mb-1">Top hunters this {{ timeframe }}</h1>
          <p class="page-copy mb-0">This filter state stays intact when you switch tabs.</p>
        </div>
        <div class="leaderboard-controls">
          <select v-model="timeframe" class="form-select">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <label class="toggle-chip">
            <input v-model="highlightOnly" type="checkbox" />
            <span>Highlights only</span>
          </label>
        </div>
      </div>

      <div class="leaderboard-list">
        <article v-for="(row, index) in visibleRows" :key="row.name" class="leaderboard-row">
          <div class="leaderboard-rank">#{{ index + 1 }}</div>
          <div>
            <div class="leaderboard-name">{{ row.name }}</div>
            <div class="leaderboard-meta">{{ row.streak }} win streak</div>
          </div>
          <div class="leaderboard-score">{{ row.score }}</div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.app-page-shell {
  min-height: 0;
}

.leaderboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.leaderboard-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.leaderboard-list {
  display: grid;
  gap: 0.85rem;
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--screen-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(7, 23, 36, 0.38), rgba(7, 23, 36, 0.16));
}

.leaderboard-rank,
.leaderboard-score,
.leaderboard-name,
.page-title {
  color: var(--screen-text);
}

.leaderboard-rank,
.leaderboard-score {
  font-size: 1.15rem;
  font-weight: 800;
}

.leaderboard-meta,
.page-copy,
.toggle-chip span,
.page-eyebrow {
  color: var(--screen-muted);
}

.page-eyebrow {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--screen-accent);
}

.toggle-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--screen-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
}

@media (max-width: 767.98px) {
  .leaderboard-header,
  .leaderboard-controls,
  .leaderboard-row {
    grid-template-columns: 1fr;
    display: grid;
  }

  .leaderboard-controls {
    justify-items: stretch;
  }
}
</style>
