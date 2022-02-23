import fetchJson from "lib/fetchJson";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import useUser from "lib/useUser";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import Link from "next/link";

export default function Gmate({ user }) {
  const { mutateUser } = useUser({
    redirectTo: '/login',
  })
  const router = useRouter()

  return (
    <Layout>
      <h1 className='text-5xl text--center text-sky-700 tracking-tight font-bold my-12'>
        Gmate<span className='text-gray-400'>Standalone</span>
      </h1>
      <div className='text-center'>

        <p className='text-xl mb-10'>
          <span className="font-bold">
            {user.username}
          </span>
          <Link href="/">
            <a className="rounded-lg border-2 border-sky-600 hover:bg-sky-600 text-sky-500 hover:text-white font-semibold px-6 py-2 ml-4">
              Home
            </a>
          </Link>

          <Link href="/api/logout">
          <a
            className="rounded-lg border-2 border-sky-600 hover:bg-sky-600 text-sky-500 hover:text-white font-semibold px-6 py-2 ml-4"
            onClick={async (e) => {
              e.preventDefault()
              mutateUser(
                await fetchJson('/api/logout', { method: 'POST' }),
                false
              )
              router.push('/login')
            }}
          >
            Logout
          </a>
          </Link>
        </p>
      </div>

    </Layout>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false, login: "", avatarUrl: "" },
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);