<script>
import { themeOptions } from '@/data/themes.js'
import { ThemeCatalog } from '@/models/storeModels.js'

export default {
  name: 'StoreThemesSection',
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      catalog: new ThemeCatalog(themeOptions, this.userProfile),
    }
  },
  computed: {
    selectedTheme() {
      return this.catalog.selectedTheme
    },
  },
  methods: {
    selectTheme(themeName) {
      this.catalog.select(themeName)
    },
    applyTheme() {
      this.catalog.apply()
    },
  },
}
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <div class="p-3 rounded app-surface d-flex align-items-baseline justify-content-between">
      <div>
        <h2 class="h5 mb-1">IDE Themes</h2>
        <p class="text-body-secondary mb-0">
          Choose a palette, inspect the preview, and apply the one that fits your current coding
          session.
        </p>
      </div>
      <span v-if="catalog.appliedThemeName" class="small text-body-secondary"
        >Applied: {{ catalog.appliedThemeName }}</span
      >
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-7">
        <div class="row g-2">
          <div class="col-12" v-for="theme in catalog.themes" :key="theme.name">
            <button
              class="btn w-100 text-start p-3 app-surface store-choice-card"
              type="button"
              :class="{ 'is-selected': catalog.selectedName === theme.name }"
              @click="selectTheme(theme.name)"
            >
              <div class="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <div class="fw-semibold">{{ theme.name }}</div>
                  <div class="small text-body-secondary">{{ theme.description }}</div>
                </div>
                <span class="store-color-chip" :style="{ backgroundColor: theme.accent }"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5" v-if="selectedTheme">
        <div class="p-3 rounded app-surface h-100 d-flex flex-column gap-3">
          <div class="store-theme-preview" :style="{ background: selectedTheme.background }">
            <div
              class="store-theme-preview__editor"
              :style="{ backgroundColor: selectedTheme.editor }"
            >
              <div class="small" :style="{ color: selectedTheme.accent }">
                const activeTheme = '{{ selectedTheme.name }}';
              </div>
              <div class="small text-light">renderStore(activeTheme);</div>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between gap-3">
            <div>
              <div class="fw-semibold">{{ selectedTheme.name }}</div>
              <div class="small text-body-secondary">{{ selectedTheme.description }}</div>
            </div>
            <button class="btn btn-primary btn-sm" type="button" @click="applyTheme">
              Apply theme
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
