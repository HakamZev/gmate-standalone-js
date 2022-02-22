export default function Masthead({ title }) {
  return (
    <div className="py-5">
      <h1 className='text-3xl text-center text-sky-700 tracking-tight font-bold'>
        {title && title}
        {!title && (
          <>
            Gmate<span className='text-gray-400'>Standalone</span>
          </>
        )}
      </h1>
    </div>
  )
}