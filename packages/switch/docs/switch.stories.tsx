import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Switch } from '../lib'

const Template: ComponentStory<typeof Switch> = (args) => {
  return (
    <Switch.Group>
      <Switch name='switch' {...args}>
        {({ checked }) => (
          <>
            <Switch.Indicator />
            <p>{checked ? 'checked' : 'off'}</p>
          </>
        )}
      </Switch>
      <Switch.Label>toggle label</Switch.Label>
    </Switch.Group>
  )
}

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
