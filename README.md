<img
  src="./logo.svg"
  alt="dorai-ui logo"
  title="dorai-ui logo"
  style="display: inline-block; margin: 0 auto; width:100%" />

<br />
<br />

# Dorai UI

**An accessible, unstyled, open-sourced and fully functional react component library for building design systems**

<br />

> Documentation site coming soon

> Storybook documentation - [here](https://watife.github.io/dorai-ui/?path=/docs/accordion--multiple)

<br />

[![CI](https://github.com/watife/dorai-ui/actions/workflows/quality.yml/badge.svg)](https://github.com/watife/dorai-ui/actions/workflows/quality.yml) ![Shield](https://img.shields.io/badge/contributions-welcome-brightgreen) [![Twitter](https://img.shields.io/twitter/follow/:wati_fe.svg?style=social&label=@wati_fe)](https://twitter.com/wati_fe)

## Features

- 🎨 &nbsp; Unstyled --> Are you frustrated with tightly coupled components with styles and a fixed approach to extend their functionalities? Dorai offers components not coupled with styles. Do you want to use utility styles or CSS-in-JS? Styles rest in your absolute control.

* 🚀 &nbsp; Accessible --> Building a component library is difficult, supporting accessibility is a more difficult task. With dorai, components are accessible out of the box following the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.2/#aria_ex) specification.

* ⚓️ &nbsp; Controlled and UnControlled --> Dorai components are controlled and some components also offer external controlled ability as deemed fit. Efforts are being made to offer external control abiliity to all components.

* 💧 &nbsp; Independent & All-in-One Component --> Dorai components are independently shipped. This grants the ability to install a single component or multiple as needed. All of the components can be added by installing the @dorai-ui/components.

## Installation

All components can be found [here](https://www.npmjs.com/search?q=dorai-ui) on npm. <br />

To install all of the components together, you can find it [here](https://www.npmjs.com/package/@dorai-ui/components)

## Example usage

You can make use of a component of your choice by simply installing it;

```
npm install @dorai-ui/tabs
```

or

```
yarn add @dorai-ui/tabs
```

An example way of using the installed component

```
import { Tabs } from '@dorai-ui/tabs'

 function ModalComponent() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Trigger>tab 1</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel>
        <p>Panel Tab 1</p>
      </Tabs.Panel>
    </Tabs>
  )
}
```

## Roadmap

The project seeks to support as many components as possible as listed under [Aria Design Patterns](https://www.w3.org/TR/wai-aria-practices-1.2). The roadmap table shows components already built and the ones in progress.

<br />
✅ - Released<br/>
<br />
🛠 - In progress<br/>
<br />

| Status | Name           |
| ------ | -------------- |
| ✅     | Accordion      |
| ✅     | Dialog (Modal) |
| ✅     | Switch         |
| ✅     | Tabs           |
| ✅     | Alert          |
| ✅     | Alert Dialog   |
| ✅     | Radio Group    |
| 🛠      | Checkbox       |
| 🛠      | Menu           |

## Contributors

This project exists thanks to our contributors.

<a href="https://github.com/watife/dorai-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=watife/dorai-ui" />
</a>
