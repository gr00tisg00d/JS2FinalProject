<script>
import icons from '@/data/icons.js'
import { bannerOptions } from '@/data/banners.js'
import { themeOptions } from '@/data/themes.js'

export default {
  name: 'ProfilePage',
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
  },
  computed: {
    activeProfileIcon() {
      return (
        this.userProfile.inventory.find(
          (item) => item.itemType === 'icon' && item.title === this.userProfile.activeIcon,
        )?.img ??
        icons.find((item) => item.title === this.userProfile.activeIcon)?.img ??
        ''
      )
    },
    activeBanner() {
      return (
        bannerOptions.find((banner) => banner.name === this.userProfile.activeBanner) ??
        bannerOptions[0]
      )
    },
    activeTheme() {
      return (
        themeOptions.find((theme) => theme.name === this.userProfile.activeIDETheme) ??
        themeOptions[0]
      )
    },
    profileBannerStyle() {
      return {
        background: this.activeBanner?.background,
      }
    },
    profileStats() {
      return [
        { label: 'Games Played', value: this.userProfile.gamesPlayed },
        { label: 'Success Rate', value: `${this.userProfile.successRate}%` },
        { label: 'Bugfix Streak', value: this.userProfile.bugfixStreak },
        { label: 'Flawless Runs', value: this.userProfile.flawlessRuns },
      ]
    },
    profileMetaChips() {
      return [
        { label: 'User level', value: `LV ${this.userProfile.level}` },
        { label: 'Rank', value: this.userProfile.rankLabel },
        { label: 'Status', value: 'Online' },
      ]
    },
    profileHighlights() {
      return [
        {
          label: 'Current banner',
          value: this.activeBanner?.name ?? 'Trace Route',
          note: this.activeBanner?.tagline ?? 'Default profile banner',
        },
        {
          label: 'IDE theme',
          value: this.activeTheme?.name ?? 'Signal Ember',
          note: this.activeTheme?.description ?? 'No active theme selected yet.',
        },
        {
          label: 'Wallet',
          value: `${this.userProfile.balance} coins`,
          note: `${this.userProfile.experienceRemaining} XP until next level`,
        },
      ]
    },
  },
}
</script>

<template>
  <main
    class="w-100 flex-grow-1 py-3 px-3 px-lg-4 d-flex flex-column overflow-hidden app-page-shell"
  >
    <section class="app-surface rounded p-3 p-lg-4 h-100 profile-page overflow-auto">
      <article class="profile-hero" :style="profileBannerStyle">
        <div class="profile-hero-overlay"></div>
        <div class="profile-hero-topline">
          <span class="page-eyebrow">Profile</span>
          <span class="profile-joined">{{ userProfile.joinedLabel }}</span>
        </div>

        <div class="profile-hero-main">
          <div class="profile-avatar-shell" aria-label="Active profile icon">
            <img
              v-if="activeProfileIcon"
              :src="activeProfileIcon"
              :alt="`${userProfile.displayName} profile icon`"
              class="profile-avatar-image"
            />
            <i v-else class="bi bi-bug-fill profile-avatar-fallback"></i>
          </div>

          <div class="profile-identity-block">
            <div class="profile-name-row">
              <div>
                <h1 class="page-title profile-name mb-1">{{ userProfile.displayName }}</h1>
                <p class="profile-handle mb-0">{{ userProfile.handle }}</p>
              </div>
              <div class="profile-rank-pill">{{ userProfile.rankLabel }}</div>
            </div>

            <p class="profile-role-copy mb-0">
              {{ userProfile.roleLabel }} tracking high-risk glitches, clean clears, and elite
              bugfix runs across the board.
            </p>

            <div class="profile-chip-row">
              <span v-for="chip in profileMetaChips" :key="chip.label" class="profile-chip">
                <span class="profile-chip-label">{{ chip.label }}</span>
                <strong>{{ chip.value }}</strong>
              </span>
            </div>
          </div>
        </div>
      </article>

      <div class="profile-content-grid">
        <article class="page-card profile-stats-card">
          <div class="profile-section-heading">
            <span class="page-eyebrow">Game Stats</span>
            <h2 class="profile-section-title mb-0">Run summary</h2>
          </div>

          <div class="profile-stats-grid">
            <div v-for="stat in profileStats" :key="stat.label" class="profile-stat-tile">
              <span class="profile-stat-label">{{ stat.label }}</span>
              <strong class="profile-stat-value">{{ stat.value }}</strong>
            </div>
          </div>
        </article>

        <article class="page-card profile-loadout-card">
          <div class="profile-section-heading">
            <span class="page-eyebrow">Loadout</span>
            <h2 class="profile-section-title mb-0">Current setup</h2>
          </div>

          <div class="profile-highlight-list">
            <div v-for="item in profileHighlights" :key="item.label" class="profile-highlight-row">
              <div>
                <div class="profile-highlight-label">{{ item.label }}</div>
                <div class="profile-highlight-note">{{ item.note }}</div>
              </div>
              <strong class="profile-highlight-value">{{ item.value }}</strong>
            </div>
          </div>
        </article>

        <article class="page-card profile-xp-card">
          <div class="profile-section-heading">
            <span class="page-eyebrow">Progress</span>
            <h2 class="profile-section-title mb-0">Level climb</h2>
          </div>

          <div class="profile-xp-row">
            <div>
              <div class="profile-highlight-label">Current XP</div>
              <div class="profile-xp-value">
                {{ userProfile.clampedExperience }}/{{ userProfile.experienceGoal }}
              </div>
            </div>
            <div class="profile-xp-remaining">{{ userProfile.experienceRemaining }} XP left</div>
          </div>

          <div class="profile-xp-bar" aria-hidden="true">
            <span
              class="profile-xp-bar-fill"
              :style="{ width: `${userProfile.experienceProgressPercent}%` }"
            ></span>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.app-page-shell {
  min-height: 0;
}

