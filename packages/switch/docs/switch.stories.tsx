import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Switch } from '../lib'

const Template: ComponentStory<typeof Switch> = (args) => (
  <Switch name='switch' {...args}>
    {({ checked }) => (
      <>
        <Switch.Indicator />
        <Switch.Label>toggle label</Switch.Label>
        <p>{checked ? 'checked' : 'off'}</p>
      </>
    )}
  </Switch>
)

export const Controlled = Template.bind({})
Controlled.args = {
  checked: false,
  disabled: false,
  onChange: undefined
}

export default {
  title: 'Switch',
  component: Switch
} as ComponentMeta<typeof Switch>
