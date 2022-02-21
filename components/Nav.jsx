import fetchJson from "lib/fetchJson"
import useUser from "lib/useUser"
// import { useRouter } from "next/router"

export default function Nav({ user }) {
  const { mutateUser } = useUser()
  // const router = useRouter()
  
  return (
    <div className="border-t border-b border-sky-100 -mx-5 px-5 py-2">
      {/* User belum login */}
      {(!user || !user.isLoggedIn) && (
        <p className="text-center text-gray-400">
          Silakan login atau register ...
        </p>
      )}
      
      {/* User sudah login */}
      {user?.isLoggedIn && (
        <div className="flex space-x-4 items-center">
          <div className='flex-grow'>
            <span className="text-sky-600 font-semibold">{user.fullname}</span>
          </div>
          <div>
            <a
              className="rounded bg-gray-200 border border-white hover:border-gray-400 hover:shadow-sm text-sm text-gray-500 px-2 py-1"
              href="/api/logout"
              onClick={async (e) => {
                e.preventDefault()
                mutateUser(
                  await fetchJson('/api/logout', { method: 'POST' }),
                  false
                )
                // router.push('/login')
              }}
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  )
}