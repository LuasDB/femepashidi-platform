import express from 'express'
import Auth from './../services/auth.service.js'
import accountRouter from './account.router.js'
import { authenticate, requireRole } from '../middlewares/authenticate.js'

const router = express.Router()
const auth = new Auth()

// Cuentas de patinadores (self-service), separadas de las cuentas admin/asociación de arriba
router.use('/account', accountRouter)

// Crea cuentas admin/presidente_asociacion (colección `users`). Ahora que este
// endpoint puede asignar rol, solo un admin ya logeado puede crear cuentas
// nuevas — antes estaba completamente abierto, lo cual dejaba crear cuentas
// (y ahora roles) a cualquiera sin sesión.
router.post('/register',authenticate,requireRole(['admin']),async(req, res, next)=>{
  try {
    const newRegister = await auth.create(req.body)
    if(newRegister){
      res.status(200).json({
        success:true,message:'Creado',data:newRegister
      })
    }

  } catch (error) {
    next(error)
  }
})

// Presidente de una asociación ya existente (para que el panel de admin sepa
// si debe mostrar "crear cuenta" o "cambiar contraseña").
router.get('/users/by-association/:associationId',authenticate,requireRole(['admin']),async(req, res, next)=>{
  try {
    const user = await auth.getUserByAssociation(req.params.associationId)
    res.status(200).json({
      success:true,data:user
    })
  } catch (error) {
    next(error)
  }
})

// Admin fija la contraseña de otro usuario directamente (p.ej. resetear la del
// presidente de una asociación), sin pasar por el flujo de correo.
router.patch('/users/:id/password',authenticate,requireRole(['admin']),async(req, res, next)=>{
  try {
    const result = await auth.updatePasswordById(req.params.id, req.body.password)
    res.status(200).json({
      success:true,message:'Contraseña actualizada',data:result
    })
  } catch (error) {
    next(error)
  }
})

// Self-service: admin o presidente_asociacion cambia su propia contraseña
// desde su sesión, verificando la actual.
router.patch('/me/password',authenticate,requireRole(['admin','presidente_asociacion']),async(req, res, next)=>{
  try {
    const { currentPassword, newPassword } = req.body
    const result = await auth.changeOwnPassword(req.auth.userId, currentPassword, newPassword)
    res.status(200).json({
      success:true,message:'Contraseña actualizada',data:result
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login',async(req, res, next)=>{
  try {
    const token = await auth.login(req.body)
    if(token){
      res.status(200).json({
        success:true,message:'Acceso',token
      })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/forgot-password',async(req, res, next)=>{
  try {
    const request = await auth.forgotPassword(req.body)
    if(request){
      res.status(200).json({
        success:true,message:request
      })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    const response = await auth.resetPassword(token, newPassword)

    res.status(200).json({
      success:true,
      message:response})
  } catch (error) {
    next(error)
  }
});








export default router
