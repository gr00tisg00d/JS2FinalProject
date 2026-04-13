export class InventoryEntry {
  constructor({ title, img, itemType, qty = 0 }) {
    this.title = title
    this.img = img
    this.itemType = itemType
    this.qty = qty
  }

  increment(amount = 1) {
    this.qty += amount
  }
}

export class CartLine {
  constructor(item, qty = 1) {
    this.item = item
    this.qty = qty
  }

  get title() {
    return this.item.title
  }

  get img() {
    return this.item.img
  }

  get cost() {
    return this.item.cost
  }

  get itemType() {
    return this.item.itemType
  }

  get description() {
    return this.item.description
  }

  get perk() {
    return this.item.perk
  }

  get bestFor() {
    return this.item.bestFor
  }

  increment(amount = 1) {
    this.qty += amount
  }

  decrement(amount = 1) {
    this.qty -= amount
  }
}

export class Cart {
  constructor(items = []) {
    this.items = items
  }

  get count() {
    return this.items.reduce((count, item) => count + item.qty, 0)
  }

  get total() {
    return this.items.reduce((total, item) => total + item.cost * item.qty, 0)
  }

  findLine(title) {
    return this.items.find((item) => item.title === title)
  }

  addItem(item) {
    const existingLine = this.findLine(item.title)

    if (existingLine) {
      existingLine.increment()
      return existingLine
    }

    const newLine = item.toCartLine()
    this.items.push(newLine)
    return newLine
  }

  remove(item) {
    const index = this.items.indexOf(item)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  increment(item) {
    if (item) {
      item.increment()
    }
  }

  decrement(item) {
    if (!item) {
      return
    }

    item.decrement()

    if (item.qty <= 0) {
      this.remove(item)
    }
  }

  clear() {
    this.items.splice(0, this.items.length)
  }
}
