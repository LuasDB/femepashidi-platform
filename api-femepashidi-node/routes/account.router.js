import express from 'express'
import Account from '../services/account.service.js'
import { authenticate, requireAccount } from '../middlewares/authenticate.js'

const router = express.Router()
const account = new Account()

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

export default router
