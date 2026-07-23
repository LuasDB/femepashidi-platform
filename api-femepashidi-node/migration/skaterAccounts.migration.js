import { db } from '../db/mongoClient.js'
import { sendActivationEmail } from '../services/accountActivation.js'

// Paso 1 (una sola vez): convierte el viejo esquema muchos-a-muchos
// (`skaters.accountIds: [ObjectId]`) al nuevo 1:1 (`skaters.accountId: ObjectId`).
// Cuando una cuenta ya tenía más de un patinador vinculado (hermanos con el
// mismo correo, el caso que el modelo anterior soportaba a propósito), se
// queda con el primero; el resto pierde el vínculo y queda reportado en
// `conflictsNeedingNewAccount` para que se le dé de alta con su propio correo
// (vía el paso 2, una vez que tenga un `correo` distinto en su documento).
const splitSharedAccounts = async ({ dryRun = true } = {}) => {
  const summary = {
    dryRun,
    skatersWithAccountIds: 0,
    migratedCleanly: 0,
    conflictsNeedingNewAccount: [],
  }

  const skaters = await db
    .collection('skaters')
    .find({ accountIds: { $exists: true, $ne: [] } })
    .sort({ _id: 1 })
    .toArray()

  summary.skatersWithAccountIds = skaters.length

  const claimedBy = new Map()

  for (const skater of skaters) {
    const firstAccountId = skater.accountIds[0]
    if (!firstAccountId) continue

    const key = firstAccountId.toString()

    if (!claimedBy.has(key)) {
      claimedBy.set(key, skater.curp)
      summary.migratedCleanly++
      if (!dryRun) {
        await db.collection('skaters').updateOne(
          { curp: skater.curp },
          { $set: { accountId: firstAccountId }, $unset: { accountIds: '' } }
        )
      }
    } else {
      summary.conflictsNeedingNewAccount.push({
        curp: skater.curp,
        contestedAccountId: key,
        keptByCurp: claimedBy.get(key),
      })
      if (!dryRun) {
        await db.collection('skaters').updateOne(
          { curp: skater.curp },
          { $unset: { accountIds: '' } }
        )
      }
    }
  }

  return summary
}

// Paso 2 (se puede correr repetidas veces): a cada patinador sin cuenta
// todavía se le crea/vincula una cuenta usando su propio `correo`. Bajo 1:1
// dos patinadores con el mismo correo YA NO pueden compartir cuenta como
// antes — si el correo ya está tomado por la cuenta de otro patinador, se
// reporta como conflicto en vez de vincularlo mal; hay que corregir el correo
// de uno de los dos (asignarle uno propio) antes de volver a correr esto.
const linkSkaterAccounts = async ({ dryRun = true, sendEmails = true } = {}) => {
  const summary = {
    dryRun,
    sendEmails,
    skatersEligible: 0,
    accountsCreated: 0,
    accountsLinkedExisting: 0,
    skatersSkippedNoEmail: 0,
    skatersSkippedEmailConflict: 0,
    emailConflicts: [],
    activationEmailsSent: 0,
    emailErrors: [],
  }

  await db.collection('accounts').createIndex({ email: 1 }, { unique: true })
  await db.collection('skaters').createIndex({ accountId: 1 })

  const skaters = await db
    .collection('skaters')
    .find({ accountId: { $exists: false } })
    .sort({ _id: 1 })
    .toArray()

  for (const skater of skaters) {
    const email = (skater.correo || '').toLowerCase().trim()
    if (!email) {
      summary.skatersSkippedNoEmail++
      continue
    }

    let account = await db.collection('accounts').findOne({ email })

    if (account) {
      const alreadyLinkedTo = await db.collection('skaters').findOne({ accountId: account._id })
      if (alreadyLinkedTo && alreadyLinkedTo.curp !== skater.curp) {
        summary.skatersSkippedEmailConflict++
        summary.emailConflicts.push({
          email,
          curp: skater.curp,
          alreadyLinkedCurp: alreadyLinkedTo.curp,
        })
        continue
      }
      summary.accountsLinkedExisting++
    } else {
      summary.accountsCreated++
      if (!dryRun) {
        const inserted = await db.collection('accounts').insertOne({
          email,
          password: null,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          activationEmailSentAt: null,
        })
        account = { _id: inserted.insertedId, email, activationEmailSentAt: null }
      }
    }

    summary.skatersEligible++

    if (dryRun || !account) continue

    await db.collection('skaters').updateOne(
      { curp: skater.curp },
      { $set: { accountId: account._id } }
    )

    if (!sendEmails || account.activationEmailSentAt) continue

    const result = await sendActivationEmail(account)

    if (result.success) {
      summary.activationEmailsSent++
    } else {
      summary.emailErrors.push({ email, error: result.error })
    }
  }

  return summary
}

export { splitSharedAccounts, linkSkaterAccounts }
