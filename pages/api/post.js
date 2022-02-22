import { ObjectId } from "mongodb";
import { withSessionRoute } from "lib/session";
import { connect } from "lib/database";
import { createPasswordHash } from "lib/utils";
import { createSequence } from 'gmate-flat-module'

const ACCEPTED_QUERIES = {}

// export default withIronSessionSsr(async (req, res) => {
export default withSessionRoute(async (req, res) => {
  const user = req.session.user;

  if (!user || user.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
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


ACCEPTED_QUERIES['new-test'] = async function (req, res) {
  try {
    const { db } = await connect()
    const user_id = req.session.user._id
    console.log('user_id', user_id)
    const sekuen = createSequence()
    console.log('sekuen', sekuen)

    const doc = {
      _id: new ObjectId(),
      user_id,
      created: new Date().toISOString(),
      length: sekuen.length,
      done: 0,
      sequence: sekuen.join(' '),
      items: []
    }
    console.log('doc', doc);

    // TRICK: INSERT AND RETURN DOCUMENT
    // https://stackoverflow.com/questions/40766654/node-js-mongodb-insert-one-and-return-the-newly-inserted-document

    // const rs = await db.collection('gmate').insertOne(doc, )
    const rs = await db.collection('gmate').findOneAndUpdate(
      doc,
      {$set: {}},
      { upsert: true, returnDocument: 'after' }
    )

    if (rs.ok) {
      const id = rs.value?._id.toString()
      const user = {
        ...req.session.user,
        test_id: id,
        sequence: rs.value?.sequence,
      } // as User

      req.session.user = user
      await req.session.save()
      res.json(user)
    } else {
      throw new Error('Gagal...')
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


ACCEPTED_QUERIES['save-item'] = async function (req, res) {
  try {
    const { id, seq, bookSeq, key, text, lastTouch } = req.body
    console.log(id, seq, bookSeq, key, text);
    const { db } = await connect();
    const now = new Date()

    const rs = await db.collection('gmate').findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $inc: {
          done: 1,
        },
        $push: {
          items: {
            seq: seq + 1, // natural
            bookSeq: bookSeq,
            key: key,
            text: text,
            created: now.getTime(),
          }
        },
        $set: {
          touched: now.getTime()
        },
      },
      {
        projection: {
          items: 1,
        },
        returnDocument: 'after'
      }
    )
    const items = rs.value.items
    const lastItem = items[items.length -1]
    console.log(lastItem);

    return res.json(lastItem);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}