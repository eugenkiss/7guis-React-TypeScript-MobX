import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {IObservableValue} from 'mobx'
import {DateTime} from 'luxon'
import {Flex, TextInput} from '../basic'

@observer
export class Cells extends Component {

  render() {
    return (
      <Flex
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