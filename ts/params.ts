// Oğuzhan Kaya, 2200004591
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.

type TaskInput = { title: string; status?: 'todo' | 'done' }

// Form 11 (worked example from the starter): the type goes after the whole pattern.
function createTask({ title, status = 'todo' }: TaskInput) {
  return { title, status }
}
console.log('form 11:', createTask({ title: 'Read' })) // form 11: { title: 'Read', status: 'todo' }

// Form 11, my own: every field optional, so `= {}` is allowed as the default of the whole parameter
type BookingOptions = {
  customer?: string
  service?: string
  minutes?: number
  barber?: string
}
function book({ customer, service = 'Saç kesimi', minutes = 30, barber = 'any' }: BookingOptions = {}): string {
  // customer: string | undefined, service: string, minutes: number, barber: string
  return `${customer ?? 'nobody'} | ${service} | ${minutes} min | ${barber}`
}
console.log('form 11 (mine):', book({ customer: 'Deniz', minutes: 45 }))
console.log('form 11 (no argument):', book())

// Form 11b: array parameter with a tuple type
type Slot = [time: string, who: string | null]
const slots: Slot[] = [['10:00', 'Emre'], ['10:30', 'Burak'], ['11:00', null]]
const describe = ([time, who]: Slot): string => `${time} ${who ?? 'free'}`
console.log('form 11b:', slots.map(describe))

// Form 12: Object.entries gives [string, number][] for a Record<string, number>
const prices: Record<string, number> = { 'Saç kesimi': 300, Sakal: 150, 'Saç + Sakal': 450 }
for (const [service, price] of Object.entries(prices)) {
  console.log('form 12 (object):', service.padEnd(12), price.toFixed(0))
}
// a Map keeps both types: [number, string | null]
const chairs = new Map<number, string | null>([[1, 'Hakan'], [2, 'Murat'], [3, null]])
for (const [chair, barber] of chairs) {
  console.log('form 12 (Map):', chair, barber ?? '(empty chair)')
}
type Visit = { time: string; customer: { name: string } }
const today: Visit[] = [
  { time: '10:00', customer: { name: 'Emre' } },
  { time: '10:30', customer: { name: 'Burak' } },
]
for (const { time, customer: { name } } of today) {
  console.log('form 12 (nested):', time, name)
}
