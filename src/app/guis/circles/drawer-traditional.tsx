import * as React from 'react'
import {observer} from 'mobx-react'
import {action, computed, observable} from 'mobx'
import {DateTime} from 'luxon'
import {Comp} from '../../basic'
import {ICircle} from './model'
import {CircleDrawerPure} from './frame'

class Edit {
  readonly undo: () => void
  readonly redo: () => void
  constructor(undo: () => void, redo: () => void) {
    this.undo = undo
    this.redo = redo
  }
}

class UndoManager {
  private history = new Array<Edit>()
  @observable private cursor = -1

  @action addEdit(edit: Edit) {
    this.cursor++
    this.history.length = this.cursor
    this.history.push(edit)
  }

  @computed get canUndo() {
    return this.cursor >= 0
  }

  @computed get canRedo() {
    return this.cursor < this.history.length - 1
  }

  @action undo() {
    if (!this.canUndo) return
    this.history[this.cursor].undo()
    this.cursor--
  }

  @action redo() {
    if (!this.canRedo) return
    this.cursor++
    this.history[this.cursor].redo()
  }
}

class Circle implements ICircle {
  @observable x = 0
  @observable y = 0
  @observable diameter = 0
  constructor(private store: Store, x: number, y: number, diameter: number) {
    this.x = x
    this.y = y
    this.diameter = diameter
  }
  @computed get hovered(): boolean {
    return this === this.store.hovered
  }
  @computed get selected(): boolean {
    return this === this.store.selected
  }
  @computed get active(): boolean {
    if (this.store.selected == null) return this.hovered
    return this.selected
  }
}

class Store {
  private readonly undoManager = new UndoManager()

  readonly circles = observable.array<Circle>()

  @observable hovered: Circle = null
  @observable selected: Circle = null

  getClosest(x: number, y: number): Circle {
    let circle = null
    let minDist = Number.MAX_VALUE
    for (const c of this.circles) {
      const d = Math.sqrt(Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2))
      if (d <= c.diameter / 2 && d < minDist) {
          circle = c
          minDist = d
      }
    }
    return circle
  }

  canUndo = computed(() => this.undoManager.canUndo)
  canRedo = computed(() => this.undoManager.canRedo)

  undo() {
    this.undoManager.undo()
  }

  redo() {
    this.undoManager.redo()
  }

  addCreateCircleEdit(circle: Circle) {
    this.undoManager.addEdit(new Edit(
      () => this.circles.remove(circle),
      () => this.circles.push(circle)
    ))
  }

  addChangeDiameterEdit(circle: Circle, oldDiameter: number, newDiameter: number) {
    this.undoManager.addEdit(new Edit(
      () => circle.diameter = oldDiameter,
      () => circle.diameter = newDiameter
    ))
  }
}

@observer
export class CircleDrawerTraditional extends Comp {

  store = new Store()

  inContextMode = observable.box(false)

  componentDidMount() {
    this.autorun(() => {
      if (!this.inContextMode.get()) {
        this.store.selected = null
      }
    })
  }

  @action handleAddCircle = (x: number, y: number) => {
    const circle = new Circle(this.store, x, y, 30)
    this.store.circles.push(circle)
    this.store.addCreateCircleEdit(circle)
    this.store.hovered = circle
  }

  @action handleContextMenu = () => {
    if (this.store.hovered == null) return
    this.store.selected = this.store.hovered
  }

  @action handleMouseMove = (x: number, y: number) => {
    this.store.hovered = this.store.getClosest(x, y)
  }

  @action handleMouseLeave = () => {
    this.store.hovered = null
  }

  @action handleAdjust = () => {
  }

  @action handleChangeDiameter = (d: number) => {
    this.store.selected.diameter = d
  }

  @action handleStopChangeDiameter = (initial: number, d: number) => {
    const circle = this.store.selected
    this.store.addChangeDiameterEdit(circle, initial, d)
    circle.diameter = d
  }

  handleGetCircleActive = (c: ICircle): boolean => {
    return (c as Circle).active
  }

  render() {
    return (
      <CircleDrawerPure
        circles={this.store.circles}
        inContextMode={this.inContextMode}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onCanvasClick={this.handleAddCircle}
        onCircleClick={this.handleContextMenu}
        onAdjustClick={this.handleAdjust}
        getCircleActive={this.handleGetCircleActive}
        getInitialDiameter={() => this.store.selected.diameter}
        onDiameterChange={this.handleChangeDiameter}
        onDiameterRelease={this.handleStopChangeDiameter}
        onUndo={() => this.store.undo()}
        onRedo={() => this.store.redo()}
        canUndo={this.store.canUndo}
        canRedo={this.store.canRedo}
      />
    )
  }
}
