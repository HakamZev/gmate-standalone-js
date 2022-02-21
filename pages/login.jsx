import React, { useEffect, useState } from "react";
import useUser from "lib/useUser";
import Layout from "components/Layout";
// import Form from "components/Form";
import LoginForm from "../components/LoginForm";
import fetchJson, { FetchError } from "lib/fetchJson";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter()
  // here we just check if user is already logged in and redirect to profile
  const { user, mutateUser } = useUser({
    redirectTo: "/gmate",
    redirectIfFound: true,
  });
  
  useEffect(() => {
    if (user?.isLoggedIn) {
      router.push('/gmate')
    }
  }, [user])

  const [errorMsg, setErrorMsg] = useState("");
  
  if (user?.isLoggedIn) return null;

  return (
    <Layout>
      <div className='text-center'>
        <h1 className='text-6xl text-center text-sky-700 font-bold my-16'>
          Gmate<span className='text-gray-400'>Standalone</span>
        </h1>

        <p className='text-xl mb-10'>
          <Link href="/">
            <a className="rounded-lg border-2 border-sky-600 hover:bg-sky-600 text-sky-500 hover:text-white font-semibold px-6 py-2">
              Home
            </a>
          </Link>
        </p>
      </div>
      <div className="login">
        <LoginForm
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault();

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
        />
      </div>
      <pre className="text-xs mt-4">{JSON.stringify(user)}</pre>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  );
}

// export const getServerSideProps = withIronSessionSsr(async function ({
//   req,
//   res,
// }) {
//   const user = req.session.user;

//   if (user.isLoggedIn) {
//     res.setHeader("location", "/gmate");
//     res.statusCode = 200;
//     res.end();
//     return {}
//     // return {
//     //   props: {
//     //     user: { isLoggedIn: false, login: "", avatarUrl: "" },
//     //   },
//     // };
//   }

//   return {
//     props: { user: req.session.user },
//   };
// },
// sessionOptions);
