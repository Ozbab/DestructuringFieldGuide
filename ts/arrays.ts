// Oğuzhan Kaya, 2200004591
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

// Form 1 (worked example from the starter): the return type of the function is a tuple.
function minMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1:', lowest, highest) // form 1: 2 9

// Form 1, my own: a labelled tuple, [hour, customers]
type HourCount = [hour: number, customers: number]
function busiestHour(visits: number[]): HourCount {
  const counts = new Map<number, number>()
  for (const v of visits) counts.set(v, (counts.get(v) ?? 0) + 1)
  let best: HourCount = [0, 0]
  for (const [h, n] of counts) if (n > best[1]) best = [h, n]
  return best
}
const [hour, customers] = busiestHour([10, 11, 11, 14, 11, 17, 14])
console.log('form 1 (mine):', hour, customers) // hour: number, customers: number

// Form 2: skip and rest. The list is string[], so `nextUp` is string | undefined (noUncheckedIndexedAccess)
const queue: string[] = ['Emre', 'Burak', 'Selin', 'Mert', 'Deniz']
const [, nextUp, ...waiting] = queue
console.log('form 2:', nextUp ?? '(nobody)', waiting) // waiting: string[]
// with a tuple type, positions are known, so no undefined
const fixedQueue: [string, string, ...string[]] = ['Emre', 'Burak', 'Selin']
const [, second, ...others] = fixedQueue
console.log('form 2 (tuple):', second.toUpperCase(), others)

// Form 3: swap. Both variables must accept the other value's type.
let chair1 = 'Emre'
let chair2 = 'Burak'
;[chair1, chair2] = [chair2, chair1]
console.log('form 3:', chair1, chair2)

// Form 4: defaults. The default removes `undefined` from the type.
const songs: string[] = ['Barış Manço - Gülpembe']
const [firstSong = 'silence', secondSong = 'silence'] = songs // both: string
console.log('form 4:', firstSong, '|', secondSong)
const [open = 9, close = 21]: number[] = []
console.log('form 4 (empty array):', open, close)
