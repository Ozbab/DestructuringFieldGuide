# Destructuring Field Guide

Name: Oğuzhan Kaya  
Student number: 2200004591  
Course: SEN0415 Advanced Web Programming, Fall 2026, Assignment 4

Bonuses claimed: **Bonus 1: LaTeX**, **Bonus 2: Depth**, **Bonus 3: Real code**, **Bonus 4: Git repository**
(each one has its own section at the end).

All my examples use the same small world: a barber shop with a booking system
(appointments, a waiting queue, chairs, barbers, a price list, the shop playlist).
Every output below is copied from `output.txt`, which is the real output of `npm run all`.

## Run

```
npm install
npm run all      # runs the JS and TS examples and the Bonus 2 experiments
npm run check    # type-checks everything in strict mode (no any, no @ts-ignore)
npm run errors   # type-checks only errors/, the code that is wrong ON PURPOSE
npm run all > output.txt
```

Verified on 17 November 2026 with Node.js 24.15.0, npm 11.12.1 and TypeScript 5.8.3.
The project requires Node.js 20.19 or newer. `package-lock.json` records the dependency versions;
`npm ci` reproduces those versions exactly. `npm run check` prints nothing after the header, which means 0 errors.
The only suppression in the project is one `// @ts-expect-error` in `ts/types.ts` (topic T5).

The folder `errors/` is not part of `npm run check`. It has the wrong versions of my examples,
and `npm run errors` prints the real compiler messages that I used in the JS vs TS table and in P7.

## One idea before the forms

A pattern is only a short way to write one assignment per variable.
When I am not sure what a pattern does, I write it out like this:

```js
const [, nextUp, ...waiting] = queue
// is the same as
const nextUp = queue[1]
const waiting = queue.slice(2)
```

(For arrays this is not 100% true: the real thing uses the iterator, not `[1]`. See Bonus 2, D1.)

Rest and spread both use `...` but do opposite jobs:

- **rest** is on the LEFT, inside a pattern: `const [first, ...others] = list`. It *collects* what is left into a NEW array or object.
- **spread** is on the RIGHT, inside an expression: `[...list]`, `{ ...task }`, `<section {...rest}>`. It *expands* an array or object into separate items or fields.

---

## Field guide

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [hour, customers] = busiestHour(visits)`

**Example** (from `js/arrays.mjs`):

```js
function busiestHour(visits) {
  // ... counts the visits per hour
  return [Number(best), counts[best]]
}
const [hour, customers] = busiestHour([10, 11, 11, 14, 11, 17, 14])
console.log('form 1 (mine):', hour, customers)
const [h1, c1, extra] = busiestHour([9])
console.log('form 1 (extra name):', h1, c1, extra)
```

**Output:**

```
form 1 (mine): 11 3
form 1 (plain): 11 3
form 1 (extra name): 9 1 undefined
```

The plain version (`result1[0]`, `result1[1]`) prints the same line.

**Use it when:** a function gives back a small, fixed number of values whose meaning comes from their place
(like `useState` and `useReducer`: `[value, setter]`). The caller can choose the names.

**Watch out:** the names mean nothing to JavaScript, only the position does. If I write
`const [customers, hour]` I get the numbers the wrong way round and nothing warns me.
A name with no item is just `undefined`, no error. In TypeScript, give the function a tuple
return type (`[number, number]`), otherwise both variables get the union type (see T2).

### Form 2: skip an item and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, nextUp, ...waiting] = queue`

**Example** (from `js/arrays.mjs`):

```js
const queue = ['Emre', 'Burak', 'Selin', 'Mert', 'Deniz']
const [, nextUp, ...waiting] = queue // the first is in the chair already
console.log('form 2:', nextUp, waiting)
console.log('form 2 (queue untouched):', queue.length, waiting === queue)
const [, onlySecond, ...nobody] = ['Emre']
console.log('form 2 (short):', onlySecond, nobody)
const [, , third] = queue
console.log('form 2 (two holes):', third)
```

**Output:**

```
form 2: Burak [ 'Selin', 'Mert', 'Deniz' ]
form 2 (queue untouched): 5 false
form 2 (short): undefined []
form 2 (two holes): Selin
```

**Use it when:** I care about the first few items by position and want "everything after" as its own list,
for example the customer in the chair, the next one, and the waiting people.

**Watch out:** the empty place before the comma is easy to miss when reading. `[, , third]` is hard to read,
for more than one hole I would write `queue[2]`. The rest is always an array (empty `[]` if nothing is left,
never `undefined`), it is a new array (`waiting === queue` is `false`), and it must be the last item:
`[...waiting, last]` is a SyntaxError.

### Form 3: swap two variables, `[a, b] = [b, a]`

**Syntax:** `;[chair1, chair2] = [chair2, chair1]`

**Example** (from `js/arrays.mjs`):

```js
let chair1 = 'Emre'
let chair2 = 'Burak'
;[chair1, chair2] = [chair2, chair1]
console.log('form 3:', chair1, chair2)
let a = 'cut', b = 'beard', c = 'wash'
;[a, b, c] = [c, a, b]
console.log('form 3 (rotate):', a, b, c)
```

**Output:**

```
form 3: Burak Emre
form 3 (rotate): wash cut beard
```

**Use it when:** two (or three) variables must exchange values, for example two customers swap chairs.

**Watch out:** this is an assignment, not a declaration, so the variables must be `let`.
The right side is built FIRST (a temporary array `['Burak', 'Emre']`), then taken apart, so no value is lost.
The line starts with `[`, so without semicolons it can glue to the line above. I start it with `;`
(see pitfall 6 for what happened when I forgot it).

### Form 4: default values in an array, `const [a = 1, b = 2] = []`

**Syntax:** `const [firstSong = 'silence', secondSong = 'silence'] = playlist`

**Example** (from `js/arrays.mjs`):

```js
const [firstSong = 'silence', secondSong = 'silence'] = ['Barış Manço - Gülpembe']
console.log('form 4:', firstSong, '|', secondSong)
const [d1 = 'default', d2 = 'default', d3 = 'default'] = [undefined, null, '']
console.log('form 4 (undefined/null/empty):', d1, d2, JSON.stringify(d3))
const [open = 9, close = 21] = []
console.log('form 4 (empty array):', open, close)
```

**Output:**

```
form 4: Barış Manço - Gülpembe | silence
form 4 (undefined/null/empty): default null ""
form 4 (empty array): 9 21
```

**Use it when:** the array can be shorter than I need and there is a sensible value for a missing item.

**Watch out:** the default is used ONLY when the item is `undefined` (missing, or really `undefined`).
`null`, `''`, `0` and `false` are real values and stay. Plain version:
`const d2 = list[1] === undefined ? 'default' : list[1]`, not `list[1] || 'default'`.

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `let { customer, price } = appointment`

**Example** (from `js/objects.mjs`):

```js
const appointment = {
  id: 'apt-0412', customer: 'Mert', service: 'Saç + Sakal', price: 450,
  barber: { name: 'Hakan', chair: 2 }, extras: ['wash', 'wax'],
}
let { customer, price } = appointment
price = price + 50 // changes the variable only
console.log('form 5 (mine):', customer, price, '| object still has', appointment.price)
const { phone } = appointment
console.log('form 5 (missing):', phone)
```

**Output:**

```
form 5 (mine): Mert 500 | object still has 450
form 5 (missing): undefined
```

**Use it when:** I need a few fields of an object many times and `appointment.` everywhere is noise.

**Watch out:** the variable name must be the property name exactly (`Customer` is a different name).
A wrong or missing name gives `undefined` silently in JS (TypeScript catches it, see the table).
`let` makes new variables: changing `price` does not change `appointment.price`.

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { service: whatToDo, id: bookingCode } = appointment`

**Example** (from `js/objects.mjs`):

```js
const { service: whatToDo, id: bookingCode } = appointment
console.log('form 6:', whatToDo, bookingCode)
console.log('form 6 (old name):', typeof service)
```

**Output:**

```
form 6: Saç + Sakal apt-0412
form 6 (old name): undefined
```

**Use it when:** the property name is not clear in this place (`id` → `bookingCode`), or it clashes
with a variable I already have.

**Watch out:** the left side of the colon is where it comes FROM, the right side is the NEW variable.
`service` does not exist after this line (`typeof service` is `'undefined'`). In TypeScript this is the
reason `{ customer: string }` inside a pattern is a rename and not a type (T1).

### Form 7: default values in an object, `const { a = 1 } = t`

**Syntax:** `const { barber = 'first free barber', paid = false, price: fee = 300 } = walkIn`

**Example** (from `js/objects.mjs`):

```js
const walkIn = { customer: 'Selin', service: 'Saç kesimi' }
const { barber = 'first free barber', paid = false, price: fee = 300 } = walkIn
console.log('form 7:', barber, paid, fee)
const { note = 'no note' } = { note: null }
console.log('form 7 (null):', note)
let calls = 0
const nextNumber = () => ++calls
const { ticket = nextNumber() } = { ticket: 7 }
const { ticket: t2 = nextNumber() } = {}
console.log('form 7 (lazy default):', ticket, t2, 'calls =', calls)
```

**Output:**

```
form 7: first free barber false 300
form 7 (null): null
form 7 (lazy default): 7 1 calls = 1
```

**Use it when:** an object comes from outside (a form, an API, options) and some fields may be missing.

**Watch out:** same rule as form 4: only `undefined` triggers the default, `null` stays `null`.
Rename and default together is `price: fee = 300` (rename first, then `=`).
The default is an expression that runs only when it is needed: `nextNumber()` ran once, not twice.

### Form 8: rest in an object, `const { a, ...others } = t`

**Syntax:** `const { id, ...withoutId } = appointment`

**Example** (from `js/objects.mjs`):

```js
const { id, ...withoutId } = appointment
console.log('form 8:', id, Object.keys(withoutId))
console.log('form 8 (shallow):', withoutId.barber === appointment.barber)
const again = { id, ...withoutId } // spread: put the fields back in
console.log('form 8 (spread back):', JSON.stringify(again) === JSON.stringify(appointment))
```

**Output:**

```
form 8: apt-0412 [ 'customer', 'service', 'price', 'barber', 'extras' ]
form 8 (shallow): true
form 8 (spread back): true
```

**Use it when:** I want to remove a few fields and keep the rest together, for example take `id` out before
sending an object to a form, or take `title` and `children` out of props and pass the rest to a DOM element (P4).

**Watch out:** the rest object is new, but it is a SHALLOW copy: `withoutId.barber` is the same object as
`appointment.barber` (pitfall 4). Rest must be last, and there can be only one.
Rest collects; the `...withoutId` in `{ id, ...withoutId }` on the right side is spread and puts them back.

### Form 9: nested patterns and arrays inside objects, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { barber: { name: barberName, chair }, extras: [firstExtra, ...moreExtras] } = appointment`

**Example** (from `js/objects.mjs`):

```js
const { barber: { name: barberName, chair }, extras: [firstExtra, ...moreExtras] } = appointment
console.log('form 9:', barberName, chair, firstExtra, moreExtras)
try {
  const { barber: { name } } = walkIn // walkIn has no barber
} catch (e) {
  console.log('form 9 (missing level):', e.message)
}
const { barber: { name: who = '?' } = {} } = walkIn
console.log('form 9 (with = {}):', who)
```

**Output:**

```
form 9: Hakan 2 wash [ 'wax' ]
form 9 (missing level): Cannot read properties of undefined (reading 'name')
form 9 (with = {}): ?
```

Plain version: `const barberName = appointment.barber.name; const firstExtra = appointment.extras[0]`.

**Use it when:** the shape of the data is known and stable, and I need one or two values from deep inside.

**Watch out:** `barber:` in a nested pattern is only a PATH, it does not create a `barber` variable.
If a middle level is missing the whole line throws. The fix is a default for the middle level: `barber: { ... } = {}`.
Two or more levels get hard to read quickly (Bonus 2, D4).

### Form 10: a computed key, `const { [key]: value } = t`

**Syntax:** `const { [wanted]: beardPrice } = prices`

**Example** (from `js/objects.mjs`):

```js
const prices = { 'Saç kesimi': 300, 'Sakal': 150, 'Saç + Sakal': 450 }
const wanted = 'Sakal'
const { [wanted]: beardPrice } = prices
console.log('form 10:', beardPrice)
for (const s of ['Saç kesimi', 'Boya']) {
  const { [s]: p = 'not offered' } = prices
  console.log('form 10 (loop):', s, '->', p)
}
```

**Output:**

```
form 10: 150
form 10 (loop): Saç kesimi -> 300
form 10 (loop): Boya -> not offered
```

**Use it when:** the key is only known at run time (user input, a loop), and especially when the key
is not a valid variable name (`'Saç + Sakal'` has spaces and a `+`).

**Watch out:** the rename is not optional here: `const { [wanted] } = prices` is a SyntaxError, because
JavaScript cannot know the variable name in advance. Plain version: `const beardPrice = prices[wanted]`,
which is honestly shorter; I would use form 10 mainly when it is combined with a default or with rest.

### Form 11: patterns in parameters, with defaults, `function f({ a = 1, b }: Options = {})`

**Syntax:** `function book({ customer, service = 'Saç kesimi', minutes = 30, barber = 'any' } = {})`

**Example** (from `js/params.mjs`):

