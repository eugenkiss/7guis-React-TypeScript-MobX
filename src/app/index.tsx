import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'
import {css, cx} from 'emotion'
import {ThemeProvider} from 'emotion-theming'
import * as FontAwesome from '@fortawesome/react-fontawesome'
import faFileCode from '@fortawesome/fontawesome-free-solid/faFileCode'
import './css'
import {Counter} from './guis/counter'
import {Box, Fill, Flex} from './basic'
import {TempConvAuto, TempConvManual} from './guis/tempconv'
import {FlightBooker} from './guis/flight'
import {Timer} from './guis/timer'
import {Crud} from './guis/crud'
import {CircleDrawerTraditional} from './guis/circles/drawer-traditional'
import {Cells} from './guis/cells'

const theme = {
  fontSizes: [
    10, 12, 13, 16, 20, 24, 32, 48, 64
  ],
}

@observer
class App extends React.Component<{
}> {

  renderGui(title, filename, comp) {
    return (
      <Box mb={4}>
        <Flex
          f={2}
          flexDirection='column'
          className={cx('window', css`
          display: inline-flex;
        `)}>
          <Flex
            p={1} f={2} textAlign='center' alignItems='center'
            className={cx('titlebar', css`
            position: relative;
            user-select: none;
          `)}>
            <Box
              className={css`
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            `}>
              {title}
            </Box>
            <Fill/>
            <a
              target='_blank'
              href={`https://github.com/eugenkiss/7guis-React-TypeScript-MobX/blob/master/src/app/guis/${filename}`}
            >
              <FontAwesome color='#999' icon={faFileCode}/>
            </a>
          </Flex>
          <Box p={2}>
          {comp}
          </Box>
        </Flex>
      </Box>
    )
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div
          className={css`
          max-width: 40rem;
          margin-left: auto;
          margin-right: auto;
          padding: 1.5rem 1.125rem;
        `}>
          <MobxDevTools position={{bottom: 0, right: 0}}/>
          <h1>7GUIs in React/TypeScript/MobX</h1>
          <Box mb={4}/>
          <Box f={3}>
            This is a live version of an implementation
            {' '}(<a href='https://github.com/eugenkiss/7guis-React-TypeScript-MobX'>source</a>){' '}
            of
            {' '}<a href='https://eugenkiss.github.io/7guis/'>7GUIs</a>{' '}
            with
            {' '}<a href='https://reactjs.org/'>React</a>,{' '}
            {' '}<a href='https://www.typescriptlang.org'>TypeScript</a> and{' '}
            {' '}<a href='https://mobx.js.org/'>MobX</a>.{' '}
          </Box>
          <Box mb={4}/>
          {this.renderGui('Counter', 'counter.tsx', <Counter/>)}
          {this.renderGui('TempConv Manual', 'tempconv.tsx', <TempConvManual/>)}
          {this.renderGui('TempConv Auto', 'tempconv.tsx', <TempConvAuto/>)}
          {this.renderGui('Flight Booker', 'flight.tsx', <FlightBooker/>)}
          {this.renderGui('Timer', 'timer.tsx', <Timer/>)}
          {this.renderGui('CRUD', 'crud.tsx', <Crud/>)}
          {this.renderGui('Circle Drawer Traditional', 'circles/drawer-traditional.tsx', <CircleDrawerTraditional/>)}
          {this.renderGui('Cells', 'cells.tsx', <Cells/>)}
        </div>
      </ThemeProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))
