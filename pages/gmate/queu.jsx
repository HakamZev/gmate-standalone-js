import Layout from 'components/Layout'
import Masthead from 'components/Masthead'
import { createSequence, getItem } from 'gmate-flat-module'
import { useEffect, useState } from 'react'


export default function Queu() {
  const slice = createSequence() //.slice(0, 15)
  const originalLength = slice.length
  const [sequence, setSequence] = useState(slice);
  const [seq, setSeq] = useState(0);
  const [lastSeq, setLastSeq] = useState(0);
  const [soal, setSoal] = useState(getItem(sequence[seq]));
  const [savedItems, setSavedItems] = useState([]);
  const [skippedItems, setSkippedItems] = useState([]);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (seq < sequence.length - 1) {
      setSoal(getItem(sequence[seq]))
    }
  }, [seq, setSoal, sequence]);

  function next() {
    if (seq < sequence.length - 1) {
      const n = seq + 1
      setSeq(n)
      setLastSeq(n)
    }
  }

  function skip(e) {
    const item = sequence[seq]

    if (skippedItems.includes(item)) {
      setSeq(lastSeq)
    }

    if (item && !skippedItems.includes(item)) {
      // setSkippedItems([...skippedItems, item])
      const items = [...skippedItems, item]
      if (seq == sequence.length - 1) {
        if (skippedItems.length > 0) {
          setSequence(items)
          setSkippedItems([])
          setSeq(0)
          setLastSeq(0)
        }
      }
      else {
        setSkippedItems(items)
        const n = seq + 1
        setSeq(n)
        setLastSeq(n)
      }
    }
  }

  function saveItem() {
    if (savedItems.length == originalLength) return
    const item = sequence[seq]
    if (item) {
      setSavedItems([...savedItems, item])
      setSkippedItems(skippedItems.filter(elm => elm != item))
    }

    if (isSkipped) {
      setSeq(lastSeq)
    } else {
      if (seq < sequence.length - 1) {
        const n = seq + 1
        setSeq(n)
        setLastSeq(n)
      }
    }

    if (seq == sequence.length - 1) {
      if (skippedItems.length > 0) {
        setSequence(skippedItems)
        setSkippedItems([])
        setSeq(0)
        setLastSeq(0)
      }
    }

    setIsSkipped(false)
    // setSkippedItems(skippedItems.filter(elm => elm != item))
  }

  const normal = "text-xs tracking-tight h-8 w-8 border mr-1 mb-1"
  const current = "text-xs tracking-tight h-8 w-8 border border-red-500 text-red-500 mr-1 mb-1"
  const saved = "text-xs tracking-tight h-8 w-8 border border-gray-400 bg-gray-400 text-white mr-1 mb-1"

  return (
    <Layout title="Test Queu">
      <Masthead title={`Test Queu ${savedItems.length} / ${originalLength}`} />

      <hr className='mb-4' />
      {isSkipped
        ? <button className={normal + ' w-auto px-3'}>Skipper</button>
        : <button className={normal + ' w-auto px-3'}> - </button>
      }
      <div className="flex flex-wrap mb-2">
        {sequence.map(s => (
          <button key={s} className={savedItems.includes(s) ? saved : (s == sequence[seq] ? current : normal)}>
            {s}
          </button>
        ))}
      </div>

      <hr className='mb-4' />

      <div className="flex flex-wrap mb-2">
        {/* <button className="text-xs tracking-tight h-8 px-2 border mr-1 mb-2">
          SKIPPED
        </button> */}
        {skippedItems.map(s => (
          <button key={s} className="text-xs tracking-tight h-8 w-8 border mr-1 mb-2"
          onClick={e => {
            // const item = sequence[seq]
            // if (!skippedItems.includes(item)) {
            //   setSkippedItems([...skippedItems, item])
            // }
            // setSeq(seq + 1)
            const index = sequence.indexOf(s)
            console.log('index', index);
            setSeq(index)
            setIsSkipped(true)
          }}
          >
            {s}
          </button>
        ))}
      </div>

      <hr className='mb-4' />

      <div className="flex flex-wrap mb-2">
        {savedItems.map(s => <button key={s} className={saved}> {s} </button>)}
        <button className={normal}>{savedItems.length}</button>
      </div>

      <hr className='mb-6' />
      {soal && savedItems.length < originalLength && (
        <>
          {sequence[seq]}
          <div className='text-sm mb-6' dangerouslySetInnerHTML={{ __html: soal.soal }} />
        </>
      )}

      <hr className='mb-4' />

      <div className="text-center">
        <button className="text-xs tracking-tight h-8 px-6 border mr-1 mb-1 mr-3"
        onClick={skip}
        >
          SKIP
        </button>
        <button className="text-xs tracking-tight h-8 px-6 border mr-1 mb-1"
        onClick={e => saveItem()}
        >
          Save
        </button>
        <button className="text-xs tracking-tight h-8 px-6 border ml-10 mb-1">{seq}-{lastSeq}</button>
      </div>
    </Layout>
  )
}