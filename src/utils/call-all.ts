const callAll =
  (...fns: { (...args: []): void; (...args: []): void }[]) =>
  (...args: []) =>
    fns.forEach((fn) => fn && fn(...args))

export { callAll }
