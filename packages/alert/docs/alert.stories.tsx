import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Alert } from '@dorai-ui/alert'

const Template: ComponentStory<typeof Alert> = (args) => (
  <Alert {...args}>
    <p>Alert component</p>
  </Alert>
)

export const Default = Template.bind({})

export default {
  title: 'Alert',
  component: Alert
} as ComponentMeta<typeof Alert>
