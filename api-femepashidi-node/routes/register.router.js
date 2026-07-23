
import express from 'express'
import Register from '../services/register.service.js'
import upload from '../configurations/multer-config.js'
import {
  authenticate,
  requireAccount,
  requireRole,
  requireRegisterAssociationAccess,
} from '../middlewares/authenticate.js'


const router = express.Router()
const registro = new Register()

router.post('/',upload('skaters').fields([{name: 'foto', maxCount: 1 }]),async(req,res,next)=>{
  try {

    const register = await registro.create(req.body,req.files);
    res.status(201).json({
      success:true,
      message:'Registro completado, te enviaremos más instrucciones por correo, gracias por participar.',
      data:register
    });
  } catch (error) {
    next(error);
  }
});
// Inscripciones del patinador logeado (CuentaDashboard). Debe ir antes de
// '/:id' para que 'mine' no se interprete como un id de inscripción.
router.get('/mine',authenticate,requireAccount,async(req,res,next)=>{
  try {
    const registers = await registro.findMine(req.auth.accountId)
    res.status(200).json({
      success:true,
      data:registers
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:id',async(req,res,next)=>{
  const { id }=req.params;
  try {
    const user = await registro.findOne(id);
    res.status(200).json({
      success: true,
      data:user});
  } catch (error) {
    next(error);
  }
});
// Listado por evento usado por el panel /gestion (admin y presidente de
// asociación). El presidente solo ve las inscripciones de su propia asociación.
router.get('/event/:event',authenticate,requireRole(['admin','presidente_asociacion']),async(req,res,next)=>{
  try {
    const associationId = req.auth.role === 'presidente_asociacion' ? req.auth.associationId : undefined
    const users = await registro.findByEvent(req.params.event,associationId,req.query.status)
    res.status(200).json({
      success:true,
      data:users
    });
  } catch (error) {
    next(error);
  }
});
router.patch('/:id',async(req,res,next)=>{
  try {
    const user = await registro.update(req.params.id,req.body);
    res.status(201).json({success:true,message:'Registro Actualizado',data:user});
  } catch (error) {
    next(error);
  }
});
// Reemplaza el antiguo enlace de correo sin autenticación (botones
// ACEPTAR/RECHAZAR de la asociación): ahora el presidente aprueba/rechaza
// desde el panel, con sesión y acotado a su propia asociación.
router.patch(
  '/:id/approval',
  authenticate,
  requireRole(['admin','presidente_asociacion']),
  requireRegisterAssociationAccess,
  async(req,res,next)=>{
    try {
      const register = await registro.approval({ id:req.params.id, status:req.body.status });
      res.status(200).json({
        success:true,
        message:register.message,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/search/pending/resendmail',async(req,res,next)=>{

  try {
    const register = await registro.resendMail();
    res.status(200).json({
      success:true,
      data:register
    })
  } catch (error) {
    next(error);
  }
});
router.get('/modify/pending/abreviations',async(req,res,next)=>{

  try {
    const register = await registro.modifyAbr();
    res.status(200).json({
      success:true,
      data:register
    })
  } catch (error) {
    next(error);
  }
});
router.delete('/:id',async(req,res,next)=>{
  try {
    const user = await registro.delete(req.params.id);
    res.status(201).json({
      success:true,
      messsage:'Registro eliminado',
      data:user
    });
  } catch (error) {
    next(error);
  }
});
router.delete('/delete/duplicates',async(req,res,next)=>{
  try {
    const user = await registro.deleteDuplicates();
    res.status(201).json({
      success:true,
      messsage:'Registros eliminado',
      data:user
    });
  } catch (error) {
    next(error);
  }
});


// router.get('/confirmation/:id',async(req,res,next)=>{
//   const { id } = req.params
//   try {
//     const register = await registro.confirmate(id);
//     if(register.message === 'Correo enviado'){
//       res.redirect('https://www.femepashidi.com.mx/inicio/respuesta.html');
//     }else if(register.message === 'Ya confirmado'){
//       res.redirect('https://www.femepashidi.com.mx/inicio/respuesta.html');
//     }

//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/get/event/by/:name',async(req,res,next)=>{
//   const { name }=req.params;

//   try {
//     const events = await registro.findOneByName(name);
//     res.status(200).json({
//       success:true,
//       data:events
//     });
//   } catch (error) {
//     next(error);
//   }
// });
// router.patch('/:id',async(req,res,next)=>{
//   try {
//     const user = await registro.update(req.params.id,req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     next(error);
//   }
// });
// router.delete('/:id',async(req,res,next)=>{
//   try {
//     const user = await registro.delete(req.params.id);
//     res.status(201).json(user);
//   } catch (error) {
//     next(error);
//   }
// });


export default router
