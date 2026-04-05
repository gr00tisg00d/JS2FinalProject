<script>
export default {
  name: 'Navbar',
  props: {
    activePage: {
      type: String,
      required: true,
    },
    userProfile: {
      type: Object,
      required: true,
    },
  },
  emits: ['navigate'],
  data() {
    return {
      navItems: [
        { id: 'home', icon: 'bi-house-door-fill', label: 'Home' },
        { id: 'leaderboards', icon: 'bi-bar-chart-fill', label: 'Leaderboards' },
        { id: 'profile', icon: 'bi-person-badge-fill', label: 'Profile' },
        { id: 'store', icon: 'bi-coin', label: 'Store' },
      ],
    }
  },
  computed: {
    activeProfileIcon() {
      return (
        this.userProfile.inventory.find(
          (item) => item.itemType === 'icon' && item.title === this.userProfile.activeIcon,
        )?.img ?? ''
      )
    },
    experienceProgressStyle() {
      return {
        width: `${this.userProfile.experienceProgressPercent ?? 0}%`,
      }
    },
  },
}
</script>

<template>
  <nav class="py-2">
    <div class="app-navbar-shell px-3 px-lg-4 d-flex justify-content-center">
      <div class="navbar app-navbar px-3 py-2">
        <div class="app-navbar-inner">
          <div class="navbar-link-group">
            <button
              v-for="item in navItems"
              :key="item.id"
              type="button"
              class="btn icon-btn d-flex align-items-center justify-content-center text-decoration-none"
              :class="{ active: activePage === item.id }"
              :aria-current="activePage === item.id ? 'page' : null"
              @click="$emit('navigate', item.id)"
            >
              <i class="bi fs-4" :class="item.icon"></i>
              <span class="nav-button-label">{{ item.label }}</span>
            </button>
          </div>

          <!-- Right side of nav -->
          <div class="navbar-meta-group">
            <!-- Balance / Level / Stat -->
            <div class="navbar-status-group">
              <div class="navbar-status-card">
                <span class="navbar-status-label">Balance</span>
                <span class="navbar-status-value"
                  ><i class="bi bi-coin align-middle"></i> {{ userProfile.balance }}</span
                >
              </div>
              <div class="navbar-status-card">
                <span class="navbar-status-label">Level</span>
                <div class="navbar-level-row">
                  <span class="navbar-status-value">{{ userProfile.level }}</span>
                  <div
                    class="navbar-level-progress"
                    role="progressbar"
                    aria-label="Experience progress"
                    :aria-valuenow="userProfile.clampedExperience ?? 0"
                    :aria-valuemin="0"
                    :aria-valuemax="userProfile.experienceGoal ?? 100"
                  >
                    <span
                      class="navbar-level-progress-fill"
                      :style="experienceProgressStyle"
                    ></span>
                  </div>
                </div>
                <span class="navbar-level-caption"
                  >{{ userProfile.clampedExperience ?? 0 }}/{{
                    userProfile.experienceGoal ?? 100
                  }}
                  XP</span
                >
              </div>
            </div>

            <!-- User Profile Picture -->
            <div class="navbar-avatar-shell" aria-label="Active profile icon">
              <img
                v-if="activeProfileIcon"
                :src="activeProfileIcon"
                alt="Active profile icon"
                class="navbar-avatar-image"
              />
              <i v-else class="bi bi-person-fill navbar-avatar-fallback"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-navbar-shell {
  --navbar-box-height: 3rem;
}

.app-navbar-shell {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.navbar {
  background-color: var(--screen-panel-strong);
  color: var(--screen-text);
}

.app-navbar {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding-top: 0.3rem !important;
  padding-bottom: 0.3rem !important;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)),
    linear-gradient(180deg, rgba(78, 81, 71, 0.98), rgba(38, 40, 34, 0.98));
  border: 2px solid var(--screen-border);
  border-radius: 0.4rem;
  box-shadow: 0 6px 0 rgba(23, 24, 20, 0.32);
}

.app-navbar-inner {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-height: var(--navbar-box-height);
}

.navbar-link-group {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 0.75rem;
  min-height: 100%;
}

.nav-button-label {
  font-size: 0.6rem;
  font-weight: 700;
  font-family: 'Press Start 2P', monospace;
}

.navbar-meta-group {
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-left: auto;
  min-height: 100%;
}

.navbar-status-group {
  display: flex;
  align-items: stretch;
  gap: 0.6rem;
  min-height: 100%;
}

.navbar-status-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 6.5rem;
  height: 100%;
  min-height: 100%;
  padding: 0.4rem 0.7rem;
  border: 2px solid var(--screen-border);
  border-radius: 0.35rem;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

.navbar-status-label {
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--screen-accent);
  font-family: 'Press Start 2P', monospace;
}

.navbar-status-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--screen-text);
}

.navbar-level-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  min-width: 0;
}

.navbar-level-progress {
  position: relative;
  width: 100%;
  min-width: 0;
  height: 0.5rem;
  overflow: hidden;
  border: 2px solid rgba(214, 222, 193, 0.42);
  border-radius: 0.2rem;
  background: rgba(30, 31, 27, 0.8);
}

.navbar-level-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--screen-accent), var(--screen-highlight));
  box-shadow: 0 0 10px rgba(214, 222, 193, 0.16);
}

.navbar-level-caption {
  font-size: 0.46rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--screen-muted);
  font-family: 'Press Start 2P', monospace;
}

.navbar-avatar-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100%;
  aspect-ratio: 1 / 1;
  flex: 0 0 auto;
  overflow: hidden;
  border: 2px solid rgba(214, 222, 193, 0.32);
  border-radius: 0.35rem;
  background: linear-gradient(180deg, rgba(86, 89, 79, 0.96), rgba(40, 42, 36, 0.96));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

.navbar-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  image-rendering: pixelated;
  transform: scale(1.14);
  transform-origin: center;
}

.navbar-avatar-fallback {
  font-size: 1.45rem;
  color: var(--screen-text);
}

.icon-btn {
  height: 100%;
  min-height: 100%;
  gap: 0.55rem;
  padding: 0.4rem 0.7rem;
  border: 2px solid rgba(214, 222, 193, 0.24);
  border-radius: 0.25rem;
  background: rgba(52, 55, 47, 0.84);
  color: var(--screen-text);
  box-sizing: border-box;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.icon-btn:hover {
  filter: none;
  background: rgba(82, 86, 74, 0.92);
  transform: translateY(-1px);
}

.icon-btn:active,
.icon-btn.active {
  border-color: var(--screen-accent);
  background: rgba(184, 201, 122, 0.4);
  color: #24271f;
}

@media (max-width: 575.98px) {
  .app-navbar-inner {
    flex-wrap: wrap;
    justify-content: center;
  }

  .navbar-link-group {
    width: 100%;
    justify-content: center;
  }

  .icon-btn {
    flex: 1 1 calc(50% - 0.75rem);
  }

  .navbar-meta-group {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }

  .navbar-status-group {
    flex: 1 1 auto;
    justify-content: center;
  }

  .navbar-status-card {
    flex: 1 1 0;
    min-width: 0;
  }
}
</style>
