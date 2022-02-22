import Head from 'next/head'

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title || "Gmate Standalone"}</title>
      </Head>
      <main className="bg-sky-50 antialiased text-gray-700">
        <div className="bg-white min-h-screen max-w-2xl mx-auto px-5 shadow-md">
          {children}
        </div>
      </main>
    </>
  )
}