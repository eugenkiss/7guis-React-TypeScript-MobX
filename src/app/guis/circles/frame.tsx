import * as React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import {action, IComputedValue, IObservableValue, observable} from 'mobx'
import {css} from 'emotion'
import {DateTime} from 'luxon'
import {Box, BoxClickable, Button, Comp, Flex, VFlex} from '../../basic'
import {ICircle} from './model'

@observer
class CircleComp extends Component<{
  circle: ICircle
  getActive: (c: ICircle) => boolean
}> {
  render() {
    const { circle, getActive } = this.props
    return (
      <Box
        position='absolute'
        left={circle.x}
        top={circle.y}
        width={circle.diameter}
        height={circle.diameter}
        border='1px solid #333'
        borderRadius={100}
        style={{
          transform: 'translate(-50%, -50%)',
          background: getActive(circle) ? '#eee' : undefined,
        }}
      />
    )
  }
}

@observer
export class CircleDrawerPure extends Comp<{
  circles: Array<ICircle>
  inContextMode: IObservableValue<Boolean>
  onMouseMove: (x: number, y: number) => void
  onMouseLeave: () => void
  onCanvasClick: (x: number, y: number) => void
  onCircleClick: (c: ICircle) => void
  onAdjustClick: () => void
  getInitialDiameter: () => number
  getCircleActive: (c: ICircle) => boolean
  onDiameterChange: (d: number) => void
  onDiameterRelease: (initial: number, d: number) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: IComputedValue<Boolean>
  canRedo: IComputedValue<Boolean>
}> {

  canvasRef = null

  contextMenuRef = null
  @observable contextMenuVisible = false
  @observable contextMenuX = 0
  @observable contextMenuY = 0

  diameterDialogRef = null
  @observable diameterDialogVisible = false
  @observable diameterDialogX = 0
  @observable diameterDialogY = 0
  @observable diameter = 0
  initialDiameter: number = null

  componentDidMount() {
    this.autorun(() => {
      this.props.inContextMode.set(this.contextMenuVisible || this.diameterDialogVisible)
    })
    document.addEventListener('click', this.handleDocumentContextMenuClick, true)
    document.addEventListener('click', this.handleDocumentDialogClick, true)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    document.removeEventListener('click', this.handleDocumentContextMenuClick, true)
    document.removeEventListener('click', this.handleDocumentDialogClick, true)
  }

  getClosest(x: number, y: number): ICircle {
    let circle = null
    let minDist = Number.MAX_VALUE
    for (const c of this.props.circles) {
      const d = Math.sqrt(Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2))
      if (d <= c.diameter / 2 && d < minDist) {
          circle = c
          minDist = d
      }
    }
    return circle
  }

  // TODO: What's the type of e?
  @action handleDocumentContextMenuClick = (e) => {
    if (!this.contextMenuVisible || ReactDOM.findDOMNode(this.contextMenuRef).contains(e.target)) return
    e.stopPropagation()
    this.contextMenuVisible = false
  }

  // TODO: Dialog Abstraction (Component)
  @action handleDocumentDialogClick = (e) => {
    if (!this.diameterDialogVisible || ReactDOM.findDOMNode(this.diameterDialogRef).contains(e.target)) return
    e.stopPropagation()
    this.diameterDialogVisible = false
  }

  @action handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = ReactDOM.findDOMNode(this.canvasRef) as HTMLElement
    const x = e.pageX - canvas.offsetLeft
    const y = e.pageY - canvas.offsetTop
    const closest = this.getClosest(x, y)
    if (closest == null) {
      this.props.onCanvasClick(x, y)
    } else {
      this.props.onCircleClick(closest)
      this.handleContextMenu(e)
    }
  }

  @action handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    this.contextMenuVisible = true
    this.contextMenuX = e.pageX
    this.contextMenuY = e.pageY
  }

  @action handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = ReactDOM.findDOMNode(this.canvasRef) as HTMLElement
    const x = e.pageX - canvas.offsetLeft
    const y = e.pageY - canvas.offsetTop
    this.props.onMouseMove(x, y)
  }

  @action handleMouseLeave = () => {
    this.props.onMouseLeave()
  }

  @action handleContextMenuAdjust = () => {
    this.props.onAdjustClick()
    this.contextMenuVisible = false
    this.diameterDialogVisible = true
    this.diameterDialogX = this.contextMenuX
    this.diameterDialogY = this.contextMenuY
    this.diameter = this.props.getInitialDiameter()
    this.initialDiameter = this.diameter
  }

  @action handleChangeDiameter = (e: React.FormEvent<HTMLInputElement>) => {
    this.diameter = parseInt(e.currentTarget.value)
    if (this.initialDiameter == null) this.initialDiameter = this.diameter
    this.props.onDiameterChange(this.diameter)
  }

  @action handleStopChangeDiameter = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.onDiameterRelease(this.initialDiameter, parseInt(e.currentTarget.value))
    this.initialDiameter = null
  }

  render() {
    return (
      <VFlex
        minWidth='410px' height='250px'
        vspace={1}
      >
        <Flex hspace={1} alignSelf='center'>
          <Button
            disabled={!this.props.canUndo.get()}
            onClick={() => this.props.onUndo()}
          >
            Undo
          </Button>
          <Button
            disabled={!this.props.canRedo.get()}
            onClick={() => this.props.onRedo()}
          >
            Redo
          </Button>
        </Flex>

        <Box
          innerRef={r => this.canvasRef = r}
          onClick={this.handleClick}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          flex='1'
          bg='white'
          border='1px solid #bbb'
          position='relative'
          style={{overflow: 'hidden'}}
        >
          {this.props.circles.map((c, i) => <CircleComp key={i} circle={c} getActive={this.props.getCircleActive}/>)}
        </Box>

        {this.contextMenuVisible &&
          <BoxClickable
            innerRef={r => this.contextMenuRef = r}
            onClick={this.handleContextMenuAdjust}
            p={1}
            position='absolute'
            left={this.contextMenuX}
            top={this.contextMenuY}
            width={120}
            bg='#eee'
            border='1px solid #888'
            borderRadius='4px'
            boxShadow='0px 1px 5px rgba(0,0,0,0.15)'
            className={css`
          `}>
            Adjust Diameter
          </BoxClickable>
        }

        {this.diameterDialogVisible &&
          <VFlex
            innerRef={r => this.diameterDialogRef = r}
            p={1}
            vspace={1}
            alignItems='center'
            position='absolute'
            left={this.diameterDialogX}
            top={this.diameterDialogY}
            width={180}
            bg='#eee'
            border='1px solid #888'
            borderRadius='4px'
            boxShadow='0px 1px 5px rgba(0,0,0,0.15)'
            className={css`
          `}>
            <Box flex='1'>Adjust Diameter</Box>
            <input
              type='range'
              min={2}
              max={100}
              value={this.diameter}
              onChange={this.handleChangeDiameter}
              onMouseUp={this.handleStopChangeDiameter}
              className={css`
              flex: 1;
            `}/>
          </VFlex>
        }
      </VFlex>
    )
  }
}
