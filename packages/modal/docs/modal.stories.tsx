import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Modal } from '../lib'

export const Manual: ComponentStory<typeof Modal> = function ModalComponent() {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenModal = () => {
    //other actions you want to perform
    setIsOpen((prev) => !prev)
  }
  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)}>Open Modal</button>
      <Modal isOpen={isOpen} setIsOpen={handleOpenModal}>
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
            <Modal.Button>close</Modal.Button>
          </div>
        </Modal.Group>
      </Modal>
    </div>
  )
}
export const Default: ComponentStory<typeof Modal> =
  function AccordionComponent() {
    return (
      <Modal>
        <Modal.Button>Open Modal</Modal.Button>
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
            <Modal.Button>close</Modal.Button>
          </div>
        </Modal.Group>
      </Modal>
    )
  }

export default { title: 'Modal', component: Modal } as ComponentMeta<
  typeof Modal
>
