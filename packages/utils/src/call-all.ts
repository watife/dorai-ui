const callAll =
  <T extends any[]>(...fns: Array<(...args: T) => void>) =>
  (...args: T) =>
    fns.forEach((fn) => fn?.(...args))

export { callAll }
