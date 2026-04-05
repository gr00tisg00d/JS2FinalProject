<script>
import Navbar from '@/components/layout/Navbar.vue'
import StorePage from '@/components/layout/StorePage.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import icons from '@/data/icons.js'
import { userProfile } from '@/data/userProperties.js'

export default {
  name: 'App',
  components: {
    Navbar,
    StorePage,
    AppFooter,
  },
  data() {
    return {
      icons,
      userProfile,
    }
  },
}
</script>

<template>
  <div class="app-room">
    <div class="monitor-shell">
      <div class="monitor-marquee">Find The Err0r OS</div>
      <div class="monitor-bezel">
        <div class="monitor-glass">
          <div class="monitor-screen">
            <navbar :user-profile="userProfile"></navbar>
            <store-page :items="icons" :user-profile="userProfile"></store-page>
            <app-footer></app-footer>
          </div>
        </div>
      </div>
      <div class="monitor-stand" aria-hidden="true"></div>
    </div>
  </div>
</template>

<style scoped>
.app-room {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  padding: clamp(1rem, 2vw, 2rem);
  overflow: hidden;
  box-sizing: border-box;
}

.monitor-shell {
  position: relative;
  width: min(1520px, 100%);
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  padding: 1rem 1rem 0;
  border-radius: 2rem;
  background: linear-gradient(180deg, #d5d8df 0%, #aeb4c0 46%, #777f92 100%);
  box-shadow:
    0 1.5rem 4rem rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -8px 14px rgba(22, 27, 40, 0.28);
}

.monitor-marquee {
  margin: 0 auto 0.75rem;
  width: fit-content;
  padding: 0.2rem 0.9rem;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(180, 190, 208, 0.92));
  color: #2b3954;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.monitor-bezel {
  position: relative;
  min-height: 0;
  padding: clamp(0.85rem, 1.5vw, 1.4rem);
  border-radius: 1.6rem;
  background: linear-gradient(180deg, #5e687c, #c7ccd8 14%, #939cad 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    inset 0 -8px 16px rgba(34, 42, 59, 0.3);
}

.monitor-glass {
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 1.1rem;
  background: radial-gradient(circle at top, rgba(156, 220, 255, 0.16), transparent 35%), #07131d;
  box-shadow:
    inset 0 0 0 2px rgba(190, 228, 255, 0.18),
    inset 0 0 55px rgba(34, 194, 255, 0.12),
    0 0 24px rgba(0, 0, 0, 0.45);
}

.monitor-glass::before,
.monitor-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.monitor-glass::before {
  background:
    linear-gradient(rgba(255, 255, 255, 0.045) 50%, rgba(0, 0, 0, 0.09) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 102, 0.025),
      rgba(0, 255, 255, 0.018),
      rgba(255, 255, 0, 0.02)
    );
  background-size:
    100% 4px,
    6px 100%;
  mix-blend-mode: screen;
  opacity: 0.6;
}

.monitor-glass::after {
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.12), transparent 28%),
    linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.16) 100%);
  animation: screen-flicker 7s steps(1) infinite;
}

.monitor-screen {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 0;
}

.monitor-stand {
  width: 24%;
  height: 1.25rem;
  margin: 0 auto;
  border-radius: 0 0 1.2rem 1.2rem;
  background: linear-gradient(180deg, #8d97aa, #545c6d);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 12px 18px rgba(0, 0, 0, 0.3);
}

@keyframes screen-flicker {
  0%,
  100% {
    opacity: 0.25;
  }

  8% {
    opacity: 0.4;
  }

  9% {
    opacity: 0.18;
  }

  62% {
    opacity: 0.33;
  }

  63% {
    opacity: 0.22;
  }
}

@media (max-width: 767.98px) {
  .app-room {
    padding: 0.5rem;
  }

  .monitor-shell {
    padding: 0.65rem 0.65rem 0;
    border-radius: 1.35rem;
  }

  .monitor-bezel {
    padding: 0.65rem;
    border-radius: 1rem;
  }

  .monitor-stand {
    width: 36%;
  }
}
</style>
