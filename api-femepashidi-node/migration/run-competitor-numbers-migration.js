import { client } from '../db/mongoClient.js'
import { assignCompetitorNumbers } from './competitorNumbers.migration.js'

const args = process.argv.slice(2)
const dryRun = !args.includes('--run')

const main = async () => {
  await client.connect()
  console.log(dryRun ? '=== DRY RUN: sin escrituras ===' : '=== EJECUTANDO: escribiendo en la BD real ===')

  const summary = await assignCompetitorNumbers({ dryRun })
  console.log(JSON.stringify(summary, null, 2))

  await client.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
