// Oğuzhan Kaya, 2200004591
// Bonus 2: experiments that go deeper. Run with `node bonus/depth.mjs`.

// ---------- D1: what does an array pattern call? ----------
// My guess before running: it reads value[0], value[1]. Wrong: it uses the iterator.
const spyQueue = {
  0: 'NOT USED',
  length: 1,
  [Symbol.iterator]() {
    let i = 0
    const names = ['Emre', 'Burak', 'Selin', 'Mert']
    return {
      next() {
        console.log('  D1 next() call', i + 1)
        return i < names.length ? { value: names[i++], done: false } : { value: undefined, done: true }
      },
      return() {
        console.log('  D1 return() called: the pattern stopped early')
        return { done: true }
      },
    }
  },
}
const [p1, p2] = spyQueue
console.log('D1 two names:', p1, p2)
const [, , ...rest] = spyQueue
console.log('D1 rest reads to the end:', rest)
// an array-like without an iterator does not work
try {
  const [x] = { 0: 'a', length: 1 }
  console.log(x)
} catch (e) {
  console.log('D1 array-like:', e.message)
}
// strings, Set, Map, generators: all iterables
const [firstLetter, ...letters] = 'Çağrı'
console.log('D1 string:', firstLetter, letters)
const [emoji] = '💈 berber'
console.log('D1 emoji is one item (code point, not UTF-16 unit):', emoji, '| [0] gives:', JSON.stringify('💈'[0]))
const [s1, s2] = new Set(['cut', 'cut', 'beard'])
console.log('D1 Set (duplicates gone):', s1, s2)
const [[k1, v1]] = new Map([['Hakan', 2]])
console.log('D1 Map, nested pattern:', k1, v1)
function* ticketNumbers() {
  let n = 100
  while (true) {
    console.log('  D1 generator gives', n)
    yield n++
  }
}
const [t1, t2] = ticketNumbers() // infinite generator, but only two are taken
console.log('D1 infinite generator, two taken:', t1, t2)
// an object pattern does NOT use the iterator: it reads properties
const { length, 0: zero } = 'Kaya'
console.log('D1 object pattern on a string:', length, zero)

// ---------- D2: order of evaluation ----------
const log = []
const note = (msg, value) => (log.push(msg), value)
const {
  a = note('default a', 1),
  b = note('default b', a + 10), // uses a from the SAME pattern
  [note('key c', 'c')]: c = note('default c', 3),
} = { a: undefined, b: 5 }
console.log('D2 values:', a, b, c, '| order:', log.join(' -> '))
// a default cannot use a LATER variable
try {
  eval('const { early = later, later = 1 } = {}')
} catch (e) {
  console.log('D2 later variable:', e.name + ':', e.message)
}
// getters run once each, from left to right
const booking = {
  get customer() {
    console.log('  D2 getter customer')
    return 'Mert'
  },
  get price() {
    console.log('  D2 getter price')
    return 450
  },
}
const { price, customer } = booking // pattern order decides, not object order
console.log('D2 getters:', customer, price)

// ---------- D3: other places ----------
try {
  JSON.parse('{ broken json')
} catch ({ name, message }) {
  console.log('D3 catch pattern:', name, '|', message.split('\n')[0])
}
// assignment targets can be any reference, not only variables
const chairs = {}
const names = []
;[chairs.left, chairs.right, names[3]] = ['Hakan', 'Murat', 'Ali']
console.log('D3 member targets:', chairs, names)
;({ a: chairs.top, b: names[0] } = { a: 'Usta', b: 'Çırak' })
console.log('D3 object pattern into members:', chairs.top, names[0])
// for...in gives keys as strings, for...of with entries gives pairs
const prices = { cut: 300, beard: 150 }
for (const key in prices) console.log('D3 for...in key:', key, typeof key)
for (const [key, value] of Object.entries(prices)) console.log('D3 for...of pair:', key, value)
// for...in with a pattern: it destructures the KEY STRING
for (const [firstChar] in prices) console.log('D3 for...in with [first]:', firstChar)
// import is not destructuring: renames use `as`, not a colon
const mod = await import('node:path')
const { basename: base } = mod // this is destructuring of the module namespace object
console.log('D3 namespace object:', base('/shop/receipt.txt'), Object.isFrozen(mod))

// ---------- D4: readability, a pattern that went too far ----------
const response = { data: { shop: { owner: { contact: { phones: ['0212 000 00 00'] } } } } }
const { data: { shop: { owner: { contact: { phones: [mainPhone] } } } } } = response
console.log('D4 deep pattern:', mainPhone)
// the same with optional chaining: shorter, and it does not throw on a missing level
const mainPhone2 = response.data?.shop?.owner?.contact?.phones?.[0] ?? 'no phone'
console.log('D4 optional chaining:', mainPhone2)
const empty = { data: {} }
try {
  const { data: { shop: { owner } } } = empty
  console.log(owner)
} catch (e) {
  console.log('D4 deep pattern on missing data:', e.message)
}
console.log('D4 optional chaining on missing data:', empty.data?.shop?.owner?.contact?.phones?.[0] ?? 'no phone')
