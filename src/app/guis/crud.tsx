import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {computed, IObservableValue, observable} from 'mobx'
import {css} from 'emotion'
import {DateTime} from 'luxon'
import {Box, Button, Flex, Label, Stack, TextInput, VFlex} from '../basic'
import {uuid} from '../utils'

const padder = <Label className={css`visibility: hidden`}>Surname:{' '}</Label>

@observer
export class Crud extends Component {

  readonly prefix = observable('')
  readonly firstName = observable('')
  readonly lastName = observable('')
  readonly name = computed(() => `${this.lastName}, ${this.firstName}`)
  readonly selected = observable('')
  readonly db = observable.array([
    [uuid(), "Emil, Hans"],
    [uuid(), "Mustermann, Max"],
    [uuid(), "Tisch, Roman"],
  ])
  readonly filtered = computed(() =>
    this.db.filter(([_, x]) => x.toLowerCase().indexOf(this.prefix.get().toLowerCase()) !== -1))

  handleCreate = () => {
    this.db.push([uuid(), this.name.get()])
  }

  handleUpdate = () => {
    const id = this.selected.get()
    const index = this.db.findIndex(([i, _]) => i === id)
    if (index === -1) return
    this.db[index] = [uuid(), this.name.get()]
  }

  handleDelete = () => {
    const id = this.selected.get()
    const index = this.db.findIndex(([i, _]) => i === id)
    if (index === -1) return
    this.db.splice(index, 1)
  }

  render() {
    return (
      <VFlex
        minWidth='410px'
        vspace={2}
      >
        <Flex hspace={1}>
          <Flex flex='1'>
            <Label>Filter{'\u00A0'}prefix:{'\u00A0'}</Label>
            <TextField width='0' flex='1' value={this.prefix}/>
          </Flex>
          <Box flex='1'/>
        </Flex>

        <Flex hspace={1}>
          <select
            size={2}
            value={this.selected.get()}
            onChange={(e) => this.selected.set(e.target.value)}
            onClick={(e) => this.selected.set((e.target as any).value)}
            className={css`
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 5px;
          `}>
            {this.filtered.get().map(([id, x]) =>
              <option key={id} value={id}>{x}</option>
            )}
          </select>
          <Box flex='1' vspace={1}>
            <Flex>
              <Stack>
                {padder}
                <Label>Name:{' '}</Label>
              </Stack>
              <TextField flex='1' value={this.firstName}/>
            </Flex>
            <Flex>
              <Label>Surname:{' '}</Label>
              <TextField flex='1' value={this.lastName}/>
            </Flex>
          </Box>
        </Flex>

        <Flex hspace={1}>
          <Button onClick={this.handleCreate}>Create</Button>
          <Button onClick={this.handleUpdate}>Update</Button>
          <Button onClick={this.handleDelete}>Delete</Button>
        </Flex>
      </VFlex>
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