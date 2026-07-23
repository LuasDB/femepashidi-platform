import express from 'express'
import Notifications from '../services/notifications.service.js'
import { authenticate, requireStaffOrAccount } from '../middlewares/authenticate.js'

const router = express.Router()
const notifications = new Notifications()

router.get('/', authenticate, requireStaffOrAccount, async(req, res, next) => {
  try {
    const data = await notifications.listForAuth(req.auth)
    res.status(200).json({
      success:true,
      ...data,
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/read-all', authenticate, requireStaffOrAccount, async(req, res, next) => {
  try {
    const result = await notifications.markAllRead(req.auth)
    res.status(200).json({
      success:true,
      data:result,
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/read', authenticate, requireStaffOrAccount, async(req, res, next) => {
  try {
    const result = await notifications.markRead(req.params.id, req.auth)
    res.status(200).json({
      success:true,
      data:result,
    })
  } catch (error) {
    next(error)
  }
})

export default router
