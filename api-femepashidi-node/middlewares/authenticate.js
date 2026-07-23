import jwt from 'jsonwebtoken'
import Boom from '@hapi/boom'
import { ObjectId } from 'mongodb'
import config from '../config.js'
import { db } from '../db/mongoClient.js'

const authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      throw Boom.unauthorized('Token no proporcionado')
    }

    const token = header.split(' ')[1]
    req.auth = jwt.verify(token, config.jwtSecret)
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(Boom.unauthorized('El token ha expirado'))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(Boom.unauthorized('Token inválido'))
    }
    next(error)
  }
}

const requireAccount = (req, res, next) => {
  if (!req.auth || !req.auth.accountId) {
    return next(Boom.forbidden('Esta ruta requiere una cuenta de patinador'))
  }
  next()
}

// Guard de rol para las cuentas admin/presidente de asociación (colección
// `users`, distinta de `accounts`/requireAccount que es para patinadores).
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.auth || !allowedRoles.includes(req.auth.role)) {
    return next(Boom.forbidden('No tienes permisos para esta acción'))
  }
  next()
}

// Para rutas compartidas entre staff (admin/presidente) y cuentas de
// patinador, como /notifications: el token de patinador no trae `role`, así
// que se distingue por la presencia de `accountId`.
const requireStaffOrAccount = (req, res, next) => {
  if (!req.auth) {
    return next(Boom.forbidden('No tienes permisos para esta acción'))
  }
  if (['admin', 'presidente_asociacion'].includes(req.auth.role) || req.auth.accountId) {
    return next()
  }
  return next(Boom.forbidden('No tienes permisos para esta acción'))
}

const requireSkaterOwnership = async (req, res, next) => {
  try {
    const curp = req.params.curp?.toUpperCase()
    const skater = await db.collection('skaters').findOne({ curp })

    if (!skater) {
      throw Boom.notFound('The CURP was not found')
    }

    const isOwner = skater.accountId?.toString() === req.auth.accountId

    if (!isOwner) {
      throw Boom.forbidden('No tienes acceso a este patinador')
    }

    req.skater = skater
    next()
  } catch (error) {
    next(error)
  }
}

// Para el rol presidente_asociacion: solo puede operar sobre patinadores de su
// propia asociación. admin pasa siempre. Deja `req.skater` cargado para que el
// handler no tenga que volver a consultarlo.
const requireSkaterAssociationAccess = async (req, res, next) => {
  try {
    const curp = req.params.curp?.toUpperCase()
    const skater = await db.collection('skaters').findOne({ curp })

    if (!skater) {
      throw Boom.notFound('The CURP was not found')
    }

    if (req.auth.role === 'presidente_asociacion') {
      const ownsAssociation = skater.asociacion?._id?.toString() === req.auth.associationId
      if (!ownsAssociation) {
        throw Boom.forbidden('No tienes acceso a patinadores de otra asociación')
      }
    }

    req.skater = skater
    next()
  } catch (error) {
    next(error)
  }
}

// Mismo criterio que requireSkaterAssociationAccess pero para inscripciones a
// competencias (colección `register`), donde la asociación va embebida en
// `register.association`.
const requireRegisterAssociationAccess = async (req, res, next) => {
  try {
    const register = await db.collection('register').findOne({ _id: new ObjectId(req.params.id) })

    if (!register) {
      throw Boom.notFound('El registro no existe')
    }

    if (req.auth.role === 'presidente_asociacion') {
      const ownsAssociation = register.association?._id?.toString() === req.auth.associationId
      if (!ownsAssociation) {
        throw Boom.forbidden('No tienes acceso a inscripciones de otra asociación')
      }
    }

    req.registerEntry = register
    next()
  } catch (error) {
    next(error)
  }
}

// Mismo criterio que requireSkaterAssociationAccess/requireRegisterAssociationAccess
// pero para cartas de permiso (colección `letters`), donde la asociación va
// embebida en `letter.user.asociacion`.
const requireLetterAssociationAccess = async (req, res, next) => {
  try {
    const letter = await db.collection('letters').findOne({ _id: new ObjectId(req.params.id) })

    if (!letter) {
      throw Boom.notFound('La carta no existe')
    }

    if (req.auth.role === 'presidente_asociacion') {
      const ownsAssociation = letter.user?.asociacion?._id?.toString() === req.auth.associationId
      if (!ownsAssociation) {
        throw Boom.forbidden('No tienes acceso a cartas de otra asociación')
      }
    }

    req.letter = letter
    next()
  } catch (error) {
    next(error)
  }
}

export {
  authenticate,
  requireAccount,
  requireSkaterOwnership,
  requireRole,
  requireStaffOrAccount,
  requireSkaterAssociationAccess,
  requireRegisterAssociationAccess,
  requireLetterAssociationAccess,
}
