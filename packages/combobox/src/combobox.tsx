import {
  callAll,
  GetId,
  KeyBoardKeys,
  mergeRefs,
  sortByDomNode
} from '@dorai-ui/utils'
import * as Polymorphic from '@dorai-ui/utils/polymorphic'
import { useOutsideClick } from '@dorai-ui/utils/use-outside-click'
import React from 'react'

type OptionRef<TValue> = {
  id: string
  optRef: React.MutableRefObject<HTMLElement | null>
  value: TValue
  textValue: string
}

type StateTypes<TValue> = {
  value: TValue
  optionRefs: OptionRef<TValue>[]
  isOptionsOpen: boolean
  nextFocusableIndex: number
  selectedOption: Omit<OptionRef<TValue>, 'value' | 'optRef'> | null
}

enum ActionEnum {
  registerOption,
  unregisterOption,
  toggleOptionsOpenState,
  handleNextFocusable,
  setSelectedOption,
  restoreOptions,
  setValue
}

type ActionTypes<T> =
  | {
      type: ActionEnum.registerOption
      id: string
      optRef: React.MutableRefObject<HTMLElement | null>
      value: T
      textValue: string
    }
  | {
      type: ActionEnum.setValue
      value: T
    }
  | {
      type: ActionEnum.unregisterOption
      id: string
    }
  | { type: ActionEnum.toggleOptionsOpenState; value: boolean }
  | { type: ActionEnum.handleNextFocusable; value: number }
  | {
      type: ActionEnum.setSelectedOption
      id: string
      textValue: string
    }

function reducer<T>(
  state: StateTypes<T>,
  action: ActionTypes<T>
): StateTypes<T> {
  switch (action.type) {
    case ActionEnum.registerOption: {
      const adjustedOptions = sortByDomNode(
        [
          ...state.optionRefs,
          {
            optRef: action.optRef,
            value: action.value,
            id: action.id,
            textValue: action.textValue
          }
        ],
        (opt) => opt.optRef.current
      )

      return {
        ...state,
        optionRefs: [...adjustedOptions],
        selectedOption:
          state.selectedOption?.textValue === action.textValue
            ? {
                textValue: action.textValue,
                id: action.id
              }
            : state.selectedOption
      }
    }

    case ActionEnum.unregisterOption:
      return {
        ...state,
        optionRefs: state.optionRefs.filter((opt) => opt.id !== action.id)
      }
    case ActionEnum.setSelectedOption:
      return {
        ...state,
        selectedOption: {
          id: action.id,
          textValue: action.textValue
        }
      }
    case ActionEnum.toggleOptionsOpenState:
      return {
        ...state,
        isOptionsOpen: action.value
      }
    case ActionEnum.handleNextFocusable:
      return {
        ...state,
        nextFocusableIndex: action.value
      }
    case ActionEnum.setValue:
      return {
        ...state,
        value: action.value
      }
    default:
      throw new Error('Action not supported')
  }
}

const ComboboxContext = React.createContext<{
  state: StateTypes<unknown>
  value: unknown
  registerOption: <T>(
    id: string,
    optRef: React.MutableRefObject<HTMLElement | null>,
    value: T,
    textValue: string
  ) => void
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  unregisterOption: (id: string) => void
  handleSetOptionsState: (isOpen: boolean) => void
  handleNextFocusable: () => void
  handlePreviousFocusable: () => void
  handleSelectOption: <T>(option: Omit<OptionRef<T>, 'optRef'>) => void
  handleNeutralNextFocusable: (nextValue: number) => void
  handleSetValue: (value: string) => void
} | null>(null)

type RootOwnProps<T> = {
  children: React.ReactNode
  value: T
  onSelect: React.Dispatch<React.SetStateAction<T>>
  autocomplete?: boolean
}

type RootProps<
  T,
  C extends React.ElementType
> = Polymorphic.ComponentPropsWithRef<C, RootOwnProps<T>>

const __DEFAULT_COMBOBOX_TAG__ = 'div'

type RootType = <
  T,
  C extends React.ElementType = typeof __DEFAULT_COMBOBOX_TAG__
>(
  props: RootProps<T, C>
) => React.ReactElement | null

