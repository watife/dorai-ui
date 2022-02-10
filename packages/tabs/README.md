# `@dorai-ui/tabs`

The accessible, unstyled fully functional tab component from @dorai-ui

## Installation

```sh
npm i @dorai-ui/tabs
```

or

```sh
yarn add @dorai-ui/tabs
```

## Example Usage

```jsx
import { Tabs } from '@dorai-ui/tabs'

function TabsComp() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Trigger>tab 1</Tabs.Trigger>
        <Tabs.Trigger>tab 2</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel as='p'>Panel Tab 1</Tabs.Panel>
      <Tabs.Panel as='p'>Panel Tab 2</Tabs.Panel>
    </Tabs>
  )
}
```

## Documentation

Further documentation and examples can be found [here](https://www.dorai-ui.com/components/tabs).