```js
function book({ customer, service = 'Saç kesimi', minutes = 30, barber = 'any' } = {}) {
  return `${customer ?? 'nobody'} | ${service} | ${minutes} min | ${barber}`
}
console.log('form 11 (mine):', book({ customer: 'Deniz', minutes: 45 }))
console.log('form 11 (no argument):', book())
console.log('form 11 (null field):', book({ customer: 'Ece', service: null }))
function bookStrict({ customer }) { return customer }
try { bookStrict() } catch (e) { console.log('form 11 (no = {}):', e.message) }
```

**Output:**

```
form 11 (mine): Deniz | Saç kesimi | 45 min | any
form 11 (no argument): nobody | Saç kesimi | 30 min | any
form 11 (null field): Ece | null | 30 min | any
form 11 (no = {}): Cannot destructure property 'customer' of 'undefined' as it is undefined.
```

There is also an array version, `const describe = ([time, who = 'free']) => ...`, used with `slots.map(describe)`:
`form 11b: [ '10:00 Emre', '10:30 Burak', '11:00 free (null)' ]`.

**Use it when:** a function has several options, most of them optional. The caller names them
(`book({ minutes: 45 })`) so the order does not matter, and the defaults are visible in the signature.
Every React component with `({ title, children })` is this form.

**Watch out:** there are two different defaults. `minutes = 30` is for a missing FIELD;
the `= {}` at the end is for a missing ARGUMENT. Without `= {}`, calling with no argument throws.
In TypeScript the type goes after the whole pattern: `({ customer }: BookingOptions = {})`.

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))` and Map entries

**Syntax:** `for (const [service, price] of Object.entries(prices))`

**Example** (from `js/params.mjs`):

```js
for (const [service, price] of Object.entries(prices)) {
  console.log('form 12 (object):', service.padEnd(12), price)
}
const chairs = new Map([[1, 'Hakan'], [2, 'Murat'], [3, null]])
for (const [chair, barber] of chairs) {
  console.log('form 12 (Map):', chair, barber ?? '(empty chair)')
}
for (const { time, customer: { name } } of today) {
  console.log('form 12 (nested):', time, name)
}
```

**Output:**

```
form 12 (object): Saç kesimi   300
form 12 (object): Sakal        150
form 12 (object): Saç + Sakal  450
form 12 (Map): 1 Hakan
form 12 (Map): 2 Murat
form 12 (Map): 3 (empty chair)
form 12 (nested): 10:00 Emre
form 12 (nested): 10:30 Burak
```

**Use it when:** I loop over pairs (`Object.entries`, a `Map`, `array.entries()` for index and value) or
over a list of objects where I only need some fields.

**Watch out:** an object is not iterable, so `for (const [k, v] of prices)` fails; I need `Object.entries(prices)`.
A `Map` IS iterable and gives `[key, value]` pairs directly. The pattern runs again on every round, with a new `const`.
In TypeScript I cannot put a type on the loop pattern (`TS2483`, see the table); the type comes from the Map or the array.

---

## Pitfalls

All from `js/pitfalls.mjs`.

**Pitfall 1: destructuring `undefined` or `null` throws.**

```js
function findBooking(code) { const db = { 'apt-1': { customer: 'Mert' } }; return db[code] }
const { customer } = findBooking('apt-99')
const [first] = null
```

```
pitfall 1: TypeError
pitfall 1 (mine): Cannot destructure property 'customer' of 'findBooking(...)' as it is undefined.
pitfall 1 (array, null): null is not iterable
```

*Why:* a pattern has to read properties (or call the iterator) of the value, and `undefined` and `null` have no properties at all.
The error for arrays is different ("not iterable") because the array pattern asks for the iterator first.

**Pitfall 2: a default works for `undefined` but not for `null`.**

```js
const fromApi = { barber: null, minutes: undefined }
const { barber = 'any barber', minutes = 30 } = fromApi
const barberFixed = fromApi.barber ?? 'any barber'
```

```
pitfall 2: null 30
pitfall 2 (fix with ??): any barber
```

*Why:* the default is checked with `=== undefined`; an API that sends `null` for "no barber" is sending a real value.
If null should also mean missing, use `??` after the pattern.

**Pitfall 3: assignment to existing variables needs parentheses.**

```js
let customer
eval('{ customer } = booking')   // in eval only so that the file still runs
;({ customer } = booking)
```

```
pitfall 3: SyntaxError: Unexpected token '='
pitfall 3 (with parentheses): Selin
```

*Why:* at the start of a statement `{` opens a BLOCK, so `{ customer }` is a block with an expression in it, and then `= booking` makes no sense.
The parentheses force JavaScript to read it as an expression. (A `const`/`let` declaration does not have this problem.)

**Pitfall 4: it copies references, not deep copies.**

```js
const shop = { name: 'Kaya Berber', address: { district: 'Bakırköy' }, services: ['cut'] }
const { address, services, name } = shop
address.district = 'Ataköy'
services.push('beard')
let shopName = name
shopName = 'Other'
const { name: _n, ...copy } = shop
copy.address.district = 'Yeşilköy'
```

```
pitfall 4: Ataköy [ 'cut', 'beard' ] Kaya Berber
pitfall 4 (rest is shallow): Yeşilköy
```

*Why:* destructuring is only `const address = shop.address`, which copies the reference to the same object, not the object.
Strings are primitives, so `shopName` really is a copy. Even rest only makes a new object at the first level.

**Pitfall 5: order does not matter in objects, it does in arrays.**

```js
const { service: s1, customer: c1 } = { customer: 'Deniz', service: 'Sakal' }
const [s2, c2] = ['Deniz', 'Sakal'] // I wanted service first
```

```
pitfall 5 (object, any order): Deniz Sakal
pitfall 5 (array, wrong order): service = Deniz | customer = Sakal
```

*Why:* an object pattern matches by NAME and an array pattern matches by POSITION; my variable names do not mean anything to the array pattern.

**Pitfall 6 (extra): a swap line without `;` glues to the line before.**

```js
const msg = "hi"
[x, y] = [y, x]
```

```
pitfall 6: TypeError: Cannot create property '2' on string 'hi'
pitfall 6 (with ;): 2 1
```

*Why:* without a semicolon JavaScript reads it as `"hi"[x, y] = [y, x]`. The comma operator gives `y` (2), so it tries to set
property `2` on a string, which is not allowed in strict mode (ES modules are always strict). That is why the swap line starts with `;`.

---

## Props and children

Code: `js/props.jsx` (runs with `tsx`) and `ts/props.tsx`. Rendered with `renderToStaticMarkup`.
React prints its warnings with `console.error`, which goes to stderr and would be missing from `output.txt`,
so at the top of `js/props.jsx` I replace `console.error` with a function that prints `[react warning]` and the first line to stdout.

### P1: props is one object

```jsx
function CardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
function Spy(props) {
  console.log('P1 spy, the one argument:', props, '| frozen:', Object.isFrozen(props))
  return null
}
html(<Spy service="Sakal" price={150}>Hakan</Spy>)
console.log('P1 jsx():', html(jsx(CardB, { title: 'Hi', children: 'text' })))
```

```
P1 A: <section><h2>Hi</h2>text</section>
P1 B: <section><h2>Hi</h2>text</section>
P1 spy, the one argument: { service: 'Sakal', price: 150, children: 'Hakan' } | frozen: true
P1 jsx(): <section><h2>Hi</h2>text</section>
```

A component is a function with ONE parameter. The attributes and the content between the tags all arrive in this one object
(`Spy` shows it: `children: 'Hakan'` sits next to `service` and `price`). JSX is just a call: `<CardB title="Hi">text</CardB>`
becomes `jsx(CardB, { title: 'Hi', children: 'text' })`, and calling `jsx` by hand gives the same HTML.

`CardB` is **form 11 + form 5**: a pattern in the parameter list (form 11) that takes properties by name (form 5).
The plain version is exactly `CardA`: `const title = props.title; const children = props.children`.
The object is frozen, which matters for the "change props" experiment below.

### P2: children is only a prop

```jsx
function Badge({ children }) { return <span className="badge">{children}</span> }
<Badge>VIP</Badge>
<Badge children="VIP" />
<Badge children="from attribute">from tags</Badge>
<Badge />
```

```
P2 between tags: <span class="badge">VIP</span>
P2 as attribute: <span class="badge">VIP</span>
P2 both: <span class="badge">from tags</span>
P2 missing: <span class="badge"></span>
```

Content between the tags is only a shorter way to write the `children` attribute; the component cannot tell the difference.
When both are given, the content between the tags wins (the JSX compiler writes `children` after the attributes, so it
overwrites the attribute). With no content the variable is `undefined` and nothing is rendered.

### P3: what children can be

```
P3 string: <div>[Saç kesimi]</div>
P3 number: <div>[450]</div>
P3 zero: <div>[0]</div>
P3 one element: <div>[<b>Hakan</b>]</div>
P3 several elements: <div>[<b>Hakan</b><i>Murat</i>]</div>
  [react warning] Each child in a list should have a unique "key" prop.
P3 array without keys: <div>[<b>Hakan</b><b>Murat</b>]</div>
P3 undefined: <div>[]</div>
P3 null: <div>[]</div>
P3 false: <div>[]</div>
P3 true: <div>[]</div>
P3 empty string: <div>[]</div>
P3 NaN: <div>[NaN]</div>
  [react warning] Functions are not valid as a React child. This may happen if you return children instead of <children /> from render. Or maybe you meant to call this function rather than return it.
P3 a function: <div>[]</div>
P3 an object: THROWS Error: Objects are not valid as a React child (found: object with keys {name}). If you meant to render a collection of children, use an array instead.
P3 typeof: <p>string</p> <p>array of 2</p> <p>array of 3</p>
P3 function called: <ul><li>10:00</li><li>11:30</li></ul>
```

| children is | what appears |
|---|---|
| string, number | the text. `0` and `NaN` DO appear (so `{count && <b/>}` can print a `0`) |
| one element | the element |
| several elements | all of them; inside the component `children` is an ARRAY (`array of 2`) |
| an array from `.map` | rendered, but React warns about missing `key` (the static `<b/><i/>` did not warn) |
| `undefined`, `null`, `false`, `true`, `''` | nothing at all |
| a function | nothing, plus a warning; it is only useful when the component CALLS it (`children(free)`, a render prop) |
| a plain object | an error, the whole render stops |

`a{1}b` is three children (`array of 3`): text, number, text. So `children` can be a single value or an array
depending on how it was written, which is why I never assume `children.length` exists.

### P4: separating children from the other props

```jsx
function Panel({ title, children, ...rest }) {
  return <section {...rest}><h2>{title}</h2>{children}</section>
}
function PanelFixedClass({ children, ...rest }) {
  return <section {...rest} className="panel">{children}</section>
}
function PanelDefaultClass({ children, ...rest }) {
  return <section className="panel" {...rest}>{children}</section>
}
```

```
P4 rest: <section id="today" class="panel" data-day="pzt"><h2>Bugün</h2>3 randevu</section>
P4 spread then explicit: <section class="panel">x</section>
P4 explicit then spread: <section class="red">x</section>
  [react warning] React does not recognize the `isVip` prop on a DOM element. ...
P4 unknown prop in rest: <section><h2>x</h2>y</section>
P4 rest without title: <pre>{&quot;id&quot;:&quot;b&quot;,&quot;children&quot;:&quot;c&quot;}</pre>
  [react warning] KeyCheck: `key` is not a prop. Trying to access it will result in `undefined` being returned. ...
P4 key as prop: <i>undefined</i>
```

`({ title, children, ...rest })` is form 8 inside form 11: I take out what the component uses itself, and the rest (form 8)
goes on to the real DOM element with spread. `title` is not in `rest` and not in the HTML, because it was already taken out.

**Who wins:** JSX attributes are applied left to right, like `{ ...rest, className: 'panel' }`. The LAST one wins.
So `{...rest}` then `className` = the component decides (caller cannot change it); `className` then `{...rest}` = only a default
that the caller can override. The caller passed `className="red"` both times and got two different results.

**Problems with rest:** everything in `rest` reaches the DOM. My made-up `isVip` prop produced a warning and was dropped from the HTML
(and in the browser `onBook` would just be ignored). In `ShowRest` `children` was not taken out, so it travelled inside `rest`:
if I spread that `rest` onto an element, the element gets the children from there.
`key` never reaches the component at all: React takes it out before the call and `props.key` is `undefined`, with a warning.

### P5: props or children?

The same receipt, built two ways (`js/props.jsx`, `ts/props.tsx`):

```jsx
function ReceiptSlots({ header, footer, children }) {
  return <article><header>{header}</header><main>{children}</main><footer>{footer}</footer></article>
}
function ReceiptChildren({ children }) {
  return <article>{children}</article>
}
```

```
P5 slots: <article><header><h3>Kaya Berber</h3></header><main>Saç + Sakal</main><footer><small>Toplam: 450 TL</small></footer></article>
P5 children: <article><header><h3>Kaya Berber</h3></header><main>Saç + Sakal</main><footer><small>Toplam: 450 TL</small></footer></article>
P5 children, wrong order: <article><footer>Toplam</footer><header>Kaya Berber</header></article>
```

The HTML is the same, but the responsibility is not. With **props** (`header`, `footer`) the component owns the layout:
the header is always on top, the caller only fills the slots, and a typed props object documents what is expected.
With **children only** the caller owns everything; it is more flexible, but nothing stops the footer from being first
(the third line). I would use named props when the component has fixed places (a receipt, a modal with title and actions),
and children when the component is a wrapper that does not care what is inside (a card frame, a layout column).
Many components mix both: one `title` prop plus `children` for the body.

### P6: defaults

```jsx
function Price({ amount, currency = 'TL', label = <em>no label</em> }) {
  return <span>{label}: {amount} {currency}</span>
}
```

```
P6 given: <span>Sakal: 450 EUR</span>
P6 missing: <span><em>no label</em>: 450 TL</span>
P6 undefined: <span><em>no label</em>: 450 TL</span>
P6 null: <span>: 450 </span>
```

This is form 7 in the parameter. Leaving the prop out and passing `{undefined}` are the same thing, and both give the default.
`{null}` is a real value: the default is not used, and since `null` renders nothing, the label and the currency simply
disappear from the screen (`: 450 `). If a parent passes `null` for "no value", the default will not save me; I would need `??`.
In TypeScript, `currency?: string | null` with a default becomes `string | null` inside, which shows the same thing (T4).

### P7: types

From `ts/props.tsx`:

```tsx
type NoteProps = { tone: 'info' | 'warn'; children?: ReactNode }               // (a) by hand
function Note2({ tone, children }: PropsWithChildren<{ tone: 'info' | 'warn' }>) // (b)
type BookButtonProps = ComponentProps<'button'> & { slot: string }             // (c)
function BookButton({ slot, children = 'Randevu al', type = 'button', ...rest }: BookButtonProps) {
  return <button type={type} {...rest} data-slot={slot}>{children}</button>
}
```

```
P7 a: <p class="info">Pazartesi kapalıyız</p>
P7 b: <p class="warn"></p>
P7 c: <button type="button" disabled="" data-slot="10:30">10:30 için al</button>
P7 c default children: <button type="button" aria-label="book 11:00" data-slot="11:00">Randevu al</button>
```

- `children?: ReactNode` (a): I write it myself. `ReactNode` is everything that can be rendered: string, number, element, array, `null`, `undefined`, boolean.
- `PropsWithChildren<P>` (b): the same thing, it is defined in `@types/react` as `P & { children?: ReactNode | undefined }`. That is why `<Note2 tone="warn" />` without children compiles.
- `ComponentProps<'button'>` (c): all attributes of a real `<button>`, including `children`, `disabled`, `onClick`, `aria-*`. It is the right type for the `...rest` that I spread onto the button.

What the compiler rejects (from `errors/props-wrong.tsx`, `npm run errors`):

| wrong code | error |
|---|---|
| `<Note tone="info">{{ name: 'Hakan' }}</Note>` | `TS2353: Object literal may only specify known properties, and 'name' does not exist in type 'ReactElement<...> \| Iterable<ReactNode> \| ReactPortal \| Promise<...>'` |
| `<Bare tone="x">Hakan</Bare>` (no children in the type) | `TS2322: ... Property 'children' does not exist on type 'IntrinsicAttributes & { tone: string; }'` |
| `<Note2 tone="error">` | `TS2322: Type '"error"' is not assignable to type '"info" \| "warn"'` |
| `<Book type="link">` | `TS2322: Type '"link"' is not assignable to type '"button" \| "submit" \| "reset" \| undefined'` |
| `<Book onClick="go()">` | `TS2322: Type 'string' is not assignable to type 'MouseEventHandler<HTMLButtonElement>'` |
| `<Strict />` (children: string, required) | `TS2741: Property 'children' is missing in type '{}' but required in type '{ children: string; }'` |
| `<Strict><i>Hakan</i></Strict>` | `TS2745: This JSX tag's 'children' prop expects type 'string' which requires multiple children, but only a single child was provided.` |
| `<Note tone="info">{() => 'hi'}</Note>` | `TS2322: Type '() => string' is not assignable to type 'ReactNode'` |

So the type catches at compile time two things that P3 showed at run time: an object child (P3: throws) and a function child
(P3: silently renders nothing). For a function child the component must say so in its type: `children: (free: string[]) => ReactNode` (`Slots` in `ts/props.tsx`).

**Changing props** (extra experiment from the hints):

```
extra mutate props: THROWS TypeError: Cannot assign to read only property 'title' of object '#<Object>'
extra mutate local: <p>ORIGINAL</p>
```

`props.title = ...` throws because React freezes the props object in development (P1 showed `frozen: true`).
But `({ title })` then `title = title.toUpperCase()` is fine: after destructuring, `title` is just a local variable, a copy of the value.

---

## JavaScript vs TypeScript

The errors are real, from `npm run errors` (`errors/wrong.ts`) unless marked otherwise.

| Form | Same in TS | What I must add | Error when I get it wrong |
|---|---|---|---|
| 1 `const [x, y] = f()` | the pattern | a tuple return type `[number, number]` | `TS2322: Type 'number[]' is not assignable to type '[number, number]'. Target requires 2 element(s) but source may have fewer.` |
| 2 `[, b, ...rest]` | the pattern; rest is `string[]` | a check or default, because `b` is `string \| undefined` | `TS18048: 'nextUp' is possibly 'undefined'.` |
| 3 swap | the pattern | both variables must accept both types | `TS2322: Type 'string' is not assignable to type 'number'.` (and the reverse) |
| 5 `{ a, b }` | the pattern | a type on the object (`Appointment`) | `TS2339: Property 'phone' does not exist on type 'Appointment'.` (JS just gives `undefined`) |
| 6 `{ a: alpha }` / T1 | the pattern means rename in both | the type AFTER the pattern: `({ customer }: { customer: string })` | `TS7031: Binding element 'string' implicitly has an 'any' type.` |
| 7 `{ a = 1 }` | the pattern | a default of the right type | `TS2322: Type 'number \| "free"' is not assignable to type 'number'.` |
| 8 `{ a, ...rest }` | the pattern; rest type is `Omit<T, 'a'>` | nothing | `TS2339: Property 'id' does not exist on type '{ customer: string; price: number; ... }'.` |
| 9 nested | the pattern | `= {}` on an optional middle level | `TS2339: Property 'name' does not exist on type '{ name: string; } \| undefined'.` |
| 10 `{ [k]: v }` | the pattern | a key type that exists (`keyof T` or a `Record`) | `TS2339: Property 'phone' does not exist on type 'Appointment'.` |
| 11 parameters | the pattern and defaults | type after the pattern, `= {}` only if all fields are optional | `TS2339: Property 'customer' does not exist on type 'Appointment \| undefined'.` |
| 12 loops | the pattern | nothing (types come from `Map<K, V>` / `Object.entries`) | `TS2322: Type 'number' is not assignable to type 'string'.`; a type on the loop pattern: `TS2483: The left-hand side of a 'for...of' statement cannot use a type annotation.` |
| P7 children | `({ title, children })` | `children` in the props type | `TS2339: Property 'children' does not exist on type '{ title: string; }'.` |

## TypeScript topics (T1 to T5)

From `ts/types.ts`:

```
T1: 1
T1 wrong but runs: Hoş geldin Mert
T1 right: Hoş geldin Mert
T2 tuple: 11 EMRE
T2 array: number string
T2 as const: 09:00 21:00 | without: 09:00
T3 check: nobody waiting
T3 default: nobody
T3 non-null (!), only when I am sure: 4
T4: undefined 30 null
T5 fixed: 450 TL 30 EUR
T5 at runtime the error is real: Cannot destructure property 'currency' of 'settings' as it is undefined.
```

**T1, a rename is not a type.** `function greetWrong({ customer: string }: { customer: string })` compiles and runs,
but it creates a variable called `string` and no `customer`. Without the type after it, TypeScript says
`TS7031: Binding element 'string' implicitly has an 'any' type.`, which is the hint that `string` is a variable name here.
Correct: the whole type goes after the whole pattern, `({ customer }: { customer: string })`.

**T2, tuple vs array.** `slotTuple(): [number, string]` gives `tHour: number` and `tName: string`, so `tName.toUpperCase()` is fine.
`slotArray()` without the return type is inferred as `(string | number)[]`, so both variables are `string | number | undefined` and
I must narrow their types before using number-only or string-only operations. `as const` makes `['09:00', '21:00']` a `readonly ['09:00', '21:00']` tuple: `opens` has the
literal type `'09:00'` and is never `undefined`. Without `as const` it is `string[]`, and `maybeOpens` is `string | undefined`.

**T3, `noUncheckedIndexedAccess`.** With this option `const [first] = waitingList` (a `string[]`) is `string | undefined`, because
the array may be empty. `first.toUpperCase()` is an error. Three ways out: check (`first === undefined ? ... : ...`),
a default (`[firstOrDefault = 'nobody']` becomes `string`), or `!` when I am sure (but `!` is a promise to the compiler, not a check).

**T4, optional and defaults.** For `type Booking = { customer: string; note?: string; minutes?: number; barber: string | null }`:
`note` is `string | undefined` (optional, no default), `minutes = 30` is `number` (the default removed `undefined`), and
`barber = 'any'` stays `string | null` because a default never removes `null`. The output `undefined 30 null` matches.

**T5, a compile error caused by destructuring.**

```ts
function priceLabel(amount: number, settings?: Settings) {
  // @ts-expect-error TS2339: Property 'currency' does not exist on type 'Settings | undefined'.
  const { currency } = settings
```

The message is `TS2339: Property 'currency' does not exist on type 'Settings | undefined'.` (the intentionally invalid example in `errors/wrong.ts` demonstrates the same optional-object problem).
The compiler is right: at run time the call `priceLabel(450)` throws `Cannot destructure property 'currency' of 'settings' as it is undefined.`
The fix is a default for the whole parameter: `function priceLabelFixed(amount: number, { currency }: Settings = { currency: 'TL' })`.

---

## Bonus 1: LaTeX

Bonus 1: LaTeX

The complete guide is in `latex/guide.pdf`. Its source is `latex/guide.tex`, which includes
`latex/body.tex`, generated from this README. It includes the same twelve entries, pitfalls,
props and children examples, comparison tables, bonuses and log. Code uses `listings`,
tables use `longtable`, and the contents page has section links through `hyperref`.

Command used for this final version (pandoc 3.14 and Tectonic 0.17.0):

```sh
sh latex/build.sh tectonic
```

The script converts Markdown with pandoc, then runs `tectonic --untrusted --keep-logs guide.tex`.
It also supports an existing TeX Live / XeLaTeX installation:

```sh
sh latex/build.sh xelatex
```

The second route uses `latexmk -xelatex`. With no argument, the script chooses an available engine.
These tools are needed only to regenerate the PDF; `npm run all` and `npm run check` do not use LaTeX.
The included PDF can be read directly. Tectonic downloads the TeX resources it needs on its first run.
DejaVu fonts and their license are included in `latex/fonts`, so the layout does not depend on
fonts installed on the reader's computer.

Two conversion details matter: a barber-pole emoji is spelled out because it has no glyph in the
code font, and escaped table pipes are restored after pandoc conversion. The script uses a temporary
file instead of `sed -i`, whose syntax differs between macOS and Linux. Turkish letters are mapped
explicitly in the listing style. The title page disables page anchors to avoid duplicate page labels.

## Bonus 2: Depth

Bonus 2: Depth

Code in `bonus/depth.mjs` and `bonus/depth-types.ts`, part of `npm run all`.

### D1: what does an array pattern really call?

My guess was that `const [p1, p2] = value` reads `value[0]` and `value[1]`. I made an object that has BOTH a `0` property
(`'NOT USED'`) and its own `Symbol.iterator` that logs every `next()`:

```
  D1 next() call 1
  D1 next() call 2
  D1 return() called: the pattern stopped early
D1 two names: Emre Burak
  D1 next() call 1
  ...
  D1 next() call 5
D1 rest reads to the end: [ 'Selin', 'Mert' ]
D1 array-like: {(intermediate value)(intermediate value)} is not iterable
```

So the array pattern never looks at `[0]`. It calls `value[Symbol.iterator]()`, then `next()` once per name. When the pattern is
done before the iterator, it calls `return()` to close it. With `...rest` it calls `next()` until `done` (5 calls for 4 names).
An array-like object `{ 0: 'a', length: 1 }` does not work, because it has no iterator. This also explains the different error in pitfall 1 (`null is not iterable`).

Because of this, anything iterable can be destructured:

```
D1 string: Ç [ 'a', 'ğ', 'r', 'ı' ]
D1 emoji is one item (code point, not UTF-16 unit): 💈 | [0] gives: "\ud83d"
D1 Set (duplicates gone): cut beard
D1 Map, nested pattern: Hakan 2
  D1 generator gives 100
  D1 generator gives 101
D1 infinite generator, two taken: 100 101
D1 object pattern on a string: 4 K
```

The string iterator walks by code point, so `[emoji]` gets the whole 💈, while `'💈'[0]` is half of a surrogate pair.
An infinite generator is safe with `[t1, t2]` because the pattern stops after two `next()` calls (but `[...all]` would never end).
An OBJECT pattern on a string does not use the iterator at all: it reads properties (`length`, `0`).

### D2: order of evaluation

```js
const {
  a = note('default a', 1),
  b = note('default b', a + 10),
  [note('key c', 'c')]: c = note('default c', 3),
} = { a: undefined, b: 5 }
```

```
D2 values: 1 5 3 | order: default a -> key c -> default c
D2 later variable: ReferenceError: Cannot access 'later' before initialization
  D2 getter price
  D2 getter customer
D2 getters: Mert 450
```

Everything runs left to right, one item at a time: `a`'s default, then (b has a value, so its default never runs), then the computed key,
then `c`'s default. A default can use an EARLIER variable of the same pattern (`a + 10` would work), but not a later one:
`{ early = later, later = 1 }` is a ReferenceError, because `later` is in the temporal dead zone at that point, like a `const` used before its line.
Getters are called in the order of the PATTERN, not of the object: I wrote `{ price, customer }`, so `price` was read first.

### D3: other places

```
D3 catch pattern: SyntaxError | Expected property name or '}' in JSON at position 2 (line 1 column 3)
D3 member targets: { left: 'Hakan', right: 'Murat' } [ <3 empty items>, 'Ali' ]
D3 object pattern into members: Usta Çırak
D3 for...in key: cut string
D3 for...in key: beard string
D3 for...of pair: cut 300
D3 for...of pair: beard 150
D3 for...in with [first]: c
D3 for...in with [first]: b
D3 namespace object: receipt.txt false
```

- `catch ({ name, message })` works because the catch parameter is a normal binding.
- In an assignment pattern the targets can be any reference: `[chairs.left, chairs.right, names[3]] = [...]` writes into an object and an array (and leaves 3 holes in `names`).
- `for...in` gives keys (strings). If I put an array pattern there, `for (const [firstChar] in prices)`, it destructures the KEY STRING and gives the first letter. It runs, but it is almost certainly a bug.
- `import { basename as base }` is NOT destructuring: it uses `as`, has no defaults and no nesting, and the names are live bindings. Destructuring the namespace object, `const { basename: base } = mod`, is real destructuring. `Object.isFrozen(mod)` was `false`, which surprised me: the namespace is not frozen in the `Object.freeze` sense, its properties are just not writable through it.

### D4: when destructuring makes code worse

```js
const { data: { shop: { owner: { contact: { phones: [mainPhone] } } } } } = response
const mainPhone2 = response.data?.shop?.owner?.contact?.phones?.[0] ?? 'no phone'
```

```
D4 deep pattern: 0212 000 00 00
D4 optional chaining: 0212 000 00 00
D4 deep pattern on missing data: Cannot read properties of undefined (reading 'owner')
D4 optional chaining on missing data: no phone
```

Five levels in one pattern: I had to count braces to write it, it creates one variable for a lot of syntax, and it throws when one
level is missing. To make it safe I would need `= {}` at every level. Optional chaining is shorter and safe. My rule now: one level of
nesting in a pattern is fine, two is the limit, deeper → `?.` or a helper function.

### D5: the same idea at the type level

In `bonus/depth-types.ts`:

```ts
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never // like const [first] = t
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : never    // like const [, ...rest] = t
type BookArgs = Parameters<typeof book> // [customer: string, service: 'cut' | 'beard', minutes?: number]
function swap<A, B>([a, b]: readonly [A, B]): [B, A] { return [b, a] }
```

```
D5 Parameters: Deniz beard 30 -> Deniz beard 30
D5 Field and Without: { customer: 'Mert', price: 450 } [ true, true, true ]
D5 generic swap: 2 Hakan
```

`infer` inside a tuple type looks exactly like a pattern: `[infer F, ...unknown[]]` is `[first, ...ignored]`. The three `true` values
are a compile-time proof: `proofs` has the type `[Equal<First<Slot>, string>, Equal<Rest<Slot>, [string, number]>, Equal<First<[]>, never>]`,
so if one of my types were wrong, `npm run check` would fail. `Parameters<F>` turns a parameter list into a tuple, which I can then
destructure with a default. The generic `swap` keeps the exact types through the pattern: with `as const`, `n` has the type `2`, not `number`.

## Bonus 3: Real code

Bonus 3: Real code

Versions: esbuild 0.28.2, typescript 5.8.3 (both installed in `node_modules` by `npm install`),
shadcn/ui at commit `e62c943`, and the instructor's Assignment 3 Task Manager starter.
The starter cases refer to the original `starter.zip`, not my modified Assignment 3 solution.
Installed-library line numbers refer to the versions in `package-lock.json`.
Source: [shadcn/ui button](https://github.com/shadcn-ui/ui/blob/e62c943/apps/v4/registry/new-york-v4/ui/button.tsx#L40).

**Case 1, esbuild, `node_modules/esbuild/lib/main.js` line 2093, form 1.**

```js
let [major, minor] = process.versions.node.split(".");
if (+major < 12 || +major === 12 && +minor < 17 || +major === 13 && +minor < 13) { worker_threads = void 0; }
```

Without destructuring: `let parts = process.versions.node.split("."); let major = parts[0]; let minor = parts[1];`.
Values by position from an array that a function returned. Note that `major` and `minor` are STRINGS, which is why every use needs `+major`.
I think `const [major, minor] = process.versions.node.split(".").map(Number)` would be clearer, and `let` is not needed because they never change.

**Case 2, esbuild, `node_modules/esbuild/lib/main.js` line 2394, form 6.**

```js
let { port1: mainPort, port2: workerPort } = new worker_threads2.MessageChannel();
```

Without: `let channel = new MessageChannel(); let mainPort = channel.port1; let workerPort = channel.port2;`.
A good use of renaming: `port1` / `port2` are the API names, `mainPort` / `workerPort` say what each one is FOR in this code.

**Case 3, esbuild, `node_modules/esbuild/lib/main.js` line 2482, form 5 (inside a callback).**

```js
parentPort.on("message", (msg) => {
  (async () => {
    let { sharedBuffer, id, command, args } = msg;
```

Without destructuring:

```js
let sharedBuffer = msg.sharedBuffer;
let id = msg.id;
let command = msg.command;
let args = msg.args;
```

The pattern documents the shape of a message at the top of the handler.
It could have been form 11 directly: `parentPort.on("message", ({ sharedBuffer, id, command, args }) => ...)`.

**Case 4, TypeScript compiler, `node_modules/typescript/lib/typescript.js` line 4830, forms 5 + 6. (The case I think is worse.)**

```js
static tryParse(text) {
  const result = tryParseComponents(text);
  if (!result) return void 0;
  const { major, minor, patch, prerelease, build: build2 } = result;
  return new _Version(major, minor, patch, prerelease, build2);
}
```

Without: `return new _Version(result.major, result.minor, result.patch, result.prerelease, result.build);`, which is one line instead of two.
This is the distributed compiler bundle; `build2` is a local name, not another property of `result`. Here the destructuring only moves five fields into five variables that are used once,
right on the next line. It makes the code longer and adds a confusing name. Note the `if (!result) return` before it: without that check
this line would throw (pitfall 1).

**Case 5, TypeScript compiler, `node_modules/typescript/lib/typescript.js` line 4020, form 12.**

```js
for (const [enumValue, enumName] of members) {
```

Without: `for (const entry of members) { const enumValue = entry[0]; const enumName = entry[1]; ... }`. Looping over `[key, value]`
pairs (here a sorted list of entries), exactly my price list loop.

**Case 6, shadcn/ui, `apps/v4/registry/new-york-v4/ui/button.tsx` lines 40–61, forms 11 + 7 + 8, React props.**

```tsx
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp data-slot="button" data-variant={variant} data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

The parameter setup without destructuring is:

```tsx
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }
function Button(input: ButtonProps) {
  const className = input.className
  const variant = input.variant === undefined ? "default" : input.variant
  const size = input.size === undefined ? "default" : input.size
  const asChild = input.asChild === undefined ? false : input.asChild
  const props = { ...input }
  delete props.className
  delete props.variant
  delete props.size
  delete props.asChild
  // Use the same Comp selection and return expression shown above.
}
```

The copy uses spread (an expression), not a destructuring pattern; the input is not mutated.
This is P4 + P6 + P7 in one real component.

**Props and children here:** `className`, `variant`, `size` and `asChild` are props the component uses itself (three with defaults, form 7).
`children` is NOT in the pattern at all: when someone writes `<Button>Save</Button>`, `"Save"` arrives as `props.children`, stays inside
`...props` (form 8) and is spread onto `<Comp {...props} />`, so the button shows it. `onClick`, `disabled`, `type` travel the same way.
The order matters as in P4: `{...props}` is LAST, so a caller could override `data-slot`, but not `className`, because `className`
was taken out of `props` and merged with `cn(...)` first. The type `React.ComponentProps<"button">` is exactly my P7 (c).

**Case 7, instructor's Assignment 3 starter, `starter/src/App.tsx` line 37, form 1.**

```tsx
const [tasks, dispatch] = useReducer(taskReducer, [])
```

Without destructuring:

```tsx
const reducerResult = useReducer(taskReducer, [])
const tasks = reducerResult[0]
const dispatch = reducerResult[1]
```

The hook is still called exactly once, in the same place. Position zero is the current state and
position one is the dispatch function. Reversing the names reverses their meanings; the names
do not select values. Destructuring is useful because the hook has a fixed two-item result.

**Case 8, instructor's Assignment 3 starter, `starter/src/TaskRow.tsx` line 5, forms 5 + 11, React props.**

```tsx
export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
  // Original return: a list item with title, status and Next/Delete buttons.
}
```

Without destructuring, the same parameter setup is:

```tsx
export default function TaskRow(props: TaskRowProps) {
  const task = props.task
  const onNext = props.onNext
  const onDelete = props.onDelete
  // The original return expression stays the same.
}
```

`task`, `onNext` and `onDelete` are fields of one props object, not three positional arguments.
In `starter/src/App.tsx` lines 25–30, `TaskRow` is self-closing, so it receives no children.
Its props type does not declare children, and its JSX builds content from `task`.
The caller's `key` belongs to React and is not an ordinary prop passed to `TaskRow`.

## Bonus 4: Git repository

Bonus 4: Git repository

Link: https://github.com/Ozbab/DestructuringFieldGuide

`.gitignore` leaves out `node_modules`, `dist` and temporary LaTeX files. After cloning, run
`npm install`, `npm run all` and `npm run check`. The repository is public for instructor access.

History note: this repository was created on 17 November 2026 for the existing project.
Its commits record the import, documentation, build improvements and verification on that date.
They do not demonstrate work spread over several days; that part of the bonus is not claimed as completed.

---

## Sources for the explanations

- [ECMAScript: destructuring binding patterns](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns).
  D1 demonstrates iterator binding; D2 demonstrates that defaults run only for undefined values.
- [TypeScript Handbook: inferring within conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types).
  D5 applies `infer` to tuple positions and verifies the inferred types during `npm run check`.
- Assignment 3 instructor starter: `starter/src/App.tsx` and `starter/src/TaskRow.tsx`.
- Installed esbuild and TypeScript sources and the pinned shadcn/ui file cited in Bonus 3.

## My own log

The following experiments were reproduced during the final check on 17 November 2026.
Runtime observations are in `output.txt`; compiler diagnostics are in `errors/output.txt`.
These entries describe the actual results and the corresponding fixes.

1. **A type-looking pattern creates a variable.** In `errors/wrong.ts`,
   `function greet({ customer: string })` produces
   `TS7031: Binding element 'string' implicitly has an 'any' type.`
   The typed version in `ts/types.ts` prints `T1 wrong but runs: Hoş geldin Mert`.
   The colon renames `customer` to `string`; the type belongs after the complete pattern.

2. **A missing nested object fails before a leaf default helps.** Form 9 prints
   `Cannot read properties of undefined (reading 'name')`. A default for the intermediate
   object, `barber: { name: who = '?' } = {}`, produces `form 9 (with = {}): ?`.
   The object must exist before the pattern can read its `name` field.

3. **A swap can attach to the previous statement.** The missing-semicolon experiment prints
   `TypeError: Cannot create property '2' on string 'hi'`.
   Starting the assignment with `;` produces `pitfall 6 (with ;): 2 1`.
   A newline alone does not guarantee that JavaScript starts a new statement.

4. **An object assignment needs parentheses.** Evaluating `{ customer } = booking` prints
   `SyntaxError: Unexpected token '='`; the parenthesised version prints
   `pitfall 3 (with parentheses): Selin`. The leading brace is otherwise a block.
   The broken syntax is inside `eval` so the rest of the file can still run.

5. **A loop pattern does not accept an inline annotation.** In `errors/wrong.ts`,
   `for (const [c, b]: [number, string] of chairs)` produces
   `TS2483: The left-hand side of a 'for...of' statement cannot use a type annotation.`
   The working example types the Map and lets the loop variables inherit its key/value types.

6. **React warnings use a different output stream.** `js/props.jsx` captures `console.error`
   and prefixes the warning text with `[react warning]` in the normal output stream.
   This makes the missing-key, special-key and unknown-prop messages visible in `output.txt`
   when `npm run all > output.txt` is used. An ordinary stdout redirect would leave them out.

7. **The children diagnostic needs careful reading.** Passing an element to `children: string`
   produces `TS2745: This JSX tag's 'children' prop expects type 'string' which requires multiple children, but only a single child was provided.`
   The mismatch is the value type: use a string child or a props type accepting `ReactNode`.
   Adding more arbitrary children is not the fix.

8. **An array pattern uses the iterator.** D1's custom iterable logs `next()` and `return()`.
   Its numeric property is ignored. The bindings use iterator results, and stopping early
   closes the iterator. This also explains why the null-array experiment prints `null is not iterable`.
