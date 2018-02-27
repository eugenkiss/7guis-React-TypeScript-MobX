import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {computed, IComputedValue, IObservableValue, observable} from 'mobx'
import {css} from 'emotion'
import {DateTime} from 'luxon'
import {Button, Flex, TextInput, Label, Span, Box, Stack} from '../basic'

const padder = <Label className={css`visibility: hidden`}>Surname:{' '}</Label>

@observer
export class CircleDrawer extends Component {

  render() {
    return (
      <Flex
        flexDirection='column'
        minWidth='410px'
        vspace={1}
      >
      </Flex>
    )
  }
}

@observer
class TextField extends Component<{
  value?: IObservableValue<string>
  [key: string]: any
}> {
  render() {
    const { value, ...rest } = this.props
    return (
      <TextInput
        value={value != null ? value.get() : undefined}
        onChange={value != null ? (e) => value.set(e.target.value) : undefined}
        {...rest}
      />
    )
  }
}