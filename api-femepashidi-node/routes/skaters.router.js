import express from 'express'
import fs from 'fs'
import Boom from '@hapi/boom'
import Skaters from '../services/skaters.service.js'
import uploadFiles from '../middlewares/multer-upload-files.js'
import upload, { uploadSkaterRegistration } from '../configurations/multer-config.js'
import {
  authenticate,
  requireAccount,
  requireSkaterOwnership,
  requireRole,
  requireSkaterAssociationAccess,
} from '../middlewares/authenticate.js'

const DOCUMENT_TYPES = ['actaNacimiento', 'curpDoc']

const router = express.Router()
const skaters = new Skaters()

// Autoservicio: un patinador (o la cuenta vinculada a él) viendo/editando su propia información.
// Rutas separadas de GET/PATCH /:curp, que siguen abiertas hoy porque las usan
// flujos públicos ya en producción (Inscripción, Cartas de Permiso, panel admin).
router.get('/me/:curp', authenticate, requireAccount, requireSkaterOwnership, async(req, res, next)=>{
  try {
    res.status(200).json({
      success:true,
      data:req.skater
    })
  } catch (error) {
    next(error)
  }
})

router.patch(
  '/me/:curp',
  authenticate,
  requireAccount,
  requireSkaterOwnership,
  upload('skaters').fields([{ name: 'foto', maxCount: 1 }]),
  async(req, res, next)=>{
    try {
      const file = req.files?.foto?.[0]
      const previousImg = req.skater.img

      const updateOne = await skaters.updateOwnData(req.skater.curp, req.body, file)

      if(file && previousImg?.path && fs.existsSync(previousImg.path)){
        fs.unlinkSync(previousImg.path)
      }

      res.status(200).json({
        success:true,
        message:'Información actualizada',
        data:updateOne
      })
    } catch (error) {
      next(error)
    }
  }
)

// Registro desde cero: reemplaza al viejo /new-skater/:collection (que daba
// de alta un patinador sin ninguna cuenta). Público, sin auth, porque quien
// llega aquí todavía no tiene cuenta — la crea en esta misma llamada.
router.post(
  '/register',
  uploadSkaterRegistration().fields([
    { name: 'foto', maxCount: 1 },
    { name: 'actaNacimiento', maxCount: 1 },
    { name: 'curpDoc', maxCount: 1 },
  ]),
  async(req, res, next)=>{
    try {
      const result = await skaters.registerWithAccount(req.files, req.body)
      res.status(201).json({
        success:true,
        message:'Registro completado, te enviamos un correo para confirmar tu registro.',
        data:result
      })
    } catch (error) {
      next(error)
    }
  }
)

// Listado paginado usado por el panel /gestion (admin y presidente de
// asociación). El presidente solo ve a los patinadores de su propia
// asociación; el admin ve todos.
router.get('/',authenticate,requireRole(['admin','presidente_asociacion']),async(req, res, next)=>{
  try {
    const { page,limit,search ='',status } = req.query
    const associationId = req.auth.role === 'presidente_asociacion' ? req.auth.associationId : undefined

    const paginatedData = await skaters.getSkatersWithPagination({
      page:parseInt(page),
      limit:parseInt(limit),
      search,
      associationId,
      status
    })

    res.status(200).json({
      success:true,
      data:paginatedData.skaters,
      total:paginatedData.total
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:curp',async(req, res, next)=>{
  try {
    const getOne = await skaters.getOneByCurp(req.params.curp)
    res.status(200).json({
      success:true,
      data:getOne
    })
  } catch (error) {
    next(error)
  }
})

router.get('/by-curp/:curp',uploadFiles,async(req, res, next)=>{
  try {
    const getByCurp = await skaters.getByCurp(req.params.curp)

    if(!getByCurp){
      res.status(200).json({
            success:false,
          })
    }
    else{
      res.status(200).json({
        success:true
      })
    }

  } catch (error) {
    next(error)
  }

})

// Reemplaza el antiguo enlace de correo sin autenticación (botones
// ACEPTAR/RECHAZAR de la asociación): ahora el presidente aprueba/rechaza
// desde el panel, con sesión y acotado a su propia asociación.
router.patch(
  '/:curp/approve',
  authenticate,
  requireRole(['admin','presidente_asociacion']),
  requireSkaterAssociationAccess,
  async(req, res, next)=>{
    try {
      const { approved } = req.body
      const approve = await skaters.aprove(req.skater.curp, Boolean(approved))
      res.status(200).json({
        success:true,
        message: approved ? 'Registro aprobado' : 'Registro rechazado',
        data:approve
      })
    } catch (error) {
      next(error)
    }
  }
)

// Visor de documentos de identidad (acta de nacimiento, CURP) para
// admin/presidente de asociación. A propósito NO vive bajo /uploads (público):
// se guardan en uploads-private/ (ver configurations/multer-config.js) y solo
// se sirven aquí, autenticados y acotados a la propia asociación del
// presidente. `Content-Disposition: inline` + sin exponer un link descargable
// en el frontend son la mitigación real; un usuario decidido siempre puede
// hacer una captura de pantalla, eso no se puede evitar desde el navegador.
router.get(
  '/:curp/documentos/:tipo',
  authenticate,
  requireRole(['admin','presidente_asociacion']),
  requireSkaterAssociationAccess,
  async(req, res, next)=>{
    try {
      const { tipo } = req.params
      if(!DOCUMENT_TYPES.includes(tipo)){
        throw Boom.notFound('Tipo de documento no válido')
      }

      const doc = req.skater.documentos?.[tipo]
      if(!doc?.path || !fs.existsSync(doc.path)){
        throw Boom.notFound('Este patinador no tiene ese documento cargado')
      }

      res.set({
        'Content-Type': doc.mimetype || 'application/octet-stream',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      })
      fs.createReadStream(doc.path).pipe(res)
    } catch (error) {
      next(error)
    }
  }
)

// Edición desde el panel /gestion (admin y presidente de asociación). El
// presidente solo puede editar patinadores de su propia asociación.
router.patch(
  '/:curp',
  authenticate,
  requireRole(['admin','presidente_asociacion']),
  requireSkaterAssociationAccess,
  async(req, res, next)=>{
    try {
      const updateOne = await skaters.updateOneByCurp(req.params.curp,req.body)
      res.status(200).json({
        success:true,
        message:'Registro actualizado',
        data:updateOne
      })
    } catch (error) {
      next(error)
    }
  }
)

router.patch('/update/verification',async(req, res, next)=>{
  try {
    const updateOne = await skaters.updateVerifications()
    res.status(200).json({
      success:true,
      message:'Registro actualizado',
      data:updateOne
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/update/createat',async(req, res, next)=>{
  try {
    const updateOne = await skaters.updateCreateAt()
    res.status(200).json({
      success:true,
      message:'Registro actualizado',
      data:updateOne
    })
  } catch (error) {
    next(error)
  }
})

// Solo admin puede eliminar patinadores; el presidente de asociación no.
router.delete(
  '/:curp',
  authenticate,
  requireRole(['admin']),
  async(req, res, next)=>{
    try {
      const deleteOne = await skaters.delete(req.params.curp)
      res.status(200).json({
        success:true,
        message:'Registro Eliminado',
        data:deleteOne
      })
    } catch (error) {
      next(error)
    }
  }
)







export default router
