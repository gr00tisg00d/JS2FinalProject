<script>
import HomePage from '@/components/layout/HomePage.vue'
import LeaderboardsPage from '@/components/layout/LeaderboardsPage.vue'
import Navbar from '@/components/layout/Navbar.vue'
import ProfilePage from '@/components/layout/ProfilePage.vue'
import StorePage from '@/components/layout/StorePage.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import icons from '@/data/icons.js'
import { userProfile } from '@/data/userProperties.js'

export default {
  name: 'App',
  components: {
    HomePage,
    LeaderboardsPage,
    Navbar,
    ProfilePage,
    StorePage,
    AppFooter,
  },
  data() {
    return {
      activePage: 'store',
      bootDurationMs: 1600,
      bootTimerId: null,
      isBooting: true,
      icons,
      userProfile,
    }
  },
  computed: {
    activePageComponent() {
      return {
        home: HomePage,
        leaderboards: LeaderboardsPage,
        profile: ProfilePage,
        store: StorePage,
      }[this.activePage]
    },
    activePageProps() {
      return {
        home: {
          userProfile: this.userProfile,
        },
        leaderboards: {},
        profile: {
          userProfile: this.userProfile,
        },
        store: {
          items: this.icons,
          userProfile: this.userProfile,
        },
      }[this.activePage]
    },
  },
  mounted() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isBooting = false
      return
    }

    this.bootTimerId = window.setTimeout(() => {
      this.isBooting = false
      this.bootTimerId = null
    }, this.bootDurationMs)
  },
  beforeUnmount() {
    if (this.bootTimerId !== null) {
      window.clearTimeout(this.bootTimerId)
    }
  },
}
</script>

<template>
  <div class="app-room">
    <div class="app-frame">
      <div class="monitor-shell">
        <!-- <div class="monitor-marquee">Find The Err0r OS</div> -->
        <div class="monitor-bezel">
          <div class="monitor-glass">
            <div v-if="isBooting" class="boot-splash" aria-hidden="true">
              <div class="boot-splash-core">
                <i class="bi bi-bug-fill boot-splash-icon"></i>
                <p class="boot-splash-label mb-0">Find The Err0r OS</p>
              </div>
            </div>
            <div class="monitor-screen" :class="{ 'monitor-screen--booting': isBooting }">
              <navbar
                :active-page="activePage"
                :user-profile="userProfile"
                @navigate="activePage = $event"
              ></navbar>
              <div class="monitor-page-host">
                <keep-alive>
                  <component :is="activePageComponent" v-bind="activePageProps"></component>
                </keep-alive>
              </div>
            </div>
          </div>
        </div>
        <div class="monitor-stand" aria-hidden="true"></div>
      </div>
    </div>
    <div class="app-footer-wrap">
      <app-footer></app-footer>
    </div>
  </div>
</template>

<style scoped>
.boot-splash {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background:
    radial-gradient(circle at center, rgba(255, 214, 90, 0.12), transparent 24%),
    radial-gradient(circle at center, rgba(142, 230, 255, 0.12), transparent 56%),
    linear-gradient(180deg, rgba(8, 19, 29, 0.96), rgba(4, 10, 16, 0.985));
  pointer-events: none;
}

.boot-splash-core {
  display: grid;
  justify-items: center;
  gap: 0.85rem;
  text-align: center;
}

.boot-splash-icon {
  font-size: clamp(4.75rem, 10vw, 7rem);
  line-height: 1;
  color: #ffd65a;
  text-shadow:
    0 0 18px rgba(255, 214, 90, 0.32),
    0 0 40px rgba(142, 230, 255, 0.18);
}

.boot-splash-label {
  color: rgba(238, 251, 255, 0.9);
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(0.62rem, 1vw, 0.78rem);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
</style>
