// Oğuzhan Kaya, 2200004591
// Props code that is WRONG on purpose, for P7. Checked only by `npm run errors`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

type NoteProps = { tone: 'info' | 'warn'; children?: ReactNode }
function Note({ tone, children }: NoteProps) {
  return <p className={tone}>{children}</p>
}
function Bare({ tone }: { tone: string }) {
  return <p>{tone}</p>
}
function Note2({ tone, children }: PropsWithChildren<{ tone: 'info' | 'warn' }>) {
  return <p className={tone}>{children}</p>
}
function Book(props: ComponentProps<'button'>) {
  return <button {...props} />
}
function Strict({ children }: { children: string }) {
  return <b>{children}</b>
}

export const wrong = [
  // P7-1: a plain object is not a ReactNode
  <Note tone="info">{{ name: 'Hakan' }}</Note>,
  // P7-2: a component without children in its type does not accept content
  <Bare tone="x">Hakan</Bare>,
  // P7-3: tone is a union, 'error' is not in it
  <Note2 tone="error">x</Note2>,
  // P7-4: ComponentProps<'button'> knows the real attributes, and their types
  <Book type="link">x</Book>,
  <Book onClick="go()">x</Book>,
  // P7-5: children is required and must be a string
  <Strict />,
  <Strict><i>Hakan</i></Strict>,
  // P7-6: a function as children where ReactNode is expected
  <Note tone="info">{() => 'hi'}</Note>,
]
