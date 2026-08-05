import express from 'express'
import Account from '../services/account.service.js'
import Letters from '../services/letters.service.js'
import { authenticate, requireAccount, requireRole } from '../middlewares/authenticate.js'

const router = express.Router()
const account = new Account()
const letters = new Letters()

router.post('/login', async (req, res, next) => {
  try {
    const token = await account.login(req.body)
    res.status(200).json({ success: true, message: 'Acceso', token })
  } catch (error) {
    next(error)
  }
})

router.post('/forgot-password', async (req, res, next) => {
  try {
    const message = await account.forgotPassword(req.body)
    res.status(200).json({ success: true, message })
  } catch (error) {
    next(error)
  }
})

router.post('/set-password', async (req, res, next) => {
  try {
    const { token, password } = req.body
    const message = await account.setPassword(token, password)
    res.status(200).json({ success: true, message })
  } catch (error) {
    next(error)
  }
})

router.get('/me', authenticate, requireAccount, async (req, res, next) => {
  try {
    const data = await account.getMe(req.auth.accountId)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// Cartas de permiso del propio patinador logeado, para la sección
// /cuenta/cartas-permiso (lista con estatus + descarga de la carta aprobada).
router.get('/me/letters', authenticate, requireAccount, async (req, res, next) => {
  try {
    const data = await letters.getAllByAccount(req.auth.accountId)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// Self-service: la propia cuenta logeada cambia su contraseña, verificando la
// actual. Debe ir antes de '/:id/password' para que 'me' no se interprete
// como un id de cuenta.
router.patch('/me/password', authenticate, requireAccount, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const result = await account.changeOwnPassword(req.auth.accountId, currentPassword, newPassword)
    res.status(200).json({ success: true, message: 'Contraseña actualizada', data: result })
  } catch (error) {
    next(error)
  }
})

// Admin fija la contraseña de una cuenta (patinador/padre/asociado) directamente.
router.patch('/:id/password', authenticate, requireRole(['admin']), async (req, res, next) => {
  try {
    const result = await account.resetPasswordById(req.params.id, req.body.password)
    res.status(200).json({ success: true, message: 'Contraseña actualizada', data: result })
  } catch (error) {
    next(error)
  }
})

export default router
