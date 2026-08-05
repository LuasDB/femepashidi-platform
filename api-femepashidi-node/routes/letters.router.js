import express from 'express';
import Letters from './../services/letters.service.js';
import upload from './../configurations/multer-config.js';
import {
  authenticate,
  requireRole,
  requireLetterAssociationAccess,
} from '../middlewares/authenticate.js';

const ROLES = ['admin', 'presidente_asociacion']

const router = express.Router();
const letters = new Letters();

// Público: solicitud de carta de permiso, enviada por el propio patinador/asociación
// desde FormularioCartasPermiso (ruta pública /cartas-permiso). Sin sesión.
router.post('/', upload('letters').single('archivo'), async (req, res,next) => {
  try {

    const newLetter = await letters.create(req.body, req.file);
    res.status(201).json({success:true,
      data:newLetter});
  } catch (error) {
    next(error);
  }
});

// Listado usado por el panel /gestion (admin y presidente de asociación).
router.get('/', authenticate, requireRole(ROLES), async (req, res, next) => {
  try {
    const associationId = req.auth.role === 'presidente_asociacion' ? req.auth.associationId : undefined
    const { page, limit, search = '', status } = req.query
    const paginatedData = await letters.getAll({
      associationId,
      status,
      search,
      page:parseInt(page),
      limit:parseInt(limit),
    })
    res.status(200).json({
      success:true,
      data: paginatedData.letters,
      total: paginatedData.total,
    })
  } catch (error) {
    next(error)
  }
});

router.get(
  '/:id',
  authenticate,
  requireRole(ROLES),
  requireLetterAssociationAccess,
  async (req, res, next) => {
    try {
      res.status(200).json({
        success:true,
        data:req.letter,
      })
    } catch (error) {
      next(error)
    }
  }
);

// Reemplaza el antiguo enlace de correo sin autenticación (botón ACEPTAR/RECHAZAR
// de la asociación): ahora el presidente da su visto bueno desde el panel, con
// sesión y acotado a su propia asociación.
router.patch(
  '/:id/verification',
  authenticate,
  requireRole(ROLES),
  requireLetterAssociationAccess,
  async (req, res, next) => {
    try {
      await letters.verification(req.params.id, String(Boolean(req.body.approved)))
      res.status(200).json({
        success:true,
        message: req.body.approved ? 'Solicitud verificada' : 'Solicitud rechazada',
      })
    } catch (error) {
      next(error)
    }
  }
);

// Reemplaza el antiguo enlace de correo sin autenticación (botón ACEPTAR/RECHAZAR
// de "presidencia"): la aprobación final es un asunto de la federación completa,
// no de una asociación en particular, así que queda admin-only.
router.patch(
  '/:id/approve',
  authenticate,
  requireRole(['admin']),
  async (req, res, next) => {
    try {
      await letters.approve(req.params.id, String(Boolean(req.body.approved)))
      res.status(200).json({
        success:true,
        message: req.body.approved ? 'Carta aprobada' : 'Carta rechazada',
      })
    } catch (error) {
      next(error)
    }
  }
);


export default router;
