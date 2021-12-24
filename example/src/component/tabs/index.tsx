import React from 'react'

import { Tabs } from 'dorai-ui'

function TabsComponent() {
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

export { TabsComponent }
