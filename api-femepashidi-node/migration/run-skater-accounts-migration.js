import { client } from '../db/mongoClient.js'
import { splitSharedAccounts, linkSkaterAccounts } from './skaterAccounts.migration.js'

const args = process.argv.slice(2)
const dryRun = !args.includes('--run')
const sendEmails = !args.includes('--no-email')

const main = async () => {
  await client.connect()
  console.log(dryRun ? '=== DRY RUN: sin escrituras ni correos ===' : '=== EJECUTANDO: escribiendo en la BD real ===')
  if (!dryRun && sendEmails) {
    console.log('Se enviarán correos de activación reales a los padres/patinadores.')
  }

  // Paso 1: convierte accountIds[] (muchos-a-muchos, esquema viejo) a
  // accountId (1:1). Idempotente — una vez migrado un patinador ya no tiene
  // `accountIds`, así que correrlo de nuevo no hace nada con él.
  console.log('--- Paso 1: dividir cuentas compartidas (accountIds -> accountId) ---')
  const splitSummary = await splitSharedAccounts({ dryRun })
  console.log(JSON.stringify(splitSummary, null, 2))

  if (splitSummary.conflictsNeedingNewAccount.length > 0) {
    console.log(
      `AVISO: ${splitSummary.conflictsNeedingNewAccount.length} patinador(es) se quedaron sin cuenta ` +
      'por compartir cuenta con un hermano. Necesitan un correo propio en su documento antes de que ' +
      'el paso 2 pueda darles de alta una cuenta.'
    )
  }

  // Paso 2: crea/vincula una cuenta por cada patinador que aún no tenga accountId.
  console.log('--- Paso 2: vincular patinadores sin cuenta (uno por correo) ---')
  const linkSummary = await linkSkaterAccounts({ dryRun, sendEmails })
  console.log(JSON.stringify(linkSummary, null, 2))

  if (linkSummary.emailConflicts.length > 0) {
    console.log(
      `AVISO: ${linkSummary.emailConflicts.length} patinador(es) no se pudieron vincular porque su ` +
      'correo ya pertenece a la cuenta de otro patinador. Hay que asignarles un correo propio y volver a correr esto.'
    )
  }

  await client.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
