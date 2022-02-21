import useUser from "lib/useUser";
import { useRouter } from "next/router";

export default function ForHome() {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  
  return (
    <div>
      <h1>FOR HOME</h1>
      {user?.isLoggedIn === false && (
        <pre>USER FALSE {JSON.stringify(user, null, 2)}</pre>
      )}
      {user?.isLoggedIn === true && (
        <pre>USER {JSON.stringify(user, null, 2)}</pre>
      )}
    </div>
  )
}