import ReactDOM from 'react-dom'
import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, IObservableValue, observable} from 'mobx'
import {css} from 'emotion'
import {Box, Flex, Span, TextInput, VFlex} from '../../basic'
import {Cell} from './cell'
import {FormulaParser} from './parser'

export class Store {
  cells = Array<Array<Cell>>()
  selected: IObservableValue<Cell> = observable.box(null)
  parser = new FormulaParser()

  constructor() {
    for (let i = 0; i < 10; i++) {
      const row = []
      this.cells.push(row)
      for (let j = 0; j < 5; j++) {
        row.push(new Cell(this))
      }
    }
  }

  @action abort() {
    const selected = this.selected.get()
    if (selected == null) return
    selected.abortEditing()
  }
}

@observer
export class Cells extends Component {

  store = new Store()

  componentDidMount() {
    document.addEventListener('click', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick)
  }

  @action handleClick = () => {
    this.store.abort()
  }

  render() {
    const { cells } = this.store
    return (
      <VFlex
        width='500px'
        vspace={1}
        className={css`
      `}>
        <table
          className={css`
          table-layout: fixed;
          width: 100%;
          border-collapse: collapse;
          background: white;
          border: 1px solid #bbb;
        `}>
          <tbody>
            <tr style={{background: '#f6f6f6', userSelect: 'none'}}>
              {(() => {
                const result = [<th key={-1} style={{width: 30}}>{' '}</th>]
                const start = 'A'.charCodeAt(0)
                for (let i = start; i < start + cells[0].length; i++) {
                  result.push(
                    <th key={i} style={{border: '1px solid #bbb'}}>
                      <Box p={1}>{String.fromCharCode(i)}</Box>
                    </th>
                  )
                }
                return result
              })()}
            </tr>
            {cells.map((row, i) =>
              <tr
                key={i}
              >
                <td style={{
                  background: '#f6f6f6',
                  border: '1px solid #bbb',
                  userSelect: 'none',
                  textAlign: 'center',
                }}>
                  <b>{i}</b>
                </td>
                {row.map((cell, j) =>
                  <td
                    key={j}
                    className={css`
                    border: 1px solid #bbb;
                  `}>
                    <CellComp cell={cell}/>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
        <Span>
          Click inside a cell to edit its content. Hit enter to apply.{' '}
          Click outside the cell or hit escape to abort. Here are some example
          contents: '5.5', 'Some text', '=A1', '=sum(B2:C4)', '=div(C1, 5)'.
        </Span>
      </VFlex>
    )
  }
}

@observer
class CellComp extends Component<{
  cell: Cell
  [key: string]: any
}> {

  @action handleClick = (e) => {
    const { cell } = this.props
    cell.initialContent = cell.content.get()
    cell.makeSelected()
    // https://stackoverflow.com/a/24421834/283607
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  @action handleFocus = (r) => {
    if (r == null) return
    (ReactDOM.findDOMNode(r) as any).focus()
  }

  @action handleEnterKeyPress = (e) => {
    const { cell } = this.props
    if (e.key === 'Enter') {
      e.preventDefault()
      try {
        cell.applyChange()
        cell.unselect()
      } catch (e) {
        alert(e.message)
      }
    }
  }

  @action handleEscKeyUp = (e) => {
    // https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it#comment77751556_41797287
    const { cell } = this.props
    if (e.keyCode === 27) { // Esc
      e.preventDefault()
      cell.abortEditing()
    }
  }

  render() {
    const { cell, ...rest } = this.props
    return (
      <Flex
        p={1} minHeight={32} alignItems='center' justifyContent='center'
        onClick={this.handleClick}
        {...rest}
      >
        {cell.editing.get() ? (
          <TextField
            ref={this.handleFocus}
            w='100%'
            value={cell.content}
            onKeyPress={this.handleEnterKeyPress}
            onKeyUp={this.handleEscKeyUp}
          />
        ) : (
          cell.displayValue.get()
        )}
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
