import React from 'react'

import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Combobox } from '../src'

const DATA = [
  { name: 'Addi', age: 10 },
  { name: 'nftd', age: 11 },
  { name: 'frt', age: 12 }
]

const filteredData = (search: string) =>
  DATA.filter((item) => item.name.toLowerCase().includes(search))

const Template: ComponentStory<typeof Combobox> = (args) => {
  const [query, setQuery] = React.useState('nftd')

  return (
    <div>
      <Combobox {...args} defaultInputValue={query}>
        <Combobox.Input
          as='input'
          openOnFocus={true}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Combobox.Options>
          {filteredData(query).map((item) => (
            <Combobox.Option
              key={item.name}
              value={item}
              onClick={() => console.log(item.age)}
            >
              {({ active, selected }) => {
                return (
                  <span style={{ color: selected ? 'red' : 'black' }}>
                    {item.name}
                  </span>
                )
              }}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>

      <span>Hellooo</span>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {}

export default {
  title: 'Combobox',
  component: Combobox
} as ComponentMeta<typeof Combobox>
