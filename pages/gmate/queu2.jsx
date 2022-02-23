import Layout from 'components/Layout'
import Masthead from 'components/Masthead'
import { createSequence, getItem } from 'gmate-flat-module'
import { useEffect, useState } from 'react'


const source = createSequence().slice(0, 15)

export default function Queu() {

  const [curIndex, setCurIndex] = useState(0);
  const [sequence, setSequence] = useState([...source]);
  const [skipped, setSkipped] = useState([]);
  const [saved, setSaved] = useState([]);

  const btn = 'text-[10px] font-bold tracking-tight h-8 w-8 border mr-1 mb-1'
  const btnCurrent = 'text-[10px] font-bold tracking-tight h-8 w-8 border mr-1 mb-1 border-red-500 text-red-500'
  const btnSaved = 'text-[10px] font-bold tracking-tight h-8 w-8 border mr-1 mb-1 border-gray-400 bg-gray-400 text-white'

  function saveItem() {
    const item = sequence[curIndex]
    if (!saved.includes(item)) {
      const arr = [...saved, item]
      setSaved(arr)
      setSkipped(skipped.filter(e => e != item))

      // If last item
      if (sequence.lastIndexOf(item) == sequence.length -1) {
        console.log('LAST QUEU')
        if (skipped.length > 0) {
          // ...skipped
          setSequence([...skipped])
          setSkipped([])
          setCurIndex(0)
        }
      }
    }
  }

  function forward() {
    for (let i=curIndex + 1; i < sequence.length; i++) {
      const item = sequence[i]
      console.log(i, item)
      if (!saved.includes(item) && !skipped.includes(item)) {
        console.log(i);
        setCurIndex(i)
        return
      }
    }
  }

  function skip() {
    const item = sequence[curIndex]
    if (!skipped.includes(item)) {
      const arr = [...skipped, item]
      setSkipped(arr)

      // If last item
      if (sequence.lastIndexOf(item) == sequence.length -1) {
        console.log('LAST QUEU')
        if (skipped.length > 0) {
          // ...skipped
          setSequence(arr)
          setSkipped([])
          setCurIndex(0)
        }
      }
    }
  }

  return (
    <Layout title="Queue">
      <Masthead title="Gmate Queue" />

      <div className="-mx-5 px-5 pt-3 pb-2 min-h-[58px] flex flex-wrap border-t border-b">
        {sequence.map(s => <button key={s} className={
          saved.includes(s) ? btnSaved : (s == sequence[curIndex] ? btnCurrent : btn)
        }>{s}</button>)}
      </div>

      <div className="-mx-5 px-5 pt-3 pb-2 min-h-[58px] flex flex-wrap border-b">
        {skipped.map(s => <button key={s} onClick={e => {
          const index = sequence.indexOf(s)
          console.log(index);
          setCurIndex(index)
        }}
        className={btn}>{s}</button>)}
      </div>

      <div className="-mx-5 px-5 pt-3 pb-2 min-h-[58px] flex flex-wrap border-b">
        {saved.map(s => <button key={s} className={btnSaved}>{s}</button>)}
        <button className={btn}>{saved.length}</button>
      </div>

      <div className="-mx-5 px-5 pt-3 pb-2 min-h-[58px] flex space-x-3 border-b">
        <button onClick={e => {
          skip()
          forward()
        }}
        className={btn + ' w-auto px-6'}>Skip</button>
        <button onClick={e => {
          saveItem()
          forward()
        }}
        className={btn + ' w-auto px-6'}>Save</button>
        <button className={btn + ' w-auto px-6'}>{curIndex}</button>
      </div>
    </Layout>
  )
}