import React from 'react'

import { Tab } from 'dorai-ui'

function TabsComponent() {
  return (
    <Tab.Group>
      <Tab.List>
        <Tab>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 1
            </p>
          )}
        </Tab>
        <Tab>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 2
            </p>
          )}
        </Tab>
        <Tab>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 3
            </p>
          )}
        </Tab>
        <Tab disabled>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 4
            </p>
          )}
        </Tab>
        <Tab>
          {({ active }) => (
            <p style={{ border: active ? `1px solid red` : undefined }}>
              tab 5
            </p>
          )}
        </Tab>
      </Tab.List>
    </Tab.Group>
  )
}

export { TabsComponent }
