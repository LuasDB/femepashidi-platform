import { db } from '../db/mongoClient.js'

const PREFIX = 'FMP'
const PAD_LENGTH = 6
const COUNTER_ID = 'numero_competidor'

// Atomic counter (unlike letters.service.js's folio, which uses
// countDocuments()+1 and can race under concurrent approvals).
const nextCompetitorNumber = async () => {
  const counter = await db.collection('counters').findOneAndUpdate(
    { _id: COUNTER_ID },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  )

  return `${PREFIX}-${String(counter.seq).padStart(PAD_LENGTH, '0')}`
}

export { nextCompetitorNumber }
