import { db } from '../db/mongoClient.js'

// Idempotente: solo toca documentos cuyo numero_competidor todavía trae el
// prefijo "FMP-" (formato viejo). Una vez migrado un patinador, correrlo de
// nuevo no le hace nada.
const stripCompetitorNumberPrefix = async ({ dryRun = true } = {}) => {
  const summary = {
    dryRun,
    eligibleSkaters: 0,
    numbersUpdated: 0,
  }

  const eligible = await db
    .collection('skaters')
    .find({ numero_competidor: { $regex: /^FMP-/ } })
    .sort({ _id: 1 })
    .toArray()

  summary.eligibleSkaters = eligible.length

  if (dryRun) {
    return summary
  }

  for (const skater of eligible) {
    const numero = skater.numero_competidor.replace(/^FMP-/, '')
    await db.collection('skaters').updateOne(
      { _id: skater._id },
      { $set: { numero_competidor: numero } }
    )
    summary.numbersUpdated++
  }

  return summary
}

export { stripCompetitorNumberPrefix }
