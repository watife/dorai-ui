# `@dorai-ui/radio-group`

The accessible, unstyled, fully functional radio-group component from @dorai-ui.

## Installation

```sh
npm i @dorai-ui/radio-group
```

or

```sh
yarn add @dorai-ui/radio-group
```

## Example Usage

```
import { RadioGroup } from '@dorai-ui/radio-group'

function RadioGroupComponent() {
  const [value, setValue] = React.useState(null)

  return (
    <RadioGroup value={value} onChange={setValue}>
      <RadioGroup.Label>Example Label</RadioGroup.Label>
      <RadioGroup.Option value='option 1'>
        {({ checked, active }) => (
          <span
            style={{ color: checked ? 'purple' : active ? 'red' : 'unset' }}
          >
            option 1 checked
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value='option 2'>
        {({ checked, active }) => (
          <span
            style={{ color: checked ? 'purple' : active ? 'red' : 'unset' }}
          >
            option 2 checked
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  )
}
```

## Documentation

Further documentation and examples can be found [here](https://watife.github.io/dorai-ui/?path=/story/radiogroup--controlled).
