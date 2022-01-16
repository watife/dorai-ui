import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { RadioGroup } from '../lib'

const Template: ComponentStory<typeof RadioGroup> = (args) => {
  const [value, setValue] = React.useState(null)

  return (
    <RadioGroup {...args} value={value} onChange={setValue}>
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

export const Controlled = Template.bind({})
Controlled.args = {
  checked: false,
  disabled: false
}

export default {
  title: 'RadioGroup',
  component: RadioGroup
} as ComponentMeta<typeof RadioGroup>
