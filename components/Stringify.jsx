export default function Stringify({ thing, label, maxh }) {
  if (!thing) return null

  const base = "bg-yellow-100 text-[11px] text-red-700 border-t border-red-200 overflow-auto my--4 max-h-48"
  // const klass = !maxh ? base : base + ` max-h-[${maxh}px]`

  return (
    <pre className={base}>
      {label ? label + ' ' : ''}{JSON.stringify(thing, null, 2)}
    </pre>
  )
}