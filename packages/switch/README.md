# `@dorai-ui/switch`

The accessible, unstyled fully functional switch(toggle) component from @dorai-ui

## Installation

```sh
npm i @dorai-ui/switch
```

or

```sh
yarn add @dorai-ui/switch
```

## Example Usage

```
import { Switch } from '@dorai-ui/switch'

function SwitchComponent() {
  return (
    <Switch>
      {({ checked }) => (
        <>
          <Switch.Trigger id='toggle'>Click to toggle</Switch.Trigger>
          <Switch.Label htmlFor='toggle'>toggle label</Switch.Label>
          <p>{checked ? 'checked' : 'off'}</p>
        </>
      )}
    </Switch>
  )
}
```

## Documentation

Further documentation and examples can be found [here](https://watife.github.io/dorai-ui/?path=/story/modal--manual).