const Root: RootType = React.forwardRef(
  <T, C extends React.ElementType = typeof __DEFAULT_COMBOBOX_TAG__>(
    { as, children, value, ...props }: RootProps<T, C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const [state, dispatch] = React.useReducer(reducer, {
      value: '',
      optionRefs: [],
      isOptionsOpen: false,
      nextFocusableIndex: -1,
      selectedOption: null
    })
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const internalRef = React.useRef<HTMLElement | null>(null)
    const mergedRef = mergeRefs([internalRef, ref])

    const registerOption = React.useCallback(
      <T,>(
        id: string,
        optRef: React.MutableRefObject<HTMLElement | null>,
        value: T,
        textValue: string
      ) => {
        dispatch({
          type: ActionEnum.registerOption,
          optRef,
          value,
          id,
          textValue
        })
      },
      []
    )
    const unregisterOption = React.useCallback((id: string) => {
      dispatch({ type: ActionEnum.unregisterOption, id })
    }, [])

    const handleSetOptionsState = React.useCallback((isOpen: boolean) => {
      dispatch({ type: ActionEnum.toggleOptionsOpenState, value: isOpen })
    }, [])

    const handleSetValue = React.useCallback((value: string) => {
      dispatch({ type: ActionEnum.setValue, value })
    }, [])

    const handleNextFocusable = React.useCallback(() => {
      let nextFocuableTab = state.nextFocusableIndex

      if (state.optionRefs.length - 1 === nextFocuableTab) {
        nextFocuableTab = 0
      } else {
        nextFocuableTab += 1
      }

      const focusedOption = state.optionRefs[nextFocuableTab]

      focusedOption.optRef.current?.focus()

      dispatch({
        type: ActionEnum.handleNextFocusable,
        value: nextFocuableTab
      })
    }, [state.nextFocusableIndex, state.optionRefs])

    const handleNeutralNextFocusable = React.useCallback(
      (nextValue: number) => {
        dispatch({
          type: ActionEnum.handleNextFocusable,
          value: nextValue
        })
      },
      []
    )

    const handlePreviousFocusable = React.useCallback(() => {
      let nextFocuableTab = state.nextFocusableIndex

      if (nextFocuableTab - 1 < 0) {
        nextFocuableTab = state.optionRefs.length - 1
      } else {
        nextFocuableTab -= 1
      }

      const focusedOption = state.optionRefs[nextFocuableTab]

      focusedOption.optRef.current?.focus()

      dispatch({
        type: ActionEnum.handleNextFocusable,
        value: nextFocuableTab
      })
    }, [state.nextFocusableIndex, state.optionRefs])

    const handleSelectOption = React.useCallback(
      <T,>(option: Omit<OptionRef<T>, 'optRef'>) => {
        if (inputRef.current) {
          inputRef.current.value = option.textValue
        }
        dispatch({
          type: ActionEnum.setSelectedOption,
          ...option
        })
        props.onSelect(option.value)
      },
      [props]
    )

    const context = React.useMemo(
      () => ({
        value,
        registerOption,
        unregisterOption,
        handleSetOptionsState,
        handleNextFocusable,
        handlePreviousFocusable,
        handleNeutralNextFocusable,
        handleSelectOption,
        handleSetValue,
        state,
        inputRef
      }),
      [
        value,
        registerOption,
        unregisterOption,
        handleSetOptionsState,
        handleNextFocusable,
        handlePreviousFocusable,
        handleNeutralNextFocusable,
        handleSelectOption,
        handleSetValue,
        state,
        inputRef
      ]
    )

    useOutsideClick(internalRef, () => handleSetOptionsState(false))

    const TagName = as || __DEFAULT_COMBOBOX_TAG__
    return (
      <TagName role='Combobox' {...props} ref={mergedRef}>
        <ComboboxContext.Provider value={context}>
          {children}
        </ComboboxContext.Provider>
      </TagName>
    )
  }
)
const useRootValue = (component: string) => {
  const context = React.useContext(ComboboxContext)

  if (context === null) {
    throw new Error(
      `<Combobox.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 * ==============================
 * INPUT PROPS
 * ==============================
 */
type InputOwnProps = {
  openOnFocus?: boolean
  beforeTrigger?: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: string
}

type InputProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, InputOwnProps>

const __DEFAULT_INPUT_TAG__ = 'input'

type InputType = <C extends React.ElementType = typeof __DEFAULT_INPUT_TAG__>(
  props: InputProps<C>
) => React.ReactElement | null

const Input: InputType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_INPUT_TAG__>(
    { as, openOnFocus = true, defaultValue, ...props }: InputProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const {
      handleSetOptionsState,
      handleNeutralNextFocusable,
      handleSelectOption,
      inputRef,
      state
    } = useRootValue('Option')

    const mergedRef = mergeRefs([inputRef, ref])
    const defaultValueRef = React.useRef(false)

    const id = `dorai-ui-combobox-input-${GetId()}`

    const handleOnFocus = React.useCallback(() => {
      if (!openOnFocus) return
      handleSetOptionsState(true)
    }, [handleSetOptionsState, openOnFocus])

    React.useEffect(() => {
      if (!defaultValue?.length) {
        defaultValueRef.current = true
        return
      }

      if (!defaultValueRef.current) {
        const nodes = sortByDomNode(
          [...state.optionRefs],
          (opt) => opt.optRef.current
        )
        const index = nodes.findIndex((op) => op.textValue === defaultValue)

        if (index === -1) return

        handleSelectOption({
          id: nodes[index].id,
          textValue: nodes[index].textValue,
          value: nodes[index].value
        })

        defaultValueRef.current = true
      }
    }, [defaultValue, handleSelectOption, state.optionRefs])

    const handleNextFocusable = React.useCallback(() => {
      let nextFocuableTab = state.nextFocusableIndex

      if (state.selectedOption !== null) {
        const adjustedOptions = sortByDomNode(
          [...state.optionRefs],
          (opt) => opt.optRef.current
        )

        const nextIndex = adjustedOptions.findIndex(
          (op) => op.textValue === state.selectedOption?.textValue
        )

        nextFocuableTab = nextIndex
      }

      if (state.optionRefs.length - 1 === nextFocuableTab) {
        nextFocuableTab = 0
      } else {
        nextFocuableTab += 1
      }

      const focusedOption = state.optionRefs[nextFocuableTab]

      focusedOption.optRef.current?.focus()

      handleNeutralNextFocusable(nextFocuableTab)
    }, [
      handleNeutralNextFocusable,
      state.nextFocusableIndex,
      state.optionRefs,
      state.selectedOption
    ])

    const handlePreviousFocusable = React.useCallback(() => {
      let nextFocuableTab = state.nextFocusableIndex

      if (state.selectedOption !== null) {
        const adjustedOptions = sortByDomNode(
          [...state.optionRefs],
          (opt) => opt.optRef.current
        )

        const nextIndex = adjustedOptions.findIndex(
          (op) => op.textValue === state.selectedOption?.textValue
        )

        nextFocuableTab = nextIndex
      }

      if (nextFocuableTab - 1 < 0) {
        nextFocuableTab = state.optionRefs.length - 1
      } else {
        nextFocuableTab -= 1
      }

      const focusedOption = state.optionRefs[nextFocuableTab]

      focusedOption.optRef.current?.focus()

      handleNeutralNextFocusable(nextFocuableTab)
    }, [
      handleNeutralNextFocusable,
      state.nextFocusableIndex,
      state.optionRefs,
      state.selectedOption
    ])

    const handleOnArrowDown = React.useCallback(() => {
      if (state.optionRefs.length === 0) {
        return
      }
      inputRef.current?.blur()
      handleSetOptionsState(true)
      handleNextFocusable()
    }, [
      handleNextFocusable,
      handleSetOptionsState,
      inputRef,
      state.optionRefs.length
    ])

    const handleOnArrowUp = React.useCallback(() => {
      if (state.optionRefs.length === 0) {
        return
      }
      inputRef.current?.blur()
      handleSetOptionsState(true)
      handlePreviousFocusable()
    }, [
      handlePreviousFocusable,
      handleSetOptionsState,
      inputRef,
      state.optionRefs.length
    ])

    const eventTriggers: Record<
      string,
      (event: React.KeyboardEvent<HTMLElement>) => void
    > = {
      [KeyBoardKeys.ArrowDown]: handleOnArrowDown,
      [KeyBoardKeys.ArrowUp]: handleOnArrowUp,
      [KeyBoardKeys.Enter]: () => handleSetOptionsState(false)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
      const nextFocusTrigger = eventTriggers[event.key]
      if (!nextFocusTrigger) return
      nextFocusTrigger(event)
    }

    const handleEmptyInput = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (openOnFocus) {
          if (event.target.value === '') {
            return handleSetOptionsState(true)
          }
        } else {
          return handleSetOptionsState(false)
        }

        if (event.target.value.length > 0) {
          return handleSetOptionsState(true)
        }
      },
      [handleSetOptionsState, openOnFocus]
    )

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      handleEmptyInput(event)
      props.onChange(event)
    }

    const handledProps = {
      ...props,
      onChange: handleOnChange
    }

    const activedescendant = () => {
      if (!state.isOptionsOpen) return undefined

      return state.selectedOption ? state.selectedOption.id : undefined
    }

    const TagName = as || __DEFAULT_INPUT_TAG__

    return (
      <TagName
        id={id}
        type='text'
        role='Combobox'
        aria-autocomplete='list'
        aria-controls={id}
        onKeyDown={handleKeyPress}
        {...handledProps}
        onFocus={handleOnFocus}
        defaultValue={defaultValue ?? ''}
        aria-activedescendant={activedescendant()}
        ref={mergedRef}
      />
    )
  }
)

/**
 * ==============================
 * OPTIONS PROPS
 * ==============================
 */
type OptionsOwnProps = {
  children: React.ReactNode
}

type OptionsProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, OptionsOwnProps>

const __DEFAULT_OPTIONS_TAG__ = 'ul'

type OptionsType = <
  C extends React.ElementType = typeof __DEFAULT_OPTIONS_TAG__
>(
  props: OptionsProps<C>
) => React.ReactElement | null

const Options: OptionsType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_OPTIONS_TAG__>(
    { as, children, ...props }: OptionsProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const { state } = useRootValue('Option')

    const TagName = as || __DEFAULT_OPTIONS_TAG__

    return (
      <TagName
        role='listbox'
        aria-autocomplete='list'
        hidden={!state.isOptionsOpen ?? props.disabled}
        {...props}
        ref={ref}
      >
        {children}
      </TagName>
    )
  }
)

/**
 * ==============================
 * OPTION PROPS
 * ==============================
 */
type OptionOwnProps<TValue> = {
  children:
    | ((args: { active: boolean; selected: boolean }) => JSX.Element)
    | React.ReactNode
  value: TValue
  displayValue?: string
}

type OptionProps<
  C extends React.ElementType,
  TValue
> = Polymorphic.ComponentPropsWithRef<C, OptionOwnProps<TValue>>

const __DEFAULT_OPTION_TAG__ = 'li'

type OptionType = <
  TValue,
  C extends React.ElementType = typeof __DEFAULT_OPTION_TAG__
>(
  props: OptionProps<C, TValue>
) => React.ReactElement | null

const Option: OptionType = React.forwardRef(
  <
    C extends React.ElementType = typeof __DEFAULT_OPTION_TAG__,
    TValue = Parameters<typeof Root>[0]['value']
  >(
    { as, children, value, ...props }: OptionProps<C, TValue>,
    ref: Polymorphic.Ref<C>
  ) => {
    const internalRef = React.useRef<HTMLElement | null>(null)
    const mergedRef = mergeRefs([internalRef, ref])
    const {
      state,
      registerOption,
      unregisterOption,
      handleSetOptionsState,
      handleSetValue,
      handleSelectOption,
      handleNextFocusable,
      handlePreviousFocusable
    } = useRootValue('Option')
    const id = `dorai-ui-combobox-option-${GetId()}`

    React.useEffect(() => {
      if (!internalRef.current) return

      registerOption(
        id,
        internalRef,
        value,
        internalRef.current?.textContent?.toLowerCase() ?? ''
      )

      return () => {
        unregisterOption(id)
      }
    }, [id, registerOption, unregisterOption, value])

    React.useEffect(() => {
      if (!internalRef.current || !state.value) return
    }, [state.value])

    const handleClicks = callAll(
      props.onClick,
      () => handleSetOptionsState(false),
      () =>
        handleSelectOption({
          id,
          textValue: internalRef.current?.textContent?.toLowerCase() ?? '',
          value: value
        }),
      () =>
        handleSetValue(internalRef.current?.textContent?.toLowerCase() ?? '')
    )

    const eventTriggers: Record<
      string,
      (event: React.KeyboardEvent<HTMLElement>) => void
    > = {
      [KeyBoardKeys.ArrowDown]: handleNextFocusable,
      [KeyBoardKeys.ArrowUp]: handlePreviousFocusable,
      [KeyBoardKeys.Enter]: handleClicks
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
      event.preventDefault()
      const nextFocusTrigger = eventTriggers[event.key]

      if (!nextFocusTrigger) return

      nextFocusTrigger(event)
    }

    const propsHandled = {
      ...props,
      onClick: handleClicks
    }

    const TagName = as || __DEFAULT_OPTION_TAG__

    const selectedOption = state.selectedOption?.id === id

    const render = () => {
      if (typeof children === 'function') {
        return children({
          active: document.activeElement === internalRef.current,
          selected: selectedOption
        })
      }

      return children
    }

    return (
      <TagName
        role='option'
        id={id}
        {...propsHandled}
        ref={mergedRef}
        tabIndex={-1}
        onKeyDown={handleKeyPress}
        aria-selected={state.selectedOption?.id === id}
      >
        {render()}
      </TagName>
    )
  }
)

export const Combobox = Object.assign(Root, { Input, Options, Option })
