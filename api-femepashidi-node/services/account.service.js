import path from 'path'
import Boom from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { db } from '../db/mongoClient.js'
import config from '../config.js'
import { sendMail } from '../utils/sendMail.js'

// Both the first-time activation link (sent by the migration script) and a
// forgot-password link ultimately do the same thing: let whoever holds the
// link set a password. One endpoint/token shape handles both.
const SET_PASSWORD_PURPOSES = ['activate-account', 'reset-account-password']

class Account {
  constructor() {}

  async login(data) {
    try {
      const { email, password } = data
      if (!email || !password) {
        throw Boom.badData('Correo y contraseña son necesarios')
      }

      const account = await db.collection('accounts').findOne({ email: email.toLowerCase() })

      if (!account || !account.password) {
        throw Boom.unauthorized('Correo o contraseña incorrectos')
      }

      const isPasswordValid = await bcrypt.compare(password, account.password)
      if (!isPasswordValid) {
        throw Boom.unauthorized('Correo o contraseña incorrectos')
      }

      const payload = { accountId: account._id, email: account.email }
      return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' })
    } catch (error) {
      if (Boom.isBoom(error)) throw error
      throw Boom.badImplementation('Error al iniciar sesión', error)
    }
  }

  async forgotPassword({ email }) {
    try {
      if (!email) {
        throw Boom.badData('El correo es necesario')
      }

      const account = await db.collection('accounts').findOne({ email: email.toLowerCase() })
      if (!account) {
        throw Boom.notFound('No se encontró una cuenta con ese correo')
      }

      const token = jwt.sign(
        { accountId: account._id, email: account.email, purpose: 'reset-account-password' },
        config.jwtSecret,
        { expiresIn: '1h' }
      )
      const resetLink = `${config.urlApp}/activar-cuenta?token=${token}`

      await sendMail({
        to: account.email,
        subject: 'Restablecer contraseña FEMEPASHIDI',
        data: { name: account.email, resetLink },
        templateEmail: 'restartPass',
        attachments: [
          {
            filename: 'samartech',
            path: path.join('emails/samartech.png'),
            cid: 'logo_empresa',
          },
        ],
      })

      return 'Se ha enviado un enlace para restablecer tu contraseña a tu correo.'
    } catch (error) {
      if (Boom.isBoom(error)) throw error
      throw Boom.badImplementation('Error al solicitar el restablecimiento', error)
    }
  }

  async setPassword(token, password) {
    try {
      if (!token || !password) {
        throw Boom.badData('El token y la contraseña son necesarios')
      }

      let decoded
      try {
        decoded = jwt.verify(token, config.jwtSecret)
      } catch (error) {
        throw Boom.unauthorized('El enlace es inválido o ha expirado')
      }

      if (!decoded.accountId || !SET_PASSWORD_PURPOSES.includes(decoded.purpose)) {
        throw Boom.unauthorized('El enlace no es válido para esta operación')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const update = await db.collection('accounts').updateOne(
        { _id: new ObjectId(decoded.accountId) },
        { $set: { password: hashedPassword, status: 'active', updatedAt: new Date() } }
      )

      if (update.matchedCount === 0) {
        throw Boom.notFound('La cuenta no existe')
      }

      return 'Contraseña actualizada, ya puedes iniciar sesión'
    } catch (error) {
      if (Boom.isBoom(error)) throw error
      throw Boom.badImplementation('Error al establecer la contraseña', error)
    }
  }

  async getMe(accountId) {
    try {
      const account = await db.collection('accounts').findOne(
        { _id: new ObjectId(accountId) },
        { projection: { password: 0 } }
      )

      if (!account) {
        throw Boom.notFound('La cuenta no existe')
      }

      // Relación 1:1: cada cuenta tiene a lo más un patinador vinculado.
      const skater = await db.collection('skaters').findOne({ accountId: new ObjectId(accountId) })

      return { account, skater }
    } catch (error) {
      if (Boom.isBoom(error)) throw error
      throw Boom.badImplementation('Error al obtener la cuenta', error)
    }
  }

}

export default Account
