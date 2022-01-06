import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Accordion } from '@dorai-ui/accordion'

const Template: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args}>
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
      <Accordion.Panel {...args}>This is the panel text 2</Accordion.Panel>
    </Accordion.Group>
  </Accordion>
)

export const Multiple = Template.bind({})

export const Single = Template.bind({})
Single.args = {
  type: 'single'
}

export const DefaultOpen = Template.bind({})
DefaultOpen.args = {
  defaultIndex: 0
}

export const PanelFixed = Template.bind({})
PanelFixed.args = {
  fixed: true
}

export default {
  title: 'Accordion',
  component: Accordion,
  args: {
    type: 'multiple'
  }
} as ComponentMeta<typeof Accordion>
