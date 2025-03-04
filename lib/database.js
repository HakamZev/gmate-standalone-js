import { MongoClient } from 'mongodb';
// import { DATABASE_NAME } from './config';

const DATABASE_NAME = "gmate_standalone";

// MONGO_LOCAL MONGO_AWSGM2
const uri = process.env.MONGO_URI
  // ? process.env.MONGO_LOCAL
  // : process.env.MONGO_AWSGM2;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export async function connect() {
  if (client) await client.connect(); // v.4.0.0

  const db = client.db(DATABASE_NAME);

  return { db, client }
}
