// Oğuzhan Kaya, 2200004591
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.
// My data: appointments in a barber shop booking system.

// Form 5 (worked example from the starter): take properties out of an object by name.
const task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5:', title, status) // form 5: Buy milk todo

// Form 5, my own, with let so I can change the variables afterwards
const appointment = {
  id: 'apt-0412',
  customer: 'Mert',
  service: 'Saç + Sakal',
  price: 450,
  barber: { name: 'Hakan', chair: 2 },
  extras: ['wash', 'wax'],
}
let { customer, price } = appointment
price = price + 50 // changes the variable only
console.log('form 5 (mine):', customer, price, '| object still has', appointment.price)
// a name that is not on the object: undefined, no error
const { phone } = appointment
console.log('form 5 (missing):', phone)

// Form 6: rename while you take it, { title: heading }
const { service: whatToDo, id: bookingCode } = appointment
console.log('form 6:', whatToDo, bookingCode)
// the old name is not a variable: `service` does not exist here
console.log('form 6 (old name):', typeof service)

// Form 7: default values, { priority = 'normal' }
const walkIn = { customer: 'Selin', service: 'Saç kesimi' }
const { barber = 'first free barber', paid = false, price: fee = 300 } = walkIn
console.log('form 7:', barber, paid, fee)
// null is a value, so the default does NOT replace it
const { note = 'no note' } = { note: null }
console.log('form 7 (null):', note)
// the default is only evaluated when it is needed
let calls = 0
const nextNumber = () => ++calls
const { ticket = nextNumber() } = { ticket: 7 }
const { ticket: t2 = nextNumber() } = {}
console.log('form 7 (lazy default):', ticket, t2, 'calls =', calls)

// Form 8: rest, { id, ...others }
const { id, ...withoutId } = appointment
console.log('form 8:', id, Object.keys(withoutId))
// rest copies only the first level: the nested barber object is the SAME object
console.log('form 8 (shallow):', withoutId.barber === appointment.barber)
// rest is the same three dots as spread, but opposite job:
const again = { id, ...withoutId } // spread: put the fields back in
console.log('form 8 (spread back):', JSON.stringify(again) === JSON.stringify(appointment))

// Form 9: nested patterns, { owner: { name } } and arrays inside objects
const { barber: { name: barberName, chair }, extras: [firstExtra, ...moreExtras] } = appointment
console.log('form 9:', barberName, chair, firstExtra, moreExtras)
// `barber` here is only a path, not a variable (the `barber` variable above is from form 7)
// a missing middle level throws; a default on the middle level fixes it
try {
  const { barber: { name } } = walkIn
  console.log(name)
} catch (e) {
  console.log('form 9 (missing level):', e.message)
}
const { barber: { name: who = '?' } = {} } = walkIn
console.log('form 9 (with = {}):', who)

// Form 10: computed key, { [key]: value }
const prices = { 'Saç kesimi': 300, 'Sakal': 150, 'Saç + Sakal': 450 }
const wanted = 'Sakal'
const { [wanted]: beardPrice } = prices
console.log('form 10:', beardPrice)
// a computed key MUST be renamed: there is no way to know the variable name in advance
for (const s of ['Saç kesimi', 'Boya']) {
  const { [s]: p = 'not offered' } = prices
  console.log('form 10 (loop):', s, '->', p)
}
