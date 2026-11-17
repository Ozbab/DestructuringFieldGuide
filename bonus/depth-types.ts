// Oğuzhan Kaya, 2200004591
// Bonus 2, D5: taking TYPES apart in the same spirit as destructuring values.
// Run with `npx tsx bonus/depth-types.ts`. The interesting part is checked by `npm run check`.

type Slot = [time: string, barber: string, minutes: number]

// First<T> is like const [first] = t
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never
// Rest<T> is like const [, ...rest] = t
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : never
// Field<T, K> is like const { [k]: value } = t
type Field<T, K extends keyof T> = T[K]
// Without<T, K> is like const { k, ...others } = t
type Without<T, K extends keyof T> = Omit<T, K>

type SlotTime = First<Slot> // string
type SlotRest = Rest<Slot> // [barber: string, minutes: number]
type NothingFirst = First<[]> // never

// The compiler proves these. If one is wrong, `npm run check` fails.
type Equal<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2 ? true : false
const proofs: [Equal<SlotTime, string>, Equal<SlotRest, [string, number]>, Equal<NothingFirst, never>] = [
  true,
  true,
  true,
]

// Parameters<F> turns a function's parameter list into a tuple, so I can destructure it.
function book(customer: string, service: 'cut' | 'beard', minutes = 30) {
  return `${customer} ${service} ${minutes}`
}
type BookArgs = Parameters<typeof book> // [customer: string, service: 'cut' | 'beard', minutes?: number]
const args: BookArgs = ['Deniz', 'beard']
const [who, what, howLong = 30] = args
console.log('D5 Parameters:', who, what, howLong, '->', book(...args))

type Appointment = { id: string; customer: string; price: number }
const price: Field<Appointment, 'price'> = 450
const noId: Without<Appointment, 'id'> = { customer: 'Mert', price }
console.log('D5 Field and Without:', noId, proofs)

// A generic function keeps the exact tuple type through the pattern.
function swap<A, B>([a, b]: readonly [A, B]): [B, A] {
  return [b, a]
}
const [n, s] = swap(['Hakan', 2] as const) // n: 2, s: 'Hakan'
console.log('D5 generic swap:', n, s)
