import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Tabs } from '@dorai-ui/Tabs'

export const Primary: ComponentStory<typeof Tabs> = function ModalComponent() {
  return (
    <Tabs vertical>
      <Tabs.List>
        <Tabs.Trigger>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 1
            </p>
          )}
        </Tabs.Trigger>
        <Tabs.Trigger>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 2
            </p>
          )}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel>
        <p>Panel Tab 1</p>
      </Tabs.Panel>
      <Tabs.Panel>
        <p>Panel Tab 2</p>
      </Tabs.Panel>
    </Tabs>
  )
}
export const Manual: ComponentStory<typeof Tabs> =
  function AccordionComponent() {
    return (
      <Tabs manual>
        <Tabs.List>
          <Tabs.Trigger>
            {({ active }) => (
              <p style={{ border: active ? `1px solid red` : undefined }}>
                tab 1
              </p>
            )}
          </Tabs.Trigger>
          <Tabs.Trigger>
            {({ active }) => (
              <p style={{ border: active ? `1px solid red` : undefined }}>
                tab 2
              </p>
            )}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel>
          <p>Panel Tab 1</p>
        </Tabs.Panel>
        <Tabs.Panel>
          <p>Panel Tab 2</p>
        </Tabs.Panel>
      </Tabs>
    )
  }

export default {
  title: 'Tabs',
  component: Tabs,
  argTypes: {
    vertical: {
      control: 'boolean'
    }
  }
} as ComponentMeta<typeof Tabs>
