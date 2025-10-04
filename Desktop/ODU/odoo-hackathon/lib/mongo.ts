import { MongoClient } from "mongodb"

declare global {
  // allow global variable in dev to persist across module reloads
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI
if (!uri) throw new Error("Please define the MONGODB_URI environment variable inside .env.local")

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

client = new MongoClient(uri, options)
clientPromise = client.connect()

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) global._mongoClientPromise = clientPromise
  clientPromise = global._mongoClientPromise
}

export default clientPromise
