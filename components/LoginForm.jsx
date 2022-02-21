export default function LoginForm({ errorMessage, onSubmit }) {
  const labelClass = "text-sm text-sky-500 uppercase"
  const inputClass = "p-2 mt-1 mb-2 rounded border border-gray-300 focus:ring-2 focus:ring-sky-100 focus:border-sky-300 text-sky-700"

  return (
    <form
      onSubmit={onSubmit}
      className=""
    >
      <label className="flex flex-col">
        <span className={labelClass}>Username</span>
        <input
        type="text"
        name="username"
        className={inputClass}
        required autoFocus />
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
        className="w-full rounded border border-gray-400 h-11 mt-3"
      >
        Login
      </button>

      {errorMessage && <p className="text-sm text-red-600 mt-4">{errorMessage}</p>}
    </form>
  );
}
