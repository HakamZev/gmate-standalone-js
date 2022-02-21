import ForHome from 'components/Home'
import Layout from 'components/Layout'
import LoginForm from 'components/LoginForm'
import Masthead from 'components/Masthead'
import Nav from 'components/Nav'
import Register from 'components/Register'
import fetchJson, { FetchError } from 'lib/fetchJson'
import useUser from 'lib/useUser'
import { useState } from 'react'

export default function Home() {
  const { user, mutateUser } = useUser()

  const [active, setActive] = useState('login')
  const [errorMsg, setErrorMsg] = useState("");

  const btn = 'block border-b-4 border-white hover:border-gray-300 pb-1'
  const btnActive = 'block border-b-4 border-sky-500 pb-1'

  return (
    <Layout title="GMATE">
      <Masthead />

      <Nav user={user} />

      {/* User belum login */}
      {(!user || !user.isLoggedIn) && (
        <div className="rounded border border-gray-300 max-w-sm mx-auto p-4 my-10">
          <div className="flex space-x-5 mb-6">
            <button
              className={active == 'login' ? btnActive : btn}
              onClick={e => setActive('login')}
            >Login</button>
            <button
              className={active == 'register' ? btnActive : btn}
              onClick={e => setActive('register')}
            >Register</button>
          </div>

          {active == 'register' && <Register
            errorMessage={errorMsg}
            onSubmit={async function handleRegister(event) {
              event.preventDefault()
              const body = {
                fullname: event.currentTarget.fullname.value,
                username: event.currentTarget.username.value,
                password: event.currentTarget.password.value,
              }

              try {
                mutateUser(
                  await fetchJson('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                  })
                )
              } catch (error) {
                if (error instanceof FetchError) {
                  setErrorMsg(error.data.message)
                  console.log("ERR", error.data.message);

                } else {
                  console.error('An unexpected error happened:', error)
                }
              }
            }}
          />}

          {active == 'login' && <LoginForm
            errorMessage={errorMsg}
            onSubmit={async function handleSubmit(event) {
              event.preventDefault();
              setErrorMsg("")

              const body = {
                username: event.currentTarget.username.value,
                password: event.currentTarget.password.value,
              };

              try {
                mutateUser(
                  await fetchJson("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  }),
                );
              } catch (error) {
                if (error instanceof FetchError) {
                  setErrorMsg(error.data.message);
                } else {
                  console.error("An unexpected error happened:", error);
                }
              }
            }}
          />}
        </div>
      )}

    </Layout>
  )
}
