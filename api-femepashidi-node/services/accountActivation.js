import path from 'path'
import jwt from 'jsonwebtoken'
import { db } from '../db/mongoClient.js'
import config from '../config.js'
import { sendMail } from '../utils/sendMail.js'

const ACTIVATION_TOKEN_EXPIRY = '7d'

// Shared by the migration backfill and the claim-approval flow: both end up
// needing to email a brand-new (or newly-linked) account its first
// "set your password" link.
const sendActivationEmail = async (account) => {
  const token = jwt.sign(
    { accountId: account._id, email: account.email, purpose: 'activate-account' },
    config.jwtSecret,
    { expiresIn: ACTIVATION_TOKEN_EXPIRY }
  )
  const activationLink = `${config.urlApp}/activar-cuenta?token=${token}`

  const result = await sendMail({
    to: account.email,
    subject: 'Activa tu cuenta FEMEPASHIDI',
    data: { activationLink },
    templateEmail: 'activateAccount',
    attachments: [
      {
        filename: 'encabezado',
        path: path.join('emails/encabezado.png'),
        cid: 'encabezado',
      },
    ],
  })

  if (result.success) {
    await db.collection('accounts').updateOne(
      { _id: account._id },
      { $set: { activationEmailSentAt: new Date() } }
    )
  }

  return result
}

export { sendActivationEmail }
