import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { COOKIE_NAME } from "./config";

// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// export function withSession(handler) {
//   return withIronSessionApiRoute(handler, {
//       password: process.env.COOKIE_PASSWORD,
//       cookieName: COOKIE_NAME,
//       sessionOptions,
//   })
// }

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}