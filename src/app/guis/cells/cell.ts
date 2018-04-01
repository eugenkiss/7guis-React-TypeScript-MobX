import {action, computed, observable} from 'mobx'
import {Formula, Textual} from './formula'
import {Store} from './cells'

export class Cell {
  constructor(
    private store: Store,
  ) {}

  initialContent = '' // TODO: Better dirty field abstraction (mobx-utils)
  readonly content = observable.box('')
  readonly formula = observable.box<Formula>(new Textual(""))
  readonly editing = computed(() => this.store.selected.get() === this)

  // This is the “magic”
  readonly value = computed<number>(() => {
    try {
      return this.formula.get().eval(this.store.cells)
    } catch (e) { // Cyclic derivation
      return NaN
    }
  })

  readonly displayValue = computed(() => {
    const f = this.formula.get()
    if (f.hasValue) {
      return this.value.get().toString()
    } else {
      return f.toString()
    }
  })

  @action makeSelected() {
    this.store.selected.set(this)
  }

  @action unselect() {
    this.store.selected.set(null)
  }

  @action applyChange() {
    this.formula.set(this.store.parser.parse(this.content.get()))
  }

  @action abortEditing() {
    this.content.set(this.initialContent)
    this.unselect()
  }
}
