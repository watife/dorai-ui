import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Tabs } from '../lib'

const Template: ComponentStory<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <Tabs.List>
      <Tabs.Trigger>
        {({ active }) => (
          <p style={{ border: active ? `1px solid red` : undefined }}>tab 1</p>
        )}
      </Tabs.Trigger>
      <Tabs.Trigger>
        {({ active }) => (
          <p style={{ border: active ? `1px solid red` : undefined }}>tab 2</p>
        )}
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Panel>Panel Tab 1</Tabs.Panel>
    <Tabs.Panel>Panel Tab 2</Tabs.Panel>
  </Tabs>
)

export const Vertical = Template.bind({})
Vertical.args = {
  vertical: true,
  manual: false
}

export const Horizontal = Template.bind({})
Horizontal.args = {
  vertical: false,
  manual: false
}

export const Manual = Template.bind({})
Manual.args = {
  vertical: false,
  manual: true
}

export const Default = Template.bind({})
Default.args = {
  vertical: false,
  manual: false,
  defaultIndex: 1
}

export default {
  title: 'Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>
