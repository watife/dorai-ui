# `@dorai-ui/alert-dialog`

The accessible, unstyled fully functional alert-dialog component from @dorai-ui

## Installation

```sh
npm i @dorai-ui/alert-dialog
```

or

```sh
yarn add @dorai-ui/alert-dialog
```

## Example Usage

```
import { AlertDialog } from '@dorai-ui/alert-dialog'

function AlertDialogComponent() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
      <AlertDialog.Group>
        <AlertDialog.Overlay />
        <AlertDialog.Title>Title</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be reversed once clicked, please be certain you
          want to proceed!
        </AlertDialog.Description>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Delete</AlertDialog.Action>
      </AlertDialog.Group>
    </AlertDialog>
  )
}
```

## Documentation

Further documentation and examples can be found [here](http://localhost:6006/?path=/story/alert-dialog--default).
