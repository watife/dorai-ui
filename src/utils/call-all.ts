const callAll =
  (...fns: Array<(args?: any) => void>) =>
  (...args: any) =>
    fns.forEach((fn) => fn && fn(...args))

export { callAll }
