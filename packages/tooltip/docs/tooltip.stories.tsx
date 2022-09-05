import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Tooltip } from '../src'

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <Tooltip.Trigger>Open</Tooltip.Trigger>
    <Tooltip.Content>
      <span>tooltip content</span>
    </Tooltip.Content>
  </Tooltip>
)

export const Default = Template.bind({})

export default {
  title: 'Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>
