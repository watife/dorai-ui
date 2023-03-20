import React from 'react'

import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Modal } from '@dorai-ui/modal'

export const Manual: ComponentStory<typeof Modal> = function ModalComponent({
  ...args
}) {
  const [{ isOpen }, updateArgs] = useArgs()
  const handleClose = () => updateArgs({ isOpen: !isOpen })
  return (
    <div>
      <button onClick={handleClose}>Open Modal</button>
      <Modal isOpen={isOpen} setIsOpen={handleClose} {...args}>
        <Modal.Group>
          <Modal.Overlay
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#dadada',
              opacity: '70%',
              zIndex: '1',
              top: '0',
              position: 'absolute'
            }}
          />
          <div style={{ zIndex: '2', position: 'relative' }}>
            <Modal.Title as='h1'>
              Title of Modal with my own controls
            </Modal.Title>
            <Modal.Description as='p' style={{ background: 'red' }}>
              Description of modal
            </Modal.Description>
            <Modal.Close>close</Modal.Close>
          </div>
        </Modal.Group>
      </Modal>
    </div>
  )
}
export const Controlled: ComponentStory<typeof Modal> =
  function AccordionComponent({ ...args }) {
    return (
      <Modal {...args}>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Group>
          <Modal.Overlay
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#dadada',
              opacity: '70%',
              zIndex: '1',
              top: '0',
              position: 'absolute'
            }}
          />
          <div style={{ zIndex: '2', position: 'relative' }}>
            <Modal.Title as='h1'>
              Title of Modal with my own controls
            </Modal.Title>
            <Modal.Description style={{ background: 'red' }}>
              Description of modal
            </Modal.Description>
            <Modal.Close>close</Modal.Close>
          </div>
        </Modal.Group>
      </Modal>
    )
  }

export default {
  title: 'Modal',
  component: Modal,
  args: {
    isOpen: false,
    persistOnOpen: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick: () => {}
  }
} as ComponentMeta<typeof Modal>
