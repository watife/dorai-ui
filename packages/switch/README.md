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

```jsx
import { Switch } from '@dorai-ui/switch'

function SwitchComponent() {
  return (
    <Switch name='switch' {...args}>
      {({ checked }) => (
        <>
          <Switch.Indicator />
          <Switch.Label>toggle label</Switch.Label>
        </>
      )}
    </Switch>
  )
}
```

## Documentation

Further documentation and examples can be found [here](https://watife.github.io/dorai-ui/?path=/story/modal--manual).
