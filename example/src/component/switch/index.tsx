import React from 'react'

import { Switch } from 'dorai-ui'

function SwitchComponent() {
  return (
    <Switch>
      {({ checked }) => (
        <>
          <Switch.Button id='toggle'>Click to toggle</Switch.Button>
          <Switch.Label htmlFor='toggle'>toggle label</Switch.Label>
          <p>{checked ? 'checked' : 'off'}</p>
        </>
      )}
    </Switch>
  )
}

export { SwitchComponent }
