import express from 'express'
import CategoryConfigService from '../services/categoryConfig.service.js'
import { authenticate, requireRole } from '../middlewares/authenticate.js'

const router = express.Router()
const categoryConfig = new CategoryConfigService()

// Lectura pública: el registro de patinador (/registro) y la inscripción
// desde /cuenta calculan la categoría en el navegador sin sesión de admin.
// Solo admin puede editar la tabla de categorías.
router.get('/', async (req, res, next) => {
  try {
    const config = await categoryConfig.getConfig()
    res.status(200).json({
      success: true,
      data: config
    })
  } catch (error) {
    next(error)
  }
})

router.put('/', authenticate, requireRole(['admin']), async (req, res, next) => {
  try {
    const result = await categoryConfig.updateConfig(req.body)
    res.status(200).json({
      success: true,
      message: 'Configuración de categorías actualizada',
      data: result
    })
  } catch (error) {
    next(error)
  }
})

export default router
