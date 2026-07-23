import Boom from '@hapi/boom'
import { db } from '../db/mongoClient.js'
import { ObjectId } from 'mongodb'
import { getIo } from './socket.js'

// audience:'admin' ve todo; audience:'association' está acotada a
// associationId (igual que requireSkaterAssociationAccess); audience:'skater'
// está acotada a accountId, para la campana de /cuenta.
class Notifications {
  async create({ audience, associationId, accountId, type, title, message, link }) {
    const doc = {
      audience,
      associationId: associationId ? new ObjectId(associationId) : null,
      accountId: accountId ? new ObjectId(accountId) : null,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: new Date(),
    }

    const result = await db.collection('notifications').insertOne(doc)
    const notification = { ...doc, _id: result.insertedId }

    const io = getIo()
    if (io) {
      const room = audience === 'admin'
        ? 'admin'
        : audience === 'skater'
          ? `skater:${doc.accountId.toString()}`
          : `association:${doc.associationId.toString()}`
      io.to(room).emit('notification', notification)
    }

    return notification
  }

  async listForAuth(auth, { limit = 30 } = {}) {
    const filter = this._audienceFilter(auth)

    const notifications = await db.collection('notifications')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    const unreadCount = await db.collection('notifications').countDocuments({ ...filter, read: false })

    return { notifications, unreadCount }
  }

  async markRead(id, auth) {
    const filter = { ...this._audienceFilter(auth), _id: new ObjectId(id) }
    const result = await db.collection('notifications').updateOne(filter, { $set: { read: true } })

    if (result.matchedCount === 0) {
      throw Boom.notFound('Notificación no encontrada')
    }

    return { updated: true }
  }

  async markAllRead(auth) {
    const filter = { ...this._audienceFilter(auth), read: false }
    await db.collection('notifications').updateMany(filter, { $set: { read: true } })
    return { updated: true }
  }

  _audienceFilter(auth) {
    if (auth.role === 'admin') {
      return { audience: 'admin' }
    }
    if (auth.role === 'presidente_asociacion') {
      return { audience: 'association', associationId: new ObjectId(auth.associationId) }
    }
    // Token de cuenta de patinador: no trae `role`, trae `accountId`.
    return { audience: 'skater', accountId: new ObjectId(auth.accountId) }
  }
}

export default Notifications
