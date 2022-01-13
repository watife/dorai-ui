import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AlertDialog } from '@dorai-ui/alert-dialog'

const Template: ComponentStory<typeof AlertDialog> = (args) => (
  <AlertDialog {...args}>
    <AlertDialog.Trigger>Open Modal</AlertDialog.Trigger>
    <AlertDialog.Group>
      <AlertDialog.Title>Destructive activity</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be reversed once clicked, please be certain you want
        to proceed!
      </AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Delete</AlertDialog.Action>
    </AlertDialog.Group>
  </AlertDialog>
)

export const Default = Template.bind({})

export default {
  title: 'Alert Dialog',
  component: AlertDialog
} as ComponentMeta<typeof AlertDialog>
