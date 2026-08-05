import Boom from '@hapi/boom'
import fs from 'fs'
import path from 'path'
import { db } from '../db/mongoClient.js'
import { ObjectId } from 'mongodb'
import { sendMail } from '../utils/sendMailSendGrid.js'
import config from '../config.js'
import { formatoFecha } from '../configurations/formats.js'
import { count } from 'console'
import Notifications from './notifications.service.js'

const notifications = new Notifications()


class Register{
  constructor(){}

  async create(data, files) {
  try {
    // Validar existencia de campos requeridos
    if (!data.user || !data.event || !data.association) {
      throw Boom.badRequest('Faltan datos requeridos para el registro');
    }

    const dataParse = {
      user: JSON.parse(data.user),
      event: JSON.parse(data.event),
      association: JSON.parse(data.association),
    };

    if (!dataParse.user.verificacion) {
      throw Boom.badImplementation('Tu solicitud de registro aun no ha sido aprobada');
    }

    const curp = dataParse.user.curp;
    if (!curp) {
      throw Boom.badRequest('El usuario no tiene CURP');
    }

    // Validar y actualizar foto si existe
    if (files && files.foto && Array.isArray(files.foto) && files.foto[0]) {
      dataParse.user.img = files.foto[0];

      if (data.lastFoto && fs.existsSync(data.lastFoto)) {
        delete data.foto;
        fs.unlinkSync(data.lastFoto);
      }
      await db.collection('skaters').updateOne(
        { curp },
        { $set: { img: files.foto[0] } }
      );
    }

    // Eliminar campos innecesarios de data
    delete data.association;
    delete data.event;
    delete data.user;

    // Validar registro previo
    const isRegistered = await db.collection('register').find({
      'user.curp':curp,
      'event.nombre': dataParse.event.nombre,
    }).toArray();

    const isAdult = data.firstLevel.trim().toLowerCase().includes('adulto')


    if (
      !isAdult &&
      isRegistered.length > 0
    ) {
      throw Boom.badRequest('El usuario ya está registrado en este evento, espera la respuesta que se enviará a tu correo');
    }



    // Insertar registro
    const create = await db.collection('register').insertOne({ ...data, ...dataParse });

    // La asociación ya no se notifica por correo (antes "InscripcionSkaterAsociation"
    // con botones ACEPTAR/RECHAZAR sin autenticación): en su lugar recibe una
    // notificación en la plataforma (campana en /gestion) y aprueba las
    // inscripciones pendientes de su asociación ahí (ver PATCH /register/:id/approval,
    // protegido por rol).
    if (create.insertedId) {
      await notifications.create({
        audience:'association',
        associationId:dataParse.association._id,
        type:'register_pending',
        title:'Nueva inscripción a competencia',
        message:`${dataParse.user.nombre} ${dataParse.user.apellido_paterno} se inscribió a ${dataParse.event.nombre}.`,
        link:`/gestion/view/inscripciones/${create.insertedId}`,
      })
      return create;
    }
  } catch (error) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    throw Boom.badImplementation('Something was wrong!');
  }
}

  // Inscripciones del propio patinador logeado, para su dashboard de cuenta
  // (CuentaDashboard). Se une por curp (no accountId) porque `register.user`
  // es una copia congelada del skater al momento de inscribirse, y curp es la
  // llave que ya se usa en el resto del API para este join.
  async findMine(accountId){
    try {
      const skater = await db.collection('skaters').findOne({ accountId:new ObjectId(accountId) })
      if(!skater){
        return []
      }

      const registers = await db.collection('register')
        .find({ 'user.curp':skater.curp })
        .sort({ fecha_solicitud:-1 })
        .toArray()

      return registers
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('No se pudieron obtener tus inscripciones')
    }
  }

  async findByEvent(event,{ associationId, status, page, limit, search } = {}){
    try {

      const filtro = {'event.nombre':event}
      // Un presidente de asociación solo debe ver las inscripciones de su
      // propia asociación (admin no manda associationId, ve todas). Igual que
      // en skaters.service.js, `association._id` puede haber quedado como
      // string (viene tal cual del cliente en register.create) en vez de
      // ObjectId, así que se aceptan ambas formas.
      if(associationId){
        filtro['association._id'] = { $in: [new ObjectId(associationId), associationId] }
      }

      // Filtro de estatus. 'Preinscrito' es "en espera de aprobación"; a
      // diferencia de skaters, aquí sí existe un estado 'rechazado' real y
      // separado (no hay que inferirlo de un booleano).
      if(status){
        filtro.status = status
      }

      // Mismo criterio de búsqueda que skaters.service.js#getSkatersWithPagination.
      if(search){
        filtro.$or = [
          {'user.nombre':{ $regex:search, $options:'i' }},
          {'user.apellido_paterno':{ $regex:search, $options:'i' }},
          {'user.curp':{ $regex:search, $options:'i' }},
        ]
      }

      const collection = db.collection('register')
      const total = await collection.countDocuments(filtro)

      // limit es opcional: sin él se regresa la lista completa del evento, tal
      // como la necesitan ExportToExcel/GenerateXml (Views/Inscripciones), que
      // exportan todos los registros del evento sin importar la página/búsqueda
      // que esté viendo la tabla en pantalla.
      let cursor = collection.find(filtro)
      if (limit) {
        const skip = (page - 1) * limit
        cursor = cursor.skip(skip).limit(limit)
      }
      const registers = await cursor.toArray()

      return { total, registers }
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }

  async findOne(id){
    try {
      if(!ObjectId.isValid(id)){
        throw Boom.badRequest('El id de la inscripción no es válido')
      }
      const findOne = await db.collection('register').findOne({_id: new ObjectId(id)})
      if(!findOne){
        throw Boom.notFound('La inscripción no existe')
      }
      return findOne
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }

  async update(id,newData){
    try {
      delete newData._id
      const updateOne = await db.collection('register')
      .updateOne({_id:new ObjectId(id)},{$set:{...newData}})
      return updateOne
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }

      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }

  async approval(data){

    try {
      const { id,status } = data

      if(!['aprobado','rechazado'].includes(status)){
        throw Boom.badRequest("status debe ser 'aprobado' o 'rechazado'")
      }

      const isApproved = status === 'aprobado'

      const approval = await db.collection('register')
      .updateOne({_id:new ObjectId(id)},{$set:{status:status}})
      if(approval){
        const register = await db.collection('register').findOne({_id:new ObjectId(id)})

        if(register.user.accountId){
          await notifications.create({
            audience:'skater',
            accountId:register.user.accountId,
            type: isApproved ? 'register_approved' : 'register_rejected',
            title: isApproved ? 'Inscripción aprobada' : 'Inscripción rechazada',
            message: `Tu inscripción a ${register.event.nombre} fue ${isApproved ? 'aprobada' : 'rechazada'}.`,
            link:'/cuenta',
          })
        }

        const emailSkater = await sendMail({
        from:config.emailSupport,
        to:register.user.correo,
        subject: isApproved ? 'Aceptación de Inscripción a competencia' : 'Inscripción a competencia',
        data:{
          name:`${register.user.nombre} ${register.user.apellido_paterno} ${register.user.apellido_materno}`,
          event:register.event.nombre,
          fecha_inicio:formatoFecha(register.event.fecha_inicio),
          fecha_fin:formatoFecha(register.event.fecha_fin),
          level:register.nivel_actual,
          category:register.categoria
        },
        templateEmail:isApproved?'approveInscripcionSkater':'noApproveInscripcionSkate',
        attachments:[
          {
            filename:'encabezado',
            path:path.join('emails/encabezado.png'),
            cid:'encabezado'
          }
        ]
        })

        if(emailSkater.success){
          return {message:'Correo enviado'}
        }
      }
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }

  }

  async delete(id){
    try {
      const deleteOne = await db.collection('register').deleteOne({_id:new ObjectId(id)})
      return deleteOne
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }

  async deleteDuplicates() {
  try {
    // 1. Encontrar duplicados agrupando por curp
    const duplicates = await db
      .collection("register")
      .aggregate([
        { $match: { status: "Preinscrito",
            "event.nombre": "1st INDEPENDENCE OPEN CHAMPIONSHIP 2025"  } },
        {
          $group: {
            _id: "$curp",               // agrupamos por curp
            ids: { $push: "$_id" },     // guardamos todos los _id
            count: { $sum: 1 }
          }
        },
        { $match: { count: { $gt: 1 } } } // solo curps con más de 1
      ])
      .toArray();

    let totalEliminados = 0;
    let reg

    for (const dup of duplicates) {
      // Traemos los documentos completos de este grupo
      const registros = await db.collection("register")
        .find({ _id: { $in: dup.ids } })
        .toArray();


      // 2. Determinar cuál conservar
      let conservar;
      const adulto = registros.find(r =>
        r.nivel_actual?.toLowerCase().includes("adulto")
      );

      if (adulto) {
        conservar = adulto._id;
      } else {
        conservar = registros[0]._id; // si no hay adulto, conserva el primero
      }

      // // 3. Preparar lista de ids a eliminar
      const eliminarIds = registros
        .filter(r => r._id.toString() !== conservar.toString())
        .filter(r => r.status === "Preinscrito") // seguridad extra
        .filter(r => !r.nivel_actual?.toLowerCase().includes("adulto")) // nunca borra adultos
        .map(r => r.user.curp);
        reg=eliminarIds

      // 4. Borrar duplicados
      // if (eliminarIds.length > 0) {
      //   const result = await db.collection("register")
      //     .deleteMany({ _id: { $in: eliminarIds } });
      //   totalEliminados += result.deletedCount;
      // }
    }

    return { mensaje: `Se eliminaron ${totalEliminados} duplicados.`,duplicates,reg};

  } catch (error) {
    console.error("[DELETE DUPLICATES ERROR]", error); // muestra el error real
  throw Boom.badImplementation(error.message || 'No se pudo eliminar duplicados');
  }
  }

  async resendMail(){
    try {
      const pending = await db.collection('register').find(
        {
          'event.nombre':'1st INDEPENDENCE OPEN CHAMPIONSHIP 2025',
          status:'Preinscrito',
          fecha_solicitud:{
            $gte:'2025-08-24',
            $lte:'2025-08-28'
          }
        }
      ).toArray()

      let serverUrl = config.server;
      if (!/^https?:\/\//.test(serverUrl)) {
        serverUrl = 'https://' + serverUrl;
      }

      const send = await Promise.all(pending.forEach(async(item)=>{
        const emailAssociation = await sendMail({
        from: config.emailSupport,
        to: item.association.correo,
        subject: 'Inscripción de participante a competencia',
        data: {
          association: item.association.nombre,
          name: item.association.representante,
          nameSkater: `${item.user.nombre} ${item.user.apellido_paterno} ${item.user.apellido_materno}`,
          nameEvent: item.event.nombre,
          curp: item.user.curp,
          dateStart: item.event.fecha_inicio,
          dateEnd: item.event.fecha_fin,
          level: item.nivel_actual,
          category: item.categoria,
          id: item._id,
          server: serverUrl,
        },
        templateEmail: 'InscripcionSkaterAsociation',
        attachments: [
          {
            filename: 'encabezado',
            path: path.join('emails/encabezado.png'),
            cid: 'encabezado',
          },
          {
            filename: 'ACEPTAR',
            path: path.join('emails/ACEPTAR.png'),
            cid: 'aceptar',
          },
          {
            filename: 'RECHAZAR',
            path: path.join('emails/RECHAZAR.png'),
            cid: 'rechazar',
          },
        ],
        });

      if (emailAssociation.success) {
        console.log('[Enviado]',item.association.abreviacion)
      } else {
        throw Boom.badGateway('No se logró entregar el mail');
      }
      }))

      return pending
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }
  async resendMail(){
    try {
      const pending = await db.collection('register').find(
        {
          'event.nombre':'1st INDEPENDENCE OPEN CHAMPIONSHIP 2025',
          status:'Preinscrito',
          fecha_solicitud:{
            $gte:'2025-08-24',
            $lte:'2025-08-28'
          }
        }
      ).toArray()

      let serverUrl = config.server;
      if (!/^https?:\/\//.test(serverUrl)) {
        serverUrl = 'https://' + serverUrl;
      }

      const send = await Promise.all(pending.forEach(async(item)=>{
        const emailAssociation = await sendMail({
        from: config.emailSupport,
        to: item.association.correo,
        subject: 'Inscripción de participante a competencia',
        data: {
          association: item.association.nombre,
          name: item.association.representante,
          nameSkater: `${item.user.nombre} ${item.user.apellido_paterno} ${item.user.apellido_materno}`,
          nameEvent: item.event.nombre,
          curp: item.user.curp,
          dateStart: item.event.fecha_inicio,
          dateEnd: item.event.fecha_fin,
          level: item.nivel_actual,
          category: item.categoria,
          id: item._id,
          server: serverUrl,
        },
        templateEmail: 'InscripcionSkaterAsociation',
        attachments: [
          {
            filename: 'encabezado',
            path: path.join('emails/encabezado.png'),
            cid: 'encabezado',
          },
          {
            filename: 'ACEPTAR',
            path: path.join('emails/ACEPTAR.png'),
            cid: 'aceptar',
          },
          {
            filename: 'RECHAZAR',
            path: path.join('emails/RECHAZAR.png'),
            cid: 'rechazar',
          },
        ],
        });

      if (emailAssociation.success) {
        console.log('[Enviado]',item.association.abreviacion)
      } else {
        throw Boom.badGateway('No se logró entregar el mail');
      }
      }))

      return pending
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }



}

export default Register
