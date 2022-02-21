import Head from 'next/head'

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title || "Gmate Standalone"}</title>
      </Head>
      <main className="bg-sky-100 antialiased">
        <div className="bg-white min-h-screen max-w-2xl mx-auto px-5">
          {children}
        </div>
      </main>
    </>
  )
}