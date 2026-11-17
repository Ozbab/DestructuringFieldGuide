// Oğuzhan Kaya, 2200004591
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const html = (el: ReactNode) => renderToStaticMarkup(el)

type CardProps = { title: string; children?: ReactNode }

// Worked example from the starter: the type goes after the whole pattern, and children is in the type too.
function Card({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
console.log(renderToStaticMarkup(<Card title="Hi">text</Card>))
// <section><h2>Hi</h2>text</section>

// ---------- P1: one object, typed once ----------
function CardA(props: CardProps) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
console.log('P1 A:', html(<CardA title="Bugün">3 randevu</CardA>))
console.log('P1 B:', html(<Card title="Bugün">3 randevu</Card>))

// ---------- P2: children is only a prop, also for the type checker ----------
function Badge({ children }: { children: string }) {
  return <span className="badge">{children}</span>
}
console.log('P2 between tags:', html(<Badge>VIP</Badge>))
console.log('P2 as attribute:', html(<Badge children="VIP" />))

// ---------- P3: children typed as ReactNode accepts all of these ----------
function Box({ children }: { children?: ReactNode }) {
  return <div>[{children}]</div>
}
const samples: [string, ReactNode][] = [
  ['string', 'Saç kesimi'],
  ['number', 450],
  ['element', <b>Hakan</b>],
  ['array', [<b key="h">Hakan</b>, <i key="m">Murat</i>]],
  ['undefined', undefined],
  ['null', null],
  ['false', false],
]
for (const [label, node] of samples) console.log('P3', label + ':', html(<Box>{node}</Box>))
// a function is NOT a ReactNode: if children should be a function, say so in the type
function Slots({ children }: { children: (free: string[]) => ReactNode }) {
  return <ul>{children(['10:00', '11:30'])}</ul>
}
console.log('P3 function child:', html(<Slots>{(list) => list.map((t) => <li key={t}>{t}</li>)}</Slots>))

// ---------- P4: rest props, typed with ComponentProps<'section'> ----------
type PanelProps = ComponentProps<'section'> & { title: string }
function Panel({ title, children, ...rest }: PanelProps) {
  // rest: everything a <section> accepts except title and children
  return <section {...rest}><h2>{title}</h2>{children}</section>
}
console.log('P4 rest:', html(<Panel title="Bugün" id="today" className="panel" data-day="pzt">3 randevu</Panel>))
function PanelFixedClass({ children, ...rest }: ComponentProps<'section'>) {
  return <section {...rest} className="panel">{children}</section>
}
function PanelDefaultClass({ children, ...rest }: ComponentProps<'section'>) {
  return <section className="panel" {...rest}>{children}</section>
}
console.log('P4 spread then explicit:', html(<PanelFixedClass className="red">x</PanelFixedClass>))
console.log('P4 explicit then spread:', html(<PanelDefaultClass className="red">x</PanelDefaultClass>))

// ---------- P5: props or children? ----------
type ReceiptSlotProps = { header: ReactNode; footer: ReactNode; children: ReactNode }
function ReceiptSlots({ header, footer, children }: ReceiptSlotProps) {
  return <article><header>{header}</header><main>{children}</main><footer>{footer}</footer></article>
}
function ReceiptChildren({ children }: PropsWithChildren) {
  return <article>{children}</article>
}
console.log('P5 slots:', html(
  <ReceiptSlots header={<h3>Kaya Berber</h3>} footer={<small>Toplam: 450 TL</small>}>Saç + Sakal</ReceiptSlots>,
))
console.log('P5 children:', html(
  <ReceiptChildren><header><h3>Kaya Berber</h3></header><main>Saç + Sakal</main></ReceiptChildren>,
))

// ---------- P6: defaults ----------
type PriceProps = { amount: number; currency?: string | null; label?: ReactNode }
function Price({ amount, currency = 'TL', label = <em>no label</em> }: PriceProps) {
  // currency: string | null  (the default removed undefined, but not null)
  return <span>{label}: {amount} {currency}</span>
}
console.log('P6 missing:', html(<Price amount={450} />))
console.log('P6 undefined:', html(<Price amount={450} currency={undefined} />))
console.log('P6 null:', html(<Price amount={450} currency={null} label={null} />))

// ---------- P7: the three ways to type children ----------
// (a) by hand: children?: ReactNode
type NoteProps = { tone: 'info' | 'warn'; children?: ReactNode }
function Note({ tone, children }: NoteProps) {
  return <p className={tone}>{children}</p>
}
// (b) PropsWithChildren<P> = P & { children?: ReactNode }
function Note2({ tone, children }: PropsWithChildren<{ tone: 'info' | 'warn' }>) {
  return <p className={tone}>{children}</p>
}
// (c) ComponentProps<'button'>: every attribute of a real <button>, children included
type BookButtonProps = ComponentProps<'button'> & { slot: string }
function BookButton({ slot, children = 'Randevu al', type = 'button', ...rest }: BookButtonProps) {
  return <button type={type} {...rest} data-slot={slot}>{children}</button>
}
console.log('P7 a:', html(<Note tone="info">Pazartesi kapalıyız</Note>))
console.log('P7 b:', html(<Note2 tone="warn" />))
console.log('P7 c:', html(<BookButton slot="10:30" disabled>10:30 için al</BookButton>))
console.log('P7 c default children:', html(<BookButton slot="11:00" aria-label="book 11:00" />))
// What the compiler rejects is in errors/props-wrong.tsx (run `npm run errors`).
