export class CatalogOption {
  constructor({ name, description = '' }) {
    this.name = name
    this.description = description
  }
}

export class ThemeOption extends CatalogOption {
  constructor({ name, accent, background, editor, idePalette = {}, description = '' }) {
    super({ name, description })
    this.accent = accent
    this.background = background
    this.editor = editor
    this.idePalette = idePalette
  }
}

export class BannerOption extends CatalogOption {
  constructor({ name, background, tagline = '', description = '' }) {
    super({ name, description: description || tagline })
    this.background = background
    this.tagline = tagline
  }
}

export class SelectableCatalog {
  constructor(items, selectedName = '') {
    this.items = items
    this.selectedName = selectedName || items[0]?.name || ''
  }

  get selectedItem() {
    return this.items.find((item) => item.name === this.selectedName) ?? this.items[0] ?? null
  }

  select(name) {
    if (this.items.some((item) => item.name === name)) {
      this.selectedName = name
    }
  }
}

export class ThemeCatalog extends SelectableCatalog {
  constructor(items, userProfile) {
    super(items, userProfile.activeIDETheme)
    this.userProfile = userProfile
  }

  get themes() {
    return this.items
  }

  get selectedTheme() {
    return this.selectedItem
  }

  get appliedThemeName() {
    return this.userProfile.activeIDETheme
  }

  apply() {
    this.userProfile.activeIDETheme = this.selectedTheme?.name ?? ''
  }
}

export class BannerCatalog extends SelectableCatalog {
  constructor(items, userProfile) {
    super(items, userProfile.activeBanner)
    this.userProfile = userProfile
  }

  get banners() {
    return this.items
  }

  get selectedBanner() {
    return this.selectedItem
  }

  get pinnedBannerName() {
    return this.userProfile.activeBanner
  }

  pin() {
    this.userProfile.activeBanner = this.selectedBanner?.name ?? ''
  }
}

export const createThemeOptions = (items) => items.map((item) => new ThemeOption(item))
export const createBannerOptions = (items) => items.map((item) => new BannerOption(item))
