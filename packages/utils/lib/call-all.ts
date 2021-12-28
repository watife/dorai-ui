const callAll =
  (...fns: ((args: unknown[]) => void)[]) =>
  (...args: unknown[]) =>
    fns.forEach((fn) => fn && fn([...args]))

export { callAll }
