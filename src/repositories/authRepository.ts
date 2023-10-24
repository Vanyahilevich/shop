import {ObjectId} from "mongodb";
import crypto from "crypto";
import {nanoid} from "nanoid";

const authRepository = {
  getUserByUserEmail: async (db, email) => {
    return db.collection("users").findOne({email})
  },
  getUserBySessionId: async (db, sessionId) => {
    const session = await db.collection("sessions").findOne({sessionId: sessionId})

    if (!session) {
      return
    }
    return db.collection("users").findOne({_id: new ObjectId(session.userId)})
  },
  createUser: async (db, {username, surname, email, password, imageURL}) => {
    const {insertedId} = await db.collection("users").insertOne({
      username,
      surname,
      email,
      password: crypto.createHash('sha256').update(password).digest('hex'),
      imageURL: imageURL ? imageURL : undefined,
    })
    return insertedId
  },
  createSession: async (db, userId) => {
    const sessionId = nanoid()
    await db.collection("sessions").insertOne({
      userId,
      sessionId,
    })
    return sessionId
  },
  deleteSession: async (db, sessionId) => {
    await db.collection("sessions").deleteOne({sessionId})
  }
}
module.exports = authRepository
