import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {computed, observable} from 'mobx'
import {css} from 'emotion'
import {DateTime} from 'luxon'
import {Box, Button, Flex, Label, Stack, VFlex} from '../basic'
import {now} from 'mobx-utils'

interface ReadOnlyObs<T> {
    get(): T;
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

const padder = <Label className={css`visibility: hidden`}>Elapsed Time:{' '}</Label>

const MAX = 30000

@observer
export class Timer extends Component {

  @observable start = new Date().getTime()
  readonly elapsed = computed(() => {
    const max = this.max.get()
    if (new Date().getTime() - this.start >= max) return max
    return clamp(now(100) - this.start, 0, max)
  })
  readonly max = observable(MAX / 2)

  render() {
    return (
      <VFlex
        minWidth='350px'
        vspace={1}
      >
        <GaugeTime max={this.max} value={this.elapsed}/>
        <TextTime value={this.elapsed}/>
        <Flex alignItems='center'>
          <Stack>
            {padder}
            <Label>Duration:{' '}</Label>
          </Stack>
          <Box mr={1}/>
          <input
            type='range'
            min={0}
            max={MAX}
            value={this.max.get()}
            onChange={(e) => this.max.set(Math.max(1, parseInt(e.target.value)))}
            className={css`
            flex: 1;
          `}/>
        </Flex>
        <Button
          onClick={() => this.start = new Date().getTime()}
        >
          Reset Timer
        </Button>
      </VFlex>
    )
  }
}

@observer
class TextTime extends Component<{
  value: ReadOnlyObs<number>
}> {
  render() {
    const value = this.props.value.get()
    const seconds = Math.floor(value / 1000)
    const dezipart = Math.floor(value / 100) % 10
    const formatted = `${seconds}.${dezipart}s`
    return (
      <Flex alignItems='center' className={css`user-select: none`}>
        {padder}
        <Label flex='1' textAlign='left'>{formatted}</Label>
      </Flex>
    )
  }
}

@observer
class GaugeTime extends Component<{
  value: ReadOnlyObs<number>
  max: ReadOnlyObs<number>
}> {
  render() {
    const { value, max } = this.props
    return (
      <Flex alignItems='center'>
        <Label>Elapsed Time:{' '}</Label>
        <Box mr={1}/>
        <meter
          min={0} max={max.get()}
          value={value.get()}
          className={css`
          flex: 1;
        `}/>
      </Flex>
    )
  }
}