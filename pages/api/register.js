import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { connect } from "lib/database";
import { createPasswordHash } from "lib/utils";
import { ObjectId } from "mongodb";

export default withIronSessionApiRoute(async (req, res) => {
  const { fullname, username, password } = await req.body;
  console.log(fullname, username, password);

  try {
    const { db } = await connect()

    // Cek apakah username sudah terpakai
    const found = await db.collection('users').findOne({ username: username })
    if (found) {
      res.status(500).json({ message: 'Username sudah terpakai' });
    }

    const id = new ObjectId()
    const hash = createPasswordHash(password)

    const created = await db.collection('users').insertOne({
      _id: id,
      fullname: fullname,
      username: username,
      isAdmin: false,
      hash: hash,
    })
    // console.log('created', created);

    if (created.acknowledged === true) {
      const user = {
        _id: id.toString(),
        isLoggedIn: true,
        username: username,
        fullname: fullname,
        isAdmin: false,
      }
      req.session.user = user
      await req.session.save()
      res.json(user)
    } else {
      throw new Error('Gagal...')
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
}, sessionOptions);
