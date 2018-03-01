import * as React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import {action, computed, IObservableValue, observable} from 'mobx'
import {css} from 'emotion'
import {DateTime} from 'luxon'
import {Box, BoxClickable, Button, Flex, TextInput, VFlex} from '../basic'

class Circle {
  @observable x = 0
  @observable y = 0
  @observable diameter = 0
  constructor(private store: Store, x: number, y: number, diameter: number) {
    this.x = x
    this.y = y
    this.diameter = diameter
  }
  @computed get selected(): boolean {
    return this === this.store.selected
  }
}

class Store {
  readonly circles = observable.array<Circle>([new Circle(this, 100, 10, 100)])
  @observable selected: Circle = null
}

@observer
class CircleComp extends Component<{
  circle: Circle
}> {
  render() {
    const { circle } = this.props
    return (
      <Box
        position='absolute'
        left={circle.x}
        top={circle.y}
        width={circle.diameter}
        height={circle.diameter}
        border='1px solid #333'
        borderRadius={100}
        style={{transform: 'translate(-50%, -50%)'}}
      />
    )
  }
}

@observer
export class CircleDrawer extends Component {

  store = new Store()

  canvasRef = null

  contextMenuRef = null
  @observable contextMenuVisible = false
  @observable contextMenuX = 50
  @observable contextMenuY = 50

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, true)
    document.addEventListener('scroll', this.handleDocumentScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, true)
    document.removeEventListener('scroll', this.handleDocumentScroll)
  }

  handleDocumentClick = (e) => {
    if (!this.contextMenuVisible || e.target.contains(ReactDOM.findDOMNode(this.contextMenuRef))) return
    e.stopPropagation()
    this.contextMenuVisible = false
  }

  handleDocumentScroll = () => {
    this.contextMenuVisible = false
  }

  handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // TODO: Why does innerRef give the corresponding dom element directly?
    const canvas = ReactDOM.findDOMNode(this.canvasRef) as HTMLElement
    const x = e.pageX - canvas.offsetLeft
    const y = e.pageY - canvas.offsetTop
    const circle = new Circle(this.store, x, y, 30)
    this.store.circles.push(circle)

  }

  @action handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    this.contextMenuVisible = true
    this.contextMenuX = e.pageX
    this.contextMenuY = e.pageY
  }

  render() {
    return (
      <VFlex
        minWidth='410px' height='250px'
        vspace={1}
      >
        <Flex hspace={1} alignSelf='center'>
          <Button>Undo</Button>
          <Button>Redo</Button>
        </Flex>

        <Box
          innerRef={r => this.canvasRef = r}
          flex='1'
          bg='white'
          border='1px solid #bbb'
          position='relative'
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          style={{overflow: 'hidden'}}
        >
          {this.store.circles.map((c, i) => <CircleComp key={i} circle={c}/>)}
        </Box>

        {this.contextMenuVisible &&
          <BoxClickable
            innerRef={r => this.contextMenuRef = r}
            position='absolute'
            left={this.contextMenuX}
            top={this.contextMenuY}
            width={100}
            bg='#aaa'
            border='1px solid #888'
            className={css`
          `}>
            Context Menu
          </BoxClickable>
        }
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