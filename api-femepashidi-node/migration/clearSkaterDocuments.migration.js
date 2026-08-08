import { db } from '../db/mongoClient.js'

// Los PDFs de acta/CURP vivían en uploads-private/, fuera del único volumen
// persistente que Railway monta por servicio (uploads/), así que se perdían
// en cada redeploy aunque `skaters.documentos` siguiera apuntando a un path
// que ya no existe en disco (ver commit que movió el storage a uploads/private/).
// Esta migración limpia ese campo en todos los patinadores para que /cuenta
// les pida volver a subir sus documentos con el storage ya corregido.
// Idempotente: solo toca documentos que todavía tienen `documentos`.
const clearSkaterDocuments = async ({ dryRun = true } = {}) => {
  const summary = {
    dryRun,
    skatersWithDocumentos: 0,
    documentosCleared: 0,
  }

  const eligible = await db
    .collection('skaters')
    .find({ documentos: { $exists: true } })
    .sort({ _id: 1 })
    .toArray()

  summary.skatersWithDocumentos = eligible.length

  if (dryRun) {
    return summary
  }

  for (const skater of eligible) {
    await db.collection('skaters').updateOne(
      { _id: skater._id },
      { $unset: { documentos: '' } }
    )
    summary.documentosCleared++
  }

  return summary
}

export { clearSkaterDocuments }
