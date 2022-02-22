import Layout from "components/Layout"
import Masthead from "components/Masthead"
import Nav from "components/Nav"
import Stringify from "components/Stringify"
import { connect } from "lib/database"
import useUser from "lib/useUser"
import { ObjectId } from "mongodb"
import { useEffect, useState } from "react"
import { getCondition, getItem } from 'gmate-flat-module'
import fetchJson from "lib/fetchJson"

export default function UserTest({ testdata }) {
  const { user } = useUser({ redirectTo: '/' })
  const sekuen = testdata.sequence.split(' ')

  const [seq, setSeq] = useState(testdata.done);
  const [soal, setSoal] = useState(getItem(sekuen[testdata.done]));
  const [kondisi, setKondisi] = useState(getCondition(getItem(sekuen[testdata.done])?.kondisi));
  const [acak, setAcak] = useState(randomIndexes());
  const [selected, setSelected] = useState(null);
  const [value, setValue] = useState(null);
  const [finished, setFinished] = useState(testdata.length == testdata.done);

  const [savedItems, setSavedItems] = useState([]);

  function next(e) {
    if (seq < testdata.length -1) {
      const n = seq + 1
      setSeq(n)
      setSoal(getItem(sekuen[n]))
      setKondisi(getCondition(getItem(sekuen[n]).kondisi))
      setAcak(randomIndexes())
      setSelected(null)
      setValue(null)
    }
  }

  function pilihanAcak(daftarPilihan) {
    // const daftar = [...pilihanSoal]
    // daftar.sort(() => Math.random() - 0.5)
    // return daftar

    // ???
    // Harus menggunakan fixed index
    // Fixed index harus diacak lagi setiap ganti soal
    return [
      daftarPilihan[acak[0]],
      daftarPilihan[acak[1]],
      daftarPilihan[acak[2]],
      daftarPilihan[acak[3]],
      daftarPilihan[acak[4]],
    ]
  }

  async function saveItem(e) {
    // id, seq, bookSeq, key, text, lastTouch

    if(!selected || !value) return

    try {
      const body = {
        id: testdata._id,
        seq: seq,
        bookSeq: sekuen[seq],
        key: selected,
        text: value,
      }
      const response = await fetchJson('/api/post?q=save-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      console.log(response)

      setSavedItems(prev => ([
        ...prev,
        response
      ]))

      if (response.seq == testdata.length) {
        setFinished(true)
      } else {
        next(e)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout title="Haleluyah">
      <Masthead />

      {finished && (
        <div className="flex items-center justify-center h-60">
          <h3 className="text-5xl">Selesai</h3>
        </div>
      )}

      {!finished && (
        <div>
          <div className="kondisi -mx-5 p-5 bg-blue-50 text-[15px] border-t border-b border-blue-100 min-h-[300px] mb-8">
            <div dangerouslySetInnerHTML={{ __html: kondisi }} />
          </div>

          <div className="soal text-[15px] mb-6">
            <div dangerouslySetInnerHTML={{ __html: soal.soal }} />
          </div>

          <p className="w-full truncate text-xs text-gray-500 border p-1" >{selected}&nbsp;&nbsp;{value}</p>

          <p className="my-2">{seq}</p>

          <DaftarPilihan
            daftar={pilihanAcak(soal.pilihan)}
            selected={selected}
            setSelected={setSelected}
            setValue={setValue}
          />

          <p className="text-center my-2">
            <button className="border border-sky-500 font-bold px-4 py-1"
            onClick={saveItem}
            >{seq + 1}</button>
          </p>
        </div>
      )}



      <details className="my-4">
        <summary className="text-sm cursor-pointer hover:bg-gray-200 mb-1">Test data</summary>
        {testdata && <Stringify thing={testdata.sequence} label="" />}
        <br/>
        <Stringify thing={savedItems.sort((a, b) => {return b.seq - a.seq})} label="" />
      </details>

      <div className="h-36"></div>
    </Layout>
  )
}

function randomIndexes() {
  return [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5)
}

function DaftarPilihan({ daftar, selected, setSelected, setValue }) {
  // const daftar = [...soal.pilihan].sort(() => Math.random() - 0.5)
  const marks = ['A', 'B', 'C', 'D', 'E']

  const bullet = `flex-shrink-0 text-xs leading-5 text-center font-bold pt-px w-6 h-6 rounded-full border
  border-gray-300 group-hover:border-gray-300 group-hover:bg-gray-300 group-hover:text-white`

  const bulletSelected = `flex-shrink-0 text-xs leading-5 text-center font-bold pt-px w-6 h-6 rounded-full border
  border-green-600 bg-green-600 text-white`

  return (
    <div className="flex flex-col space-y--3 text-[15px] my-5 mx-8" >
      {daftar.map((p, i) => (
        <button
          key={p.key}
          value={p.key}
          className="group w-full border-t last:border-b p-2 flex items-center space-x-3"
          onClick={(e) => {
            setSelected(p.key)
            setValue(e.currentTarget.lastChild.textContent);
            console.log(e.currentTarget.lastChild.textContent);
          }}
        >
          <div className={selected == p.key ? bulletSelected :  bullet}>{marks[i]}</div>
          <div className="text-left group-hover:text-gray-900" dangerouslySetInnerHTML={{ __html: p.html }} />
        </button>
      ))}
    </div>
  )
}

function DaftarPilihanIniSelaluRandomSetiapKlik({ soal, selected, setSelected }) {
  const daftar = [...soal.pilihan].sort(() => Math.random() - 0.5)
  const marks = ['A', 'B', 'C', 'D', 'E']

  const bullet = `flex-shrink-0 text-xs leading-5 text-center font-bold pt-px w-6 h-6 rounded-full border
  border-gray-300 group-hover:border-green-500 group-hover:bg-green-500 group-hover:text-white`

  return (
    <div className="flex flex-col space-y--3 text-[15px] my-5 mx-8" >
      {daftar.map((p, i) => (
        <button
          key={p.key}
          value={p.key}
          className="group w-full border-t last:border-b p-2 flex items-center space-x-3"
          onClick={() => setSelected(p.key)}
        >
          <div className={bullet}>{marks[i]}</div>
          <div className="text-left group-hover:text-gray-900" dangerouslySetInnerHTML={{ __html: p.html }} />
        </button>
      ))}
    </div>
  )
}

export async function getStaticPaths() {
  const { db } = await connect()
  const rs = await db.collection('gmate').find({},
    { _id: 1 }
  ).toArray()
  console.log("ROW", rs);

  const paths = rs.map((row) => ({
    params: { id: row._id.toString() },
  }))
  console.log(paths);

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  // console.log('params.id', params.id);
  const { db } = await connect()
  const testdata = await db.collection('gmate').findOne({ _id: new ObjectId(params.id) })
  // Convert ObjectId to string
  testdata._id = testdata._id.toString()
  // console.log('testdata', testdata);

  return { props: { testdata } }
}