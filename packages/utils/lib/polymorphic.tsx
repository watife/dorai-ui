type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<unknown>
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>

type AsProp<C extends React.ElementType> = {
  as?: C
}

type ExtendableProps<
  ExtendedProps = Record<string, unknown>,
  OverrideProps = Record<string, unknown>
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>

type InheritableElementProps<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = ExtendableProps<PropsOf<C>, Props>

type ComponentProps<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = InheritableElementProps<C, Props & AsProp<C>>

type Ref<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

type ComponentPropsWithRef<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = ComponentProps<C, Props> & { ref?: Ref<C> }

export type { ComponentPropsWithRef, ComponentProps, Ref }