.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  padding: 1rem;
  border: 1px solid var(--screen-border);
  border-radius: 1.2rem;
  min-height: 18rem;
  background: linear-gradient(135deg, rgba(15, 50, 77, 0.96), rgba(8, 19, 29, 0.98));
}

.profile-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(8, 19, 29, 0.18), rgba(8, 19, 29, 0.88)),
    radial-gradient(circle at top right, rgba(255, 214, 90, 0.24), transparent 24%);
}

.profile-hero-topline,
.profile-hero-main {
  position: relative;
  z-index: 1;
}

.profile-hero-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.profile-joined,
.profile-handle,
.profile-role-copy,
.profile-highlight-note,
.profile-stat-label,
.profile-xp-remaining {
  color: var(--screen-muted);
}

.profile-hero-main {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: end;
}

.page-card {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid var(--screen-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(7, 23, 36, 0.4), rgba(7, 23, 36, 0.18));
}

.profile-avatar-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(6.5rem, 10vw, 8rem);
  height: clamp(6.5rem, 10vw, 8rem);
  overflow: hidden;
  border: 3px solid rgba(255, 214, 90, 0.48);
  border-radius: 1.35rem;
  background: rgba(8, 19, 29, 0.72);
  box-shadow:
    0 0 0 6px rgba(8, 19, 29, 0.35),
    0 18px 40px rgba(0, 0, 0, 0.3);
}

.profile-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.profile-avatar-fallback {
  font-size: 3rem;
  color: var(--screen-accent);
}

.profile-identity-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-name-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.profile-name {
  font-size: clamp(1.6rem, 2.4vw, 2.35rem);
}

.profile-rank-pill {
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(255, 214, 90, 0.36);
  border-radius: 999px;
  background: rgba(8, 19, 29, 0.46);
  color: var(--screen-accent);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-role-copy {
  max-width: 48rem;
  line-height: 1.55;
}

.profile-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.profile-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(8, 19, 29, 0.42);
}

.profile-chip-label {
  font-size: 0.54rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--screen-muted);
  font-family: 'Press Start 2P', monospace;
}

.profile-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 1rem;
}

.profile-stats-card {
  grid-column: 1 / -1;
}

.profile-section-heading {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.profile-section-title,
.profile-name,
.profile-stat-value,
.profile-highlight-value,
.profile-xp-value,
.page-title {
  color: var(--screen-text);
}

.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
}

.profile-stat-tile {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.9rem;
  background: rgba(8, 19, 29, 0.34);
}

.profile-stat-value {
  font-size: 1.45rem;
}

.profile-highlight-list {
  display: grid;
  gap: 0.8rem;
}

.profile-highlight-row,
.profile-xp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.profile-highlight-label {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--screen-accent);
  font-family: 'Press Start 2P', monospace;
}

.page-eyebrow {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--screen-accent);
}

.profile-xp-card {
  justify-content: space-between;
}

.profile-xp-value {
  font-size: 1.6rem;
  line-height: 1.1;
}

.profile-xp-bar {
  position: relative;
  width: 100%;
  height: 0.85rem;
  overflow: hidden;
  border: 2px solid rgba(255, 214, 90, 0.24);
  border-radius: 999px;
  background: rgba(8, 19, 29, 0.82);
}

.profile-xp-bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--screen-accent), var(--screen-highlight));
}

@media (max-width: 991.98px) {
  .profile-hero-main,
  .profile-content-grid,
  .profile-stats-grid {
    grid-template-columns: 1fr;
  }

  .profile-name-row,
  .profile-highlight-row,
  .profile-xp-row,
  .profile-hero-topline {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
