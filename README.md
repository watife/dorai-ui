# DORAI UI

**COMING SOON 🤩**

Accessible, unstyled, open-sourced and fully functional react component library for building design systems

> Documentation site coming soon

<br />

[![CI](https://github.com/watife/dorai-ui/actions/workflows/quality.yml/badge.svg)](https://github.com/watife/dorai-ui/actions/workflows/quality.yml) ![Shield](https://img.shields.io/badge/contributions-welcome-brightgreen) [![Twitter](https://img.shields.io/twitter/follow/:wati_fe.svg?style=social&label=@wati_fe)](https://twitter.com/wati_fe)

## Features

- 🎨 &nbsp; Unstyled --> Are you frustrated with tightly coupled components with styles and a particular approach to extend their functionalities? Dorai offers components not coupled with styles. Do you want to use utility styles or CSS-in-JS? Styles rest in your absolute control.

* 🚀 &nbsp; Accessible --> Building a component library is difficult, supporting accessibility is a more difficult task. With dorai, components are accessible out of the box following the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.2/#aria_ex) specification.

* ⚓️ &nbsp; Controlled and UnControlled --> Dorai components are controlled and some components also offer external controlled ability as deemed fit. Efforts are being made to offer external control abiliity to all components.

* 💧 &nbsp; Independent & All-in-One Component --> Dorai components are independently shipped. This grants the ability to install a single component or multiple as needed. Future effort includes a single, all-in-one package option.

## Example usage

You can make use of a component of your choice by simply installing it;

```
npm install @dorai-ui/Tabs

```

or

```
yarn add @dorai-ui/tabs

```

An example way of using the installed component

```
import { Tabs } from '@dorai-ui/Tabs'

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
✅ - Ready to be released<br/>
<br />
🛠 - In progress<br/>
<br />

| Status | Name           |
| ------ | -------------- |
| ✅     | Accordion      |
| ✅     | Dialog (Modal) |
| ✅     | Switch         |
| ✅     | Tabs           |
| 🛠      | Menu Button    |
| 🛠      | Alert          |

## Contributors

This project exists thanks to our contributors.

<a href="https://github.com/watife/dorai-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=watife/dorai-ui" />
</a>
