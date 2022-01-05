# `@dorai-ui/accordion`

The accessible, unstyled fully functional accordion component from @dorai-ui.

## Installation

```sh
npm i @dorai-ui/accordion
```

or

```sh
yarn add @dorai-ui/accordion
```

## Example Usage

```
import { Accordion } from '@dorai-ui/accordion'

function AccordionComponent()  {
  return (
    <Accordion>
      <Accordion.Group>
        <Accordion.Header>
          <Accordion.Trigger>open accordion</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>This is the panel text</Accordion.Panel>
      </Accordion.Group>
      <Accordion.Group>
        <Accordion.Header>
          <Accordion.Trigger>open accordion 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>This is the panel text 2</Accordion.Panel>
      </Accordion.Group>
    </Accordion>
  )
}
```

## Documentation

Further documentation and examples can be found [here](https://watife.github.io/dorai-ui/?path=/story/accordion--multiple).
