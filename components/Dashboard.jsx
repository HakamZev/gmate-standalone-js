import fetchJson from "lib/fetchJson";
import useUserTests from "lib/useUserTests";
import Link from "next/link";
import { useRouter } from "next/router";
import Stringify from "./Stringify";

export default function Dashboard({ user, mutateUser }) {
  const { tests, isLoading } = useUserTests()
  const router = useRouter()

  if (isLoading) return <div className="my-8 text-gray-400">Loading...</div>

  function progress(test) {
    if (test.done == 0) return "Belum dikerjakan"
    if (test.done == test.length) return "Selesai"
    return `Sampai Nomor ${test.done}`
  }

  const btn = "cursor text-xs font-medium rounded bg-blue-300 hover:bg-blue-400 active:text-white px-3 py-1"

  return (
    <div className="my-8">

      <details className="my-4">
        <summary className="text-sm cursor-pointer hover:bg-gray-200 mb-1">Data User</summary>
        <Stringify thing={user} label="" />
      </details>

      <details className="my-4">
        <summary className="text-sm cursor-pointer hover:bg-gray-200 mb-1">Data Tests</summary>
        {tests && <Stringify thing={tests} label="Tests" maxh="200" />}
      </details>


      {tests && tests.length > 0 && (
        <div className="my-8 overflow-x-auto">
          <h3 className="text--lg font-semibold mb-2">Daftar Gmate Anda</h3>
          <table className="w-full border-t text-sm">
            <tbody>
            {tests.map((test, index) => (
              <tr key={test._id} className="border-b">
                <td className="p-2 w-8">{index + 1}.</td>
                <td className="py-2">{new Date(test.created).toLocaleDateString()}</td>
                <td className="py-2">{ progress(test) }</td>
                <td className="py-2 text-right">
                  <Link href={`/gmate/${test._id}`}>
                    <a className={btn}>Kerjakan</a>
                  </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={async function mulai(event) {
        try {
          mutateUser(
            await fetchJson('/api/post?q=new-test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: user._id }),
            }).then(data => {
              console.log(data)
              router.push(`/gmate/${data.test_id}`)
            })
          )
          // router.push('/gmate')
        } catch (error) {
          console.log(error);
        }
      }}
      >New Test</button>
    </div>
  )
}