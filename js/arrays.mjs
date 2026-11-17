// Oğuzhan Kaya, 2200004591
// Array destructuring (forms 1 to 4). Plain JavaScript: run with `node js/arrays.mjs`.
// My data: the queue and the playlist of a small barber shop.

// Form 1 (worked example from the starter): take values out of an array by position.
function minMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1:', lowest, highest) // form 1: 2 9

// Form 1, my own: a function that returns two things, [busiest hour, how many customers].
function busiestHour(visits) {
  const counts = {}
  for (const v of visits) counts[v] = (counts[v] ?? 0) + 1
  let best = null
  for (const h in counts) if (best === null || counts[h] > counts[best]) best = h
  return [Number(best), counts[best]]
}
const [hour, customers] = busiestHour([10, 11, 11, 14, 11, 17, 14])
console.log('form 1 (mine):', hour, customers)
// The same as plain assignments:
const result1 = busiestHour([10, 11, 11, 14, 11, 17, 14])
const hourPlain = result1[0]
const customersPlain = result1[1]
console.log('form 1 (plain):', hourPlain, customersPlain)
// More names than items: the extra one is undefined, nothing throws.
const [h1, c1, extra] = busiestHour([9])
console.log('form 1 (extra name):', h1, c1, extra)

// Form 2: skip an item and collect the rest, [, second, ...others]
const queue = ['Emre', 'Burak', 'Selin', 'Mert', 'Deniz']
const [, nextUp, ...waiting] = queue // the first is in the chair already, skip him
console.log('form 2:', nextUp, waiting)
// plain: const nextUp = queue[1]; const waiting = queue.slice(2)
// rest makes a NEW array; the queue itself is not changed
console.log('form 2 (queue untouched):', queue.length, waiting === queue)
// rest on a short array is an empty array, never undefined
const [, onlySecond, ...nobody] = ['Emre']
console.log('form 2 (short):', onlySecond, nobody)
// two commas skip two items
const [, , third] = queue
console.log('form 2 (two holes):', third)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let chair1 = 'Emre'
let chair2 = 'Burak'
;[chair1, chair2] = [chair2, chair1] // leading ; because the line starts with [
console.log('form 3:', chair1, chair2)
// what it does: build a temporary array [chair2, chair1], then take it apart again
// three-way rotation works the same way
let a = 'cut', b = 'beard', c = 'wash'
;[a, b, c] = [c, a, b]
console.log('form 3 (rotate):', a, b, c)

// Form 4: default values, const [a = 1] = []
const [firstSong = 'silence', secondSong = 'silence'] = ['Barış Manço - Gülpembe']
console.log('form 4:', firstSong, '|', secondSong)
// a default fires only for undefined; null and '' are real values
const [d1 = 'default', d2 = 'default', d3 = 'default'] = [undefined, null, '']
console.log('form 4 (undefined/null/empty):', d1, d2, JSON.stringify(d3))
// an empty right side: everything takes its default
const [open = 9, close = 21] = []
console.log('form 4 (empty array):', open, close)
