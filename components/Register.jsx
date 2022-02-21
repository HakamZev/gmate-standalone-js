export default function Register({ errorMessage, onSubmit }) {
  const labelClass = "text-sm text-sky-500 uppercase"
  const inputClass = "focus:ring-2 focus:ring-sky-100 focus:border-sky-300 text-sky-700"

  return (
    <form
      onSubmit={onSubmit}
      className="font-mediums"
    >
      <label className="flex flex-col">
        <span className={labelClass}>Fullname</span>
        <input
        type="text"
        name="fullname"
        className={inputClass}
        required autoFocus />
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>Username</span>
        <input
        type="text"
        name="username"
        className={inputClass}
        required />
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>Password</span>
        <input
        type="password"
        name="password"
        className={inputClass}
        required />
      </label>

      <button type="submit"
        className="w-full rounded border border-gray-400 h-11"
      >
        Register
      </button>

      {errorMessage && <p className="text-sm text-red-600 mt-4">{errorMessage}</p>}

      {/* Contoh style block dalam JSX */}
      <style jsx>{`
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </form>
  );
}
