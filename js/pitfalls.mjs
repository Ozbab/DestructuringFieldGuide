// Oğuzhan Kaya, 2200004591
// Things that surprise people. Run with `node js/pitfalls.mjs`.

// Pitfall 1 (worked example from the starter): destructuring undefined or null throws a TypeError.
try {
  const { a } = undefined
  console.log(a)
} catch (error) {
  console.log('pitfall 1:', error.constructor.name) // pitfall 1: TypeError
}
// my version: a booking that the API did not find
function findBooking(code) {
  const db = { 'apt-1': { customer: 'Mert' } }
  return db[code] // undefined when not found
}
try {
  const { customer } = findBooking('apt-99')
  console.log(customer)
} catch (error) {
  console.log('pitfall 1 (mine):', error.message)
}
try {
  const [first] = null
  console.log(first)
} catch (error) {
  console.log('pitfall 1 (array, null):', error.message)
}

// Pitfall 2: a default only applies to undefined, not to null
const fromApi = { barber: null, minutes: undefined }
const { barber = 'any barber', minutes = 30 } = fromApi
console.log('pitfall 2:', barber, minutes)
// fix when null should also mean "missing": use ?? after the pattern
const barberFixed = fromApi.barber ?? 'any barber'
console.log('pitfall 2 (fix with ??):', barberFixed)

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
// The line `{ customer } = booking` is a SyntaxError (a block, then `= booking`),
// so the whole file would not even start. I show it with eval to keep this file running.
let customer
const booking = { customer: 'Selin' }
try {
  eval('{ customer } = booking')
} catch (error) {
  console.log('pitfall 3:', error.name + ':', error.message)
}
;({ customer } = booking)
console.log('pitfall 3 (with parentheses):', customer)

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const shop = { name: 'Kaya Berber', address: { district: 'Bakırköy' }, services: ['cut'] }
const { address, services, name } = shop
address.district = 'Ataköy' // changes shop.address too: same object
services.push('beard')
let shopName = name
shopName = 'Other' // a string is copied by value, shop.name stays
console.log('pitfall 4:', shop.address.district, shop.services, shop.name)
// the same with rest: rest is a new object, but its insides are shared
const { name: _n, ...copy } = shop
copy.address.district = 'Yeşilköy'
console.log('pitfall 4 (rest is shallow):', shop.address.district)

// Pitfall 5: in objects the order does not matter, in arrays it does
const visit = { customer: 'Deniz', service: 'Sakal' }
const { service: s1, customer: c1 } = visit
console.log('pitfall 5 (object, any order):', c1, s1)
const visitRow = ['Deniz', 'Sakal']
const [s2, c2] = visitRow // I wanted service first, but position 0 is the customer
console.log('pitfall 5 (array, wrong order):', 'service =', s2, '| customer =', c2)

// Pitfall 6 (extra): a line starting with [ glues to the line before when there is no semicolon
let x = 1, y = 2
const swapText = 'let x = 1, y = 2\nconst msg = "hi"\n[x, y] = [y, x]'
try {
  eval(swapText)
} catch (error) {
  console.log('pitfall 6:', error.name + ':', error.message)
}
;[x, y] = [y, x]
console.log('pitfall 6 (with ;):', x, y)
