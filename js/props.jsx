// Oğuzhan Kaya, 2200004591
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
import { renderToStaticMarkup } from 'react-dom/server'

// React prints its warnings with console.error (to stderr), so they would be missing from
// output.txt. I send them to stdout with a prefix, cut to the first line.
const realError = console.error
console.error = (...args) => {
  const text = args.map(String).join(' ')
  // React passes the message as a format string with %s parts; fill them in
  let i = 1
  const msg = String(args[0]).replace(/%s/g, () => String(args[i++]))
  console.log('  [react warning]', (msg || text).split('\n')[0])
}
const html = (el) => renderToStaticMarkup(el)
const tryRender = (label, el) => {
  try {
    console.log(label, html(el))
  } catch (e) {
    console.log(label, 'THROWS', e.constructor.name + ':', e.message.split('\n')[0])
  }
}

// ---------- P1: props is ONE object ----------
function CardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
console.log('P1 A:', html(<CardA title="Hi">text</CardA>))
console.log('P1 B:', html(<CardB title="Hi">text</CardB>))
// What React really passes: I log the one argument the component gets.
function Spy(props) {
  console.log('P1 spy, the one argument:', props, '| frozen:', Object.isFrozen(props))
  return null
}
html(<Spy service="Sakal" price={150}>Hakan</Spy>)
// JSX is only a function call: this is what <CardB title="Hi">text</CardB> becomes
import { jsx } from 'react/jsx-runtime'
console.log('P1 jsx():', html(jsx(CardB, { title: 'Hi', children: 'text' })))

// ---------- P2: children is only a prop ----------
function Badge({ children }) {
  return <span className="badge">{children}</span>
}
console.log('P2 between tags:', html(<Badge>VIP</Badge>))
console.log('P2 as attribute:', html(<Badge children="VIP" />))
// both at the same time: the content between the tags wins
console.log('P2 both:', html(<Badge children="from attribute">from tags</Badge>))
// no children at all: the variable is undefined, nothing is rendered
console.log('P2 missing:', html(<Badge />))

// ---------- P3: what children can be ----------
function Box({ children }) {
  return <div>[{children}]</div>
}
tryRender('P3 string:', <Box>Saç kesimi</Box>)
tryRender('P3 number:', <Box>{450}</Box>)
tryRender('P3 zero:', <Box>{0}</Box>)
tryRender('P3 one element:', <Box><b>Hakan</b></Box>)
tryRender('P3 several elements:', <Box><b>Hakan</b><i>Murat</i></Box>)
tryRender('P3 array without keys:', <Box>{['Hakan', 'Murat'].map((n) => <b>{n}</b>)}</Box>)
tryRender('P3 undefined:', <Box>{undefined}</Box>)
tryRender('P3 null:', <Box>{null}</Box>)
tryRender('P3 false:', <Box>{false}</Box>)
tryRender('P3 true:', <Box>{true}</Box>)
tryRender('P3 empty string:', <Box>{''}</Box>)
tryRender('P3 NaN:', <Box>{NaN}</Box>)
tryRender('P3 a function:', <Box>{() => 'hello'}</Box>)
tryRender('P3 an object:', <Box>{{ name: 'Hakan' }}</Box>)
// what does Box see for several elements? an array
function Count({ children }) {
  return <p>{Array.isArray(children) ? `array of ${children.length}` : typeof children}</p>
}
console.log('P3 typeof:', html(<Count>one</Count>), html(<Count><b /><b /></Count>), html(<Count>a{1}b</Count>))
// a function is only useful when the component CALLS it (render prop)
function Slots({ children }) {
  const free = ['10:00', '11:30']
  return <ul>{children(free)}</ul>
}
console.log('P3 function called:', html(<Slots>{(list) => list.map((t) => <li key={t}>{t}</li>)}</Slots>))

// ---------- P4: separate children from the other props, spread the rest ----------
function Panel({ title, children, ...rest }) {
  return <section {...rest}><h2>{title}</h2>{children}</section>
}
console.log('P4 rest:', html(<Panel title="Bugün" id="today" className="panel" data-day="pzt">3 randevu</Panel>))
// spread first, explicit after: the explicit one wins
function PanelFixedClass({ children, ...rest }) {
  return <section {...rest} className="panel">{children}</section>
}
// explicit first, spread after: the caller wins
function PanelDefaultClass({ children, ...rest }) {
  return <section className="panel" {...rest}>{children}</section>
}
console.log('P4 spread then explicit:', html(<PanelFixedClass className="red">x</PanelFixedClass>))
console.log('P4 explicit then spread:', html(<PanelDefaultClass className="red">x</PanelDefaultClass>))
// rest also carries things the DOM does not know: a callback prop ends up on the <section>
tryRender('P4 unknown prop in rest:', <Panel title="x" onBook={() => {}} isVip>y</Panel>)
// rest with a name that already exists: title was taken out, so it is NOT in rest
function ShowRest({ title, ...rest }) {
  return <pre>{JSON.stringify(rest)}</pre>
}
console.log('P4 rest without title:', html(<ShowRest title="a" id="b">c</ShowRest>))
// key and ref: key never reaches the component
function KeyCheck(props) {
  return <i>{String(props.key)}</i>
}
tryRender('P4 key as prop:', <KeyCheck key="k1" />)

// ---------- P5: props or children? ----------
// Version 1: named slots as props
function ReceiptSlots({ header, footer, children }) {
  return <article><header>{header}</header><main>{children}</main><footer>{footer}</footer></article>
}
console.log('P5 slots:', html(
  <ReceiptSlots header={<h3>Kaya Berber</h3>} footer={<small>Toplam: 450 TL</small>}>
    Saç + Sakal
  </ReceiptSlots>,
))
// Version 2: children only, the caller decides everything
function ReceiptChildren({ children }) {
  return <article>{children}</article>
}
console.log('P5 children:', html(
  <ReceiptChildren>
    <header><h3>Kaya Berber</h3></header>
    <main>Saç + Sakal</main>
    <footer><small>Toplam: 450 TL</small></footer>
  </ReceiptChildren>,
))
// with children only, nothing stops a caller from putting the footer first
console.log('P5 children, wrong order:', html(
  <ReceiptChildren><footer>Toplam</footer><header>Kaya Berber</header></ReceiptChildren>,
))

// ---------- P6: defaults for a prop (form 7 in the parameter) ----------
function Price({ amount, currency = 'TL', label = <em>no label</em> }) {
  return <span>{label}: {amount} {currency}</span>
}
console.log('P6 given:', html(<Price amount={450} currency="EUR" label="Sakal" />))
console.log('P6 missing:', html(<Price amount={450} />))
console.log('P6 undefined:', html(<Price amount={450} currency={undefined} label={undefined} />))
console.log('P6 null:', html(<Price amount={450} currency={null} label={null} />))

// ---------- extra: a component that changes props ----------
function Mutator(props) {
  props.title = 'changed'
  return <p>{props.title}</p>
}
tryRender('extra mutate props:', <Mutator title="original" />)
function MutatorLocal({ title }) {
  title = title.toUpperCase() // a local variable from the pattern: allowed
  return <p>{title}</p>
}
console.log('extra mutate local:', html(<MutatorLocal title="original" />))

// P7 (types) is only in ts/props.tsx: plain JavaScript does not check any of this.
console.log('P7 in JS: no check, a number title renders fine:', html(<CardB title={42}>x</CardB>))

console.error = realError
