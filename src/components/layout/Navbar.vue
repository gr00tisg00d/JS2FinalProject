<script>
export default {
  name: 'Navbar',
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
        )?.img ?? ''
      )
    },
  },
}
</script>

<template>
  <nav class="py-2">
    <div class="container d-flex justify-content-center">
      <div class="navbar app-navbar px-3 py-2">
        <div class="app-navbar-inner">
          <!-- Navbuttons -->
          <div class="navbar-link-group">
            <a
              href="/"
              class="btn icon-btn d-flex align-items-center justify-content-center text-decoration-none"
            >
              <i class="bi bi-bug-fill fs-4"></i>
            </a>
            <a
              href="/"
              class="btn icon-btn d-flex align-items-center justify-content-center text-decoration-none"
            >
              <i class="bi bi-bar-chart-fill fs-4"></i>
            </a>
            <a
              href="/"
              class="btn icon-btn d-flex align-items-center justify-content-center text-decoration-none active"
            >
              <i class="bi bi-coin fs-4"></i>
            </a>
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
                <span class="navbar-status-value"> {{ userProfile.level }}</span>
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
.navbar {
  background-color: #2b2c28;
  color: #fffafb;
}

.app-navbar {
  width: 100%;
  background:
    radial-gradient(circle at top right, rgba(51, 153, 137, 0.14), transparent 34%),
    linear-gradient(180deg, rgba(255, 250, 251, 0.03), rgba(19, 21, 21, 0.14)), #2b2c28;
  box-shadow: 0 18px 36px rgba(19, 21, 21, 0.24);
}

.app-navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.navbar-link-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-meta-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-left: auto;
}

.navbar-status-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.navbar-status-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 6.5rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(255, 250, 251, 0.08);
  border-radius: 0.95rem;
  background: rgba(19, 21, 21, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 250, 251, 0.03);
}

.navbar-status-label {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(125, 226, 209, 0.78);
}

.navbar-status-value {
  font-size: 0.92rem;
  font-weight: 700;
  color: #fffafb;
}

.navbar-avatar-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  flex: 0 0 3.25rem;
  overflow: hidden;
  border: 1px solid rgba(51, 153, 137, 0.42);
  border-radius: 50%;
  background:
    radial-gradient(circle at top, rgba(51, 153, 137, 0.18), transparent 60%),
    rgba(19, 21, 21, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 250, 251, 0.06);
}

.navbar-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.navbar-avatar-fallback {
  font-size: 1.3rem;
  color: #fffafb;
}

.icon-btn {
  border: 1px solid rgba(51, 153, 137, 0.35);
  background: rgba(51, 153, 137, 0.12);
  color: #fffafb;
  transition: 0.4s ease;
}

.icon-btn:hover {
  filter: brightness(1.15);
  background: rgba(51, 153, 137, 0.2);
}

.icon-btn:active,
.icon-btn.active {
  border-color: #339989;
  background: rgba(51, 153, 137, 0.6);
  color: #fffafb;
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
