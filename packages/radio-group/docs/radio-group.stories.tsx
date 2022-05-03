import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { RadioGroup } from '@dorai-ui/radio-group'

const Template: ComponentStory<typeof RadioGroup> = (args) => {
  const [value, setValue] = React.useState('')

  return (
    <RadioGroup {...args} value={value} onChange={setValue}>
      <RadioGroup.Label>Example Radio</RadioGroup.Label>
      <RadioGroup.Option
        value='option 1'
        style={{
          width: '10px',
          height: '10px',
          border: '1px solid black',
          marginBottom: '40px'
        }}
      >
        <RadioGroup.Indicator
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            content: "' '"
          }}
          as='div'
        />
        <RadioGroup.Label
          style={{
            marginLeft: '30px',
            width: '100%'
          }}
        >
          Example
        </RadioGroup.Label>
      </RadioGroup.Option>

      <RadioGroup.Option
        value='option 2'
        style={{
          width: '10px',
          height: '10px',
          border: '1px solid black',
          marginBottom: '40px'
        }}
      >
        <RadioGroup.Label
          style={{
            marginLeft: '30px',
            width: '100%'
          }}
        >
          Group
        </RadioGroup.Label>
        <RadioGroup.Indicator
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%'
          }}
          as='div'
        />
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
