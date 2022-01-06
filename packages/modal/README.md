# `@dorai-ui/modal`

The accessible, unstyled fully functional modal component from @dorai-ui

## Installation

```sh
npm i @dorai-ui/modal
```

or

```sh
yarn add @dorai-ui/modal
```

## Example Usage

```
import { Modal } from '@dorai-ui/modal'

function ModalComponent() {
  return (
    <Modal>
      <Modal.Trigger>
        Open Modal
      </Modal.Trigger>
      <Modal.Group>
        <Modal.Overlay />
        <div>
          <Modal.Title>
            Title of Modal with my own controls
          </Modal.Title>
          <Modal.Description>
            Description of modal
          </Modal.Description>
          <Modal.Trigger>
            close
          </Modal.Trigger>
        </div>
      </Modal.Group>
    </Modal>
  )
}
```

## Documentation

Further documentation and examples can be found [here](https://watife.github.io/dorai-ui/?path=/story/modal--manual).
