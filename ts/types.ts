// Oğuzhan Kaya, 2200004591
// What only TypeScript adds (topics T1 to T5). See the handout.

// T1 (worked example from the starter): `{ a: string }` inside a pattern is a RENAME, not a type.
const point = { x: 1, y: 2 }
const { x: horizontal } = point // x is renamed to horizontal; there is no variable x
console.log('T1:', horizontal) // T1: 1

// T1, my own: I wanted "customer is a string". This compiles, but it is a rename:
// it makes a variable called `string` and no variable called `customer`.
function greetWrong({ customer: string }: { customer: string }) {
  return 'Hoş geldin ' + string
}
// The right way: the type goes AFTER the whole pattern.
function greetRight({ customer }: { customer: string }) {
  return 'Hoş geldin ' + customer
}
console.log('T1 wrong but runs:', greetWrong({ customer: 'Mert' }))
console.log('T1 right:', greetRight({ customer: 'Mert' }))

// T2: a tuple return type vs an array return type
function slotTuple(): [number, string] {
  return [10, 'Emre']
}
function slotArray() {
  return [10, 'Emre'] // inferred as (string | number)[]
}
const [tHour, tName] = slotTuple() // number, string
const [aHour, aName] = slotArray() // string | number | undefined, both
console.log('T2 tuple:', tHour + 1, tName.toUpperCase())
console.log('T2 array:', typeof aHour, typeof aName) // only typeof is safe here
// as const turns an array literal into a readonly tuple of literal types
const open = ['09:00', '21:00'] as const // readonly ['09:00', '21:00']
const [opens, closes] = open // opens: '09:00', closes: '21:00'
const notConst = ['09:00', '21:00'] // string[]
const [maybeOpens] = notConst // string | undefined
console.log('T2 as const:', opens, closes, '| without:', maybeOpens)

// T3: noUncheckedIndexedAccess. From string[] the first item is string | undefined.
const waitingList: string[] = []
const [first] = waitingList
// first.toUpperCase() would be: 'first' is possibly 'undefined'.
console.log('T3 check:', first === undefined ? 'nobody waiting' : first.toUpperCase())
const [firstOrDefault = 'nobody'] = waitingList // a default makes it string
console.log('T3 default:', firstOrDefault)
const [firstWithBang] = ['Emre'] as string[]
console.log('T3 non-null (!), only when I am sure:', firstWithBang!.length)

// T4: optional fields and defaults change the variable type
type Booking = { customer: string; note?: string; minutes?: number; barber: string | null }
const b: Booking = { customer: 'Selin', barber: null }
const { note, minutes = 30, barber = 'any' } = b
// note: string | undefined   (optional, no default)
// minutes: number            (optional, default removes undefined)
// barber: string | null      (a default does not remove null, because null is not undefined)
console.log('T4:', note, minutes, barber)

// T5: a compile error that destructuring causes.
// The parameter type says the whole object may be undefined, so the pattern cannot take it apart.
type Settings = { currency: string }
function priceLabel(amount: number, settings?: Settings) {
  // @ts-expect-error TS2339: Property 'currency' does not exist on type 'Settings | undefined'.
  const { currency } = settings
  return `${amount} ${currency}`
}
// The fix: a default for the whole parameter, so it is never undefined.
function priceLabelFixed(amount: number, { currency }: Settings = { currency: 'TL' }) {
  return `${amount} ${currency}`
}
console.log('T5 fixed:', priceLabelFixed(450), priceLabelFixed(30, { currency: 'EUR' }))
try {
  console.log(priceLabel(450))
} catch (e) {
  console.log('T5 at runtime the error is real:', (e as Error).message)
}
