import { ObjectId } from "mongodb";
import { withSessionRoute } from "lib/session";
import { connect } from "lib/database";
import { createPasswordHash } from "lib/utils";

const ACCEPTED_QUERIES = {}

// export default withIronSessionSsr(async (req, res) => {
export default withSessionRoute(async (req, res) => {
    // const user = req.session.get("user");
    const user = req.session.user;
    // console.log('SESSION', req.session)

    // console.log(createPasswordHash('muslax'))
    // const verified =

  if (!user || user.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { q } = req.query;
  console.log(new Date(), q);

  if (!q || !ACCEPTED_QUERIES[q]) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const task = ACCEPTED_QUERIES[q];
  return task (req, res);
})


ACCEPTED_QUERIES['users'] = async function (req, res) {
  try {
    const { db } = await connect();
    const rs = await db.collection('users').find({ _id: ObjectId('6211ccf16b3d39b491af532f') }).toArray();
    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

ACCEPTED_QUERIES['tests'] = async function (req, res) {
  try {
    const user = req.session.user
    const { db } = await connect();
    const rs = await db.collection('gmate').find({ user_id: user._id }).toArray();
    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

ACCEPTED_QUERIES['my-tests'] = async function (req, res) {
  try {
    const user = req.session.user
    const { db } = await connect();
    const rs = await db.collection('gmate').find({ user_id: user._id }).toArray();
    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}