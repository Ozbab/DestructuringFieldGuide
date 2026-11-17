// Oğuzhan Kaya, 2200004591
// Code that is WRONG on purpose. It is not part of `npm run check`.
// `npm run errors` type-checks only this file and prints the real compiler messages,
// which I copied into the JavaScript vs TypeScript table in README.md.
import type { ReactNode } from 'react'

type Appointment = { id: string; customer: string; price: number; barber?: { name: string } }
declare const appointment: Appointment
declare const queue: string[]

// E1 (form 1): returning an array where a tuple is promised
function minMax(n: number[]): [number, number] {
  return n
}

// E2 (form 2 / T3): using the second item without checking
const [, nextUp] = queue
nextUp.toUpperCase()

// E3 (form 3): swap between two different types
let count = 3
let label = 'three'
;[count, label] = [label, count]

// E4 (form 5): a name that is not a property
const { phone } = appointment

// E5 (form 6 / T1): trying to write a type inside the pattern
function greet({ customer: string }) {
  return string
}

// E6 (form 7): a default of the wrong type
const { price = 'free' } = appointment
const total: number = price

// E7 (form 9): nested pattern through an optional field, without a default
const { barber: { name } } = appointment

// E8 (form 10): computed key with a key that is not in the type
const key = 'phone'
const { [key]: value } = appointment

// E9 (form 11): destructuring a parameter that may be undefined
function book({ customer }: Appointment | undefined) {
  return customer
}

// E10 (form 12): Map entries with the wrong types in the loop
const chairs = new Map<number, string>([[1, 'Hakan']])
for (const [chair, barber] of chairs) {
  const chairLabel: string = chair
  console.log(chairLabel, barber)
}
// E10b: a type annotation is not allowed on the loop pattern at all
for (const [c, b]: [number, string] of chairs) {
  console.log(c, b)
}

// E11 (P7): children not in the props type
function Card({ title, children }: { title: string }) {
  return title
}

// E12 (form 8): reading a field after it was taken out by rest
const { id, ...rest } = appointment
rest.id

export { minMax, greet, total, name, value, book, Card, id }
export type { ReactNode }
