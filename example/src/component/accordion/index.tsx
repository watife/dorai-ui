import React from 'react'

import { Accordion } from 'dorai-ui'

function AccordionComponent() {
  return (
    <div>
      <Accordion>
        <Accordion.Group>
          <Accordion.Header>
            <Accordion.Trigger>open accordion</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>This is the panel text</Accordion.Panel>
        </Accordion.Group>
        <Accordion.Group>
          <Accordion.Header>
            <Accordion.Trigger>open accordion 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>This is the panel text 2</Accordion.Panel>
        </Accordion.Group>
      </Accordion>
    </div>
  )
}

export { AccordionComponent }
