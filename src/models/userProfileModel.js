import { InventoryEntry } from './cartModels.js'

export class UserProfileModel {
  constructor({
    balance = 100,
    level = 1,
    experience = 0,
    inventory = [],
    activeIcon = '',
    activeBanner = '',
    activeIDETheme = '',
    displayName = 'Debugger Zero',
    handle = '@debugger.zero',
    rankLabel = '#19 Global',
    roleLabel = 'Kernel Hunter',
    joinedLabel = 'Joined Apr 2026',
    gamesPlayed = 128,
    successRate = 91,
    bugfixStreak = 14,
    flawlessRuns = 9,
  }) {
    this.balance = balance
    this.level = level
    this.experience = experience
    this.inventory = inventory.map((entry) => new InventoryEntry(entry))
    this.activeIcon = activeIcon
    this.activeBanner = activeBanner
    this.activeIDETheme = activeIDETheme
    this.displayName = displayName
    this.handle = handle
    this.rankLabel = rankLabel
    this.roleLabel = roleLabel
    this.joinedLabel = joinedLabel
    this.gamesPlayed = gamesPlayed
    this.successRate = successRate
    this.bugfixStreak = bugfixStreak
    this.flawlessRuns = flawlessRuns
  }

  get experienceGoal() {
    return 100
  }

  get clampedExperience() {
    return Math.max(0, Math.min(this.experience, this.experienceGoal))
  }

  get experienceProgressPercent() {
    return (this.clampedExperience / this.experienceGoal) * 100
  }

  get experienceRemaining() {
    return this.experienceGoal - this.clampedExperience
  }

  addInventoryItem(item, quantity) {
    const existingEntry = this.inventory.find((entry) => entry.title === item.title)

    if (existingEntry) {
      existingEntry.increment(quantity)
      return
    }

    this.inventory.push(item.toInventoryEntry(quantity))
  }

  applyCheckout(cart) {
    this.balance -= cart.total

    cart.items.forEach((item) => {
      this.addInventoryItem(item.item, item.qty)
    })

    if (!this.activeIcon) {
      const firstPurchasedIcon = cart.items.find((item) => item.itemType === 'icon')

      if (firstPurchasedIcon) {
        this.activeIcon = firstPurchasedIcon.title
      }
    }

    return {
      items: cart.count,
      total: cart.total,
      remainingBalance: this.balance,
    }
  }
}
