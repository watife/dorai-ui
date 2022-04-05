function mergeRefs<T>(refs: Array<React.Ref<T>>): React.RefCallback<T> {
  return function (value) {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        return ref(value)
      }
      if (ref !== null) {
        return ((ref as React.MutableRefObject<T | null>).current = value)
      }
    })
  }
}

export { mergeRefs }
