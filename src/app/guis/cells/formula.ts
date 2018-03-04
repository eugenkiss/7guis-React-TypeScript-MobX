import {Cell} from './cell'

type Env = Array<Array<Cell>>

export abstract class Formula {
  eval(cells: Env): number { return 0 }
  getReferences(cells: Env): Cell[] { return [] }
  get hasValue(): boolean { return true }
}

export class Textual extends Formula {
  constructor(
    public value: string
  ) {
    super()
  }

  toString() {
    return this.value
  }

  get hasValue(): boolean { return false }
}

export class Number extends Formula {
  constructor(
    public value: number
  ) {
    super()
  }

  toString() {
    return this.value.toString()
  }

  eval(cells: Env): number {
    return this.value
  }
}

export class Coord extends Formula {
  constructor(
    public row: number,
    public col: number,
  ) {
    super()
  }

  toString() {
    return String.fromCharCode('A'.charCodeAt(0) + this.col) + this.row.toString()
  }

  eval(cells: Env): number {
    return cells[this.row][this.col].value.get()
  }

  getReferences(cells: Env): Cell[] {
    return [cells[this.row][this.col]]
  }
}

export class Range extends Formula {
  constructor(
    public c1: Coord,
    public c2: Coord,
  ) {
    super()
  }

  toString() {
    return this.c1.toString() + ':' + this.c2.toString()
  }

  get hasValue(): boolean { return false }

  eval(): number {
    throw new Error('Range cannot be evaluated!')
  }

  getReferences(cells: Env): Cell[] {
    const result = []
    for (let r = this.c1.row; r <= this.c2.row; r++) {
      for (let c = this.c1.col; c <= this.c2.col; c++) {
        result.push(cells[r][c])
      }
    }
    return result
  }
}

type Op = (vals: number[]) => number

const opTable: {[name: string]: Op} = {
  'add': (vals: number[]) => vals[0] + vals[1],
  'sub': (vals: number[]) => vals[0] - vals[1],
  'div': (vals: number[]) => vals[0] / vals[1],
  'mul': (vals: number[]) => vals[0] * vals[1],
  'mod': (vals: number[]) => vals[0] % vals[1],
  'sum': (vals: number[]) => vals.reduce((prev, curr) => prev + curr, 0),
  'prod': (vals: number[]) => vals.reduce((prev, curr) => prev * curr, 1),
}

const evalList = (cells: Env, args: Formula[]) => {
  const result = []
  for (const a of args) {
    if (a instanceof Range) {
      for (const c of a.getReferences(cells)) {
        result.push(c.value.get())
      }
    } else {
      result.push(a.eval(cells))
    }
  }
  return result
}

export class Application extends Formula {
  constructor(
    public name: string,
    public args: Array<Formula>,
  ) {
    super()
  }

  toString() {
    return this.name + '(' + this.args.map(a => a.toString()).join(', ') + ')'
  }

  eval(cells: Env): number {
    try {
      return opTable[this.name](evalList(cells, this.args))
    } catch (e) {
      return NaN
    }
  }

  getReferences(cells: Env): Cell[] {
    const result = []
    for (const a of this.args) {
      result.concat(a.getReferences(cells))
    }
    return result
  }
}

export const EmptyFormula = new Textual("")
