import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '@dorai-ui/accordion'

type AccordionType = {
  defaultIndex?: number
  type?: 'single' | 'multiple'
}

const AccordionComponent = ({
  defaultIndex,
  type = 'multiple'
}: AccordionType) => {
  return (
    <Accordion defaultIndex={defaultIndex} type={type}>
      <Accordion.Group>
        <Accordion.Header>
          <Accordion.Trigger>accordion trigger</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <p>This is the panel text</p>
        </Accordion.Panel>
      </Accordion.Group>
      <Accordion.Group>
        <Accordion.Header>
          <Accordion.Trigger>open accordion 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <p>This is the panel text 2</p>
        </Accordion.Panel>
      </Accordion.Group>
    </Accordion>
  )
}

describe('Safe rules of component', () => {
  it.each([
    ['Accordion.Group', Accordion.Group],
    ['Accordion.Header', Accordion.Header],
    ['Accordion.Panel', Accordion.Panel],
    ['Accordion.Trigger', Accordion.Trigger]
  ])(
    'errors if component is rendered without a parent <Accordion />',
    (name, Component) => {
      expect(() => render(<Component>children</Component>)).toThrowError(
        `<${name} /> component is not called within expected parent component`
      )
    }
  )

  describe('Accordion render', () => {
    it('should render without crashing', () => {
      render(<AccordionComponent />)

      expect(
        screen.queryByText(/This is the panel text/i)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/This is the panel text 2/i)
      ).not.toBeInTheDocument()
    })

    it("by default doesn't render any panel until clicked", () => {
      render(<AccordionComponent />)

      expect(
        screen.queryByText(/This is the panel text/i)
      ).not.toBeInTheDocument()

      expect(
        screen.queryByText(/This is the panel text 2/i)
      ).not.toBeInTheDocument()

      const panelBtn = screen.getByText(/accordion trigger/i)

      userEvent.click(panelBtn)

      expect(screen.queryByText(/This is the panel text/i)).toBeInTheDocument()

      expect(
        screen.queryByText(/This is the panel text 2/i)
      ).not.toBeInTheDocument()

      const panelBtn2 = screen.getByText(/open accordion 2/i)

      userEvent.click(panelBtn2)

      expect(
        screen.queryByText(/This is the panel text 2/i)
      ).toBeInTheDocument()
    })

    it('renders only single accordion', () => {
      render(<AccordionComponent type='single' />)

      const panelBtn = screen.getByText(/accordion trigger/i)

      userEvent.click(panelBtn)

      expect(screen.queryByText(/This is the panel text/i)).toBeInTheDocument()

      expect(
        screen.queryByText(/This is the panel text 2/i)
      ).not.toBeInTheDocument()

      const panelBtn2 = screen.getByText(/open accordion 2/i)

      userEvent.click(panelBtn2)

      expect(
        screen.queryByText(/This is the panel text 2/i)
      ).toBeInTheDocument()

      expect(
        screen.queryByText('This is the panel text')
      ).not.toBeInTheDocument()
    })

    it('renders default index', () => {
      render(<AccordionComponent type='single' defaultIndex={0} />)

      expect(screen.queryByText(/This is the panel text/i)).toBeInTheDocument()
    })
  })
})
