import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Menu } from '../lib'

const Template: ComponentStory<typeof Menu> = (args) => (
  <Menu {...args}>
    <Menu.Trigger>Menu Open</Menu.Trigger>
    <Menu.List>
      <Menu.Item>
        <p>Item 1</p>
      </Menu.Item>

      {/* <Menu.Item> */}
      {/* <Menu>
        <Menu.Trigger>Second</Menu.Trigger> */}
      {/* <Menu.Trigger>Sub Menu Open</Menu.Trigger> */}
      {/* <Menu.List>
          <Menu.Item as='p'>Sub Menu 1</Menu.Item>
          <Menu.Item as='p'>Sub Menu 2</Menu.Item>
        </Menu.List>
      </Menu> */}
      {/* </Menu.Item> */}

      <Menu.Item>
        <p>Item 3</p>
      </Menu.Item>
    </Menu.List>
  </Menu>
)

export const Default = Template.bind({})
Default.args = {}

export default {
  title: 'Menu',
  component: Menu
} as ComponentMeta<typeof Menu>
