// Deliberately using a global counter to keep things simplistic
// and to show an alternative style. If you want to have several
// counters then the state should be bound to the component,
// of course.

import * as React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {Button, Flex, Label, Span} from '../basic'

const count = observable(0)

export const Counter = observer(() =>
  <Flex alignItems='center' minWidth='200px'>
    <Label flex='1'>{count.get()}</Label>
    <Button flex='1' onClick={() => count.set(count.get() + 1)}>Count</Button>
  </Flex>
)