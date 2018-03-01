import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {computed, IComputedValue, IObservableValue, observable} from 'mobx'
import {DateTime} from 'luxon'
import {Button, TextInput, VFlex} from '../basic'

const dateFormat = 'dd.MM.yyyy'

function getTimestamp(date: string): number {
  const parsed = DateTime.fromFormat(date, dateFormat)
  if (parsed.invalid != null) return null
  return parsed.valueOf()
}

function isValidDate(date: string): boolean {
  return getTimestamp(date) != null
}

// TODO: How to make themeGet('space.1') work?
@observer
export class FlightBooker extends Component {

  @observable type: 'one-way' | 'return' = 'one-way'

  readonly start = observable(DateTime.local().toFormat(dateFormat))
  readonly end = observable(this.start.get())
  readonly validStart = computed(() => isValidDate(this.start.get()))
  readonly validEnd = computed(() => isValidDate(this.end.get()))
  readonly disabledEnd = computed(() => this.type !== 'return')

  @computed get bookable(): boolean {
    if (!this.validStart.get() || !this.validEnd.get()) return false
    if (this.type === 'return') {
      return getTimestamp(this.start.get()) <= getTimestamp(this.end.get())
    }
    return true
  }

  handleBook = () => {
    switch (this.type) {
      case 'one-way': return alert(`You have booked a one-way flight for ${this.start.get()}`)
      case 'return': return alert(`You have booked a return flight from ${this.start.get()} to ${this.end.get()}`)
    }
    throw 'Impossible'
  }

  render() {
    return (
      <VFlex
        minWidth='200px'
        vspace={2}
      >
        <select
          value={this.type}
          onChange={(e) => this.type = e.target.value as any}
        >
          <option value='one-way'>one-way flight</option>
          <option value='return'>return flight</option>
        </select>
        <DateInput
          value={this.start}
          valid={this.validStart}
          onChange={(e) => this.start.set(e.target.value)}
        />
        <DateInput
          value={this.end}
          valid={this.validEnd}
          disabled={this.disabledEnd}
          onChange={(e) => this.end.set(e.target.value)}
        />
        <Button
          disabled={!this.bookable}
          onClick={this.handleBook}
        >
          Book
        </Button>
      </VFlex>
    )
  }
}

/*
Performance: Only this component will be rerendered in certain situations.
Enable 'Visualize component rerenders' of MobX DevTools (bottom right corner in
live version) to see the effect.

That's why I don't use @observable/@computed for some fields. Proxies could make
this transparent, I think.

In general, it'd be cool if you needn't be aware of that and that extracting
dedicated components wouldn't be necessary either but would be done
automatically as an optimization. This would probably require a different
language.

Note that this performance optimization is not needed it is just here for
illustrative purposes.
*/

@observer
class DateInput extends Component<{
  value: IObservableValue<string>
  valid: IComputedValue<boolean>
  disabled?: IComputedValue<boolean>
  onChange: AnyListener
}> {

  render() {
    const { value, valid, disabled, onChange } = this.props
    const d = disabled != null && disabled.get()
    return (
      <TextInput
        value={value.get()}
        disabled={d}
        style={{background: !valid.get() && !d ? 'coral' : undefined}}
        onChange={onChange}
      />
    )
  }
}