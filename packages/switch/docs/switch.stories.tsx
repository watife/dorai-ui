import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Switch } from '@dorai-ui/switch'

const Template: ComponentStory<typeof Switch> = (args) => (
  <Switch {...args}>
    {({ checked }) => (
      <>
        <Switch.Trigger id='toggle'>Click to toggle</Switch.Trigger>
        <Switch.Label htmlFor='toggle'>toggle label</Switch.Label>
        <p>{checked ? 'checked' : 'off'}</p>
      </>
    )}
  </Switch>
)

export const Controlled = Template.bind({})
Controlled.args = {
  checked: false,
  disabled: false
}

export default {
  title: 'Switch',
  component: Switch
} as ComponentMeta<typeof Switch>
