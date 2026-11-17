// Oğuzhan Kaya, 2200004591
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11 (worked example from the starter): an options object in the parameter list, with defaults.
function createTask({ title, status = 'todo' } = {}) {
  return { title, status }
}
console.log('form 11:', createTask({ title: 'Read' })) // form 11: { title: 'Read', status: 'todo' }

// Form 11, my own: booking an appointment
function book({ customer, service = 'Saç kesimi', minutes = 30, barber = 'any' } = {}) {
  return `${customer ?? 'nobody'} | ${service} | ${minutes} min | ${barber}`
}
console.log('form 11 (mine):', book({ customer: 'Deniz', minutes: 45 }))
console.log('form 11 (no argument):', book()) // works because of `= {}`
console.log('form 11 (undefined field):', book({ customer: 'Ece', service: undefined }))
console.log('form 11 (null field):', book({ customer: 'Ece', service: null }))
// without `= {}` the call with no argument throws
function bookStrict({ customer }) {
  return customer
}
try {
  bookStrict()
} catch (e) {
  console.log('form 11 (no = {}):', e.message)
}

// Form 11b: the same idea with an array parameter, ([x, y]) => ...
const slots = [['10:00', 'Emre'], ['10:30', 'Burak'], ['11:00', null]]
const describe = ([time, who = 'free']) => `${time} ${who ?? 'free (null)'}`
console.log('form 11b:', slots.map(describe))

// Form 12: loops over entries, for (const [key, value] of Object.entries(obj)) and a Map
const prices = { 'Saç kesimi': 300, 'Sakal': 150, 'Saç + Sakal': 450 }
for (const [service, price] of Object.entries(prices)) {
  console.log('form 12 (object):', service.padEnd(12), price)
}
// plain version of one round: const entry = entries[i]; const service = entry[0]; const price = entry[1]

const chairs = new Map([[1, 'Hakan'], [2, 'Murat'], [3, null]])
for (const [chair, barber] of chairs) {
  console.log('form 12 (Map):', chair, barber ?? '(empty chair)')
}
// patterns can go deeper in a loop: array of objects
const today = [
  { time: '10:00', customer: { name: 'Emre' } },
  { time: '10:30', customer: { name: 'Burak' } },
]
for (const { time, customer: { name } } of today) {
  console.log('form 12 (nested):', time, name)
}
// index + value with entries() on an array
for (const [i, song] of ['Gülpembe', 'Arkadaşım Eşek'].entries()) {
  console.log('form 12 (array entries):', i, song)
}
