import { db } from '../db/mongoClient.js'
import { nextCompetitorNumber } from '../services/competitorNumber.js'

// Ordered by _id (Mongo's own creation-time-ordered id) rather than the
// skater's `createAt` field, since that field is only set client-side on
// registration and isn't guaranteed to exist or be well-formed on every doc.
const assignCompetitorNumbers = async ({ dryRun = true } = {}) => {
  const summary = {
    dryRun,
    eligibleSkaters: 0,
    numbersAssigned: 0,
  }

  const eligible = await db
    .collection('skaters')
    .find({ verificacion: true, numero_competidor: { $exists: false } })
    .sort({ _id: 1 })
    .toArray()

  summary.eligibleSkaters = eligible.length

  if (dryRun) {
    return summary
  }

  for (const skater of eligible) {
    const numero = await nextCompetitorNumber()
    await db.collection('skaters').updateOne(
      { _id: skater._id },
      { $set: { numero_competidor: numero } }
    )
    summary.numbersAssigned++
  }

  return summary
}

export { assignCompetitorNumbers }
