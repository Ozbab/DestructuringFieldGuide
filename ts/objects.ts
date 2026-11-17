// Oğuzhan Kaya, 2200004591
// The same six object forms as js/objects.mjs, now typed.

type Task = { id: string; title: string; status: 'todo' | 'in-progress' | 'done' }

// Form 5 (worked example from the starter)
const task: Task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5:', title, status) // form 5: Buy milk todo

type Barber = { name: string; chair: number }
type Appointment = {
  id: string
  customer: string
  service: 'Saç kesimi' | 'Sakal' | 'Saç + Sakal'
  price: number
  barber?: Barber
  extras: string[]
  paid?: boolean
}
const appointment: Appointment = {
  id: 'apt-0412',
  customer: 'Mert',
  service: 'Saç + Sakal',
  price: 450,
  barber: { name: 'Hakan', chair: 2 },
  extras: ['wash', 'wax'],
}

// Form 5, my own: the variables get the property types
let { customer, price } = appointment // customer: string, price: number
price = price + 50
console.log('form 5 (mine):', customer, price)

// Form 6: rename. The type follows the property, not the new name.
const { service: whatToDo, id: bookingCode } = appointment // whatToDo: 'Saç kesimi' | 'Sakal' | 'Saç + Sakal'
console.log('form 6:', whatToDo, bookingCode)

// Form 7: defaults on optional fields remove undefined from the type
const { paid = false, barber = { name: 'first free barber', chair: 0 } } = appointment
console.log('form 7:', paid, barber.name) // paid: boolean, barber: Barber

// Form 8: rest. The type of the rest is Omit<Appointment, 'id'>
const { id, ...withoutId } = appointment
const check: Omit<Appointment, 'id'> = withoutId
console.log('form 8:', id, Object.keys(check))

// Form 9: nested. The middle level is optional, so it needs a default (= {}) with the right type.
const {
  barber: { name: barberName = '?', chair = 0 } = {},
  extras: [firstExtra = 'none', ...moreExtras],
} = appointment
console.log('form 9:', barberName, chair, firstExtra, moreExtras)

// Form 10: computed key. With a Record the key type and the value type are known.
type Service = Appointment['service']
const prices: Record<Service, number> = { 'Saç kesimi': 300, Sakal: 150, 'Saç + Sakal': 450 }
const wanted: Service = 'Sakal'
const { [wanted]: beardPrice } = prices // number
console.log('form 10:', beardPrice)
// with a plain string key the value is number | undefined (noUncheckedIndexedAccess)
const loose: Record<string, number> = prices
const key: string = 'Boya'
const { [key]: maybe } = loose
console.log('form 10 (string key):', maybe ?? 'not offered')
