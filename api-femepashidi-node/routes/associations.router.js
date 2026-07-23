import express from 'express'
import Boom from '@hapi/boom'
import Association from '../services/associations.service.js'
import { authenticate, requireRole } from '../middlewares/authenticate.js'

const router = express.Router()
const association = new Association()

// Lectura pública: el listado de asociaciones alimenta el selector de
// asociación en el registro público de patinadores (RegistroPatinador), así
// que GET se queda abierto a propósito. Solo admin puede crear/editar/borrar
// asociaciones.
router.post('/',authenticate,requireRole(['admin']),async(req,res,next)=>{

  try {
    const newAssociation = await association.create(req.body)
    res.status(201).json({
      success:true,
      message:'Registro Creado',
      data:newAssociation
    })
  } catch (error) {
    next(error)
  }
})

router.get('/',async(req,res,next)=>{

  try {
    const getAssociations = await association.getAll()
    res.status(201).json({
      success:true,
      data:getAssociations
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id',async(req,res,next)=>{

  try {
    const getOne = await association.getOne(req.params.id)
    res.status(201).json({
      success:true,
      data:getOne
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id',authenticate,requireRole(['admin']),async(req,res,next)=>{

  try {
    const updateOne = await association.update(req.body,req.params.id)

    res.status(201).json({
      success:true,
      message:'Registro Actualizado',
      data:updateOne
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id',authenticate,requireRole(['admin']),async(req,res,next)=>{

  try {
    const deleteOne = await association.deleteOne(req.params.id)

    res.status(201).json({
      success:true,
      message:'Registro eliminado',
      data:deleteOne
    })
  } catch (error) {
    next(error)
  }
})





export default router
