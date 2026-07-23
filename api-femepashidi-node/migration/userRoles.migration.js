import { db } from '../db/mongoClient.js'

// Los `users` creados antes del sistema de roles no tienen `role`. auth.service.js
// ya hace fallback a 'admin' en el JWT, así que esta migración no es urgente para
// que el login siga funcionando; es solo para dejar el dato explícito en la BD
// (útil para futuras vistas admin que listen usuarios por rol).
const backfillAdminRole = async ({ dryRun = true } = {}) => {
  const summary = {
    dryRun,
    usersWithoutRole: 0,
    usersUpdated: 0,
  }

  const usersWithoutRole = await db
    .collection('users')
    .find({ role: { $exists: false } })
    .toArray()

  summary.usersWithoutRole = usersWithoutRole.length

  if (dryRun) {
    return summary
  }

  const result = await db
    .collection('users')
    .updateMany({ role: { $exists: false } }, { $set: { role: 'admin' } })

  summary.usersUpdated = result.modifiedCount

  return summary
}

export { backfillAdminRole }
