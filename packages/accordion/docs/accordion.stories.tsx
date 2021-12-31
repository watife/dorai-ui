import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Accordion } from '@dorai-ui/accordion'

export const Default: ComponentStory<typeof Accordion> =
  function AccordionComponent() {
    return (
      <Accordion defaultIndex={0}>
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
    )
  }

export default {
  title: 'Accordion',
  component: Accordion,
  argTypes: {
    vertical: {
      default: true,
      control: 'boolean'
    },
    defaultIndex: {
      default: 0,
      control: 'integer'
    }
  }
} as ComponentMeta<typeof Accordion>
