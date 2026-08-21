import Boom from "@hapi/boom"
import bcrypt from "bcrypt"
import fs from "fs"
import { db } from "../db/mongoClient.js"
import { sendMail } from './../utils/sendMail.js'
import path from "path"
import config from "./../config.js"
import { ObjectId } from "mongodb"
import { nextCompetitorNumber } from "./competitorNumber.js"
import Notifications from "./notifications.service.js"

const notifications = new Notifications()


// Fields a skater's own account is allowed to self-edit. CURP, association,
// verificacion and category/level stay admin-only since they're either
// identity data tied to the CURP or require review to change.
const SELF_SERVICE_FIELDS = ['telefono', 'correo', 'lugar_nacimiento']

const DOCUMENT_TYPES = ['actaNacimiento', 'curpDoc']
const DOCUMENT_LABELS = { actaNacimiento: 'acta de nacimiento', curpDoc: 'CURP' }

class Skaters{
  constructor(){}

  async updateOwnData(curp, newData, file){
    try {
      const updates = {}
      for(const field of SELF_SERVICE_FIELDS){
        if(newData[field] !== undefined){
          updates[field] = newData[field]
        }
      }

      if(file){
        updates.img = file
      }

      if(Object.keys(updates).length === 0){
        throw Boom.badRequest('No hay datos válidos para actualizar')
      }

      if(updates.correo){
        updates.correo = updates.correo.toLowerCase().trim()
      }

      const skater = await db.collection('skaters').findOne({curp})
      if(!skater){
        throw Boom.notFound('El patinador no existe')
      }

      // El correo también es el email de login (accounts.email). Sin este
      // paso, cambiar el correo aquí solo actualizaba skaters.correo y dejaba
      // accounts.email con el valor viejo, desincronizando la cuenta.
      if(updates.correo && updates.correo !== skater.correo && skater.accountId){
        const emailTaken = await db.collection('accounts').findOne({
          email:updates.correo,
          _id:{ $ne:skater.accountId },
        })
        if(emailTaken){
          throw Boom.conflict('Ya existe una cuenta con ese correo')
        }
      }

      const updateOne = await db.collection('skaters').updateOne({curp},{$set:updates})

      if(updates.correo && updates.correo !== skater.correo && skater.accountId){
        await db.collection('accounts').updateOne(
          { _id:skater.accountId },
          { $set:{ email:updates.correo, updatedAt:new Date() } }
        )
      }

      return updateOne
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
    }
  }

  // Autoservicio: el patinador sube su propia acta/CURP desde /cuenta, un
  // documento a la vez. Un tipo ya cargado y vigente no se puede volver a
  // mandar por aquí (el frontend solo enseña el input para el que falta o fue
  // rechazado); si el documento fue rechazado (ver rejectDocument, que ya
  // dejó `path:null`) sí se acepta, y sustituye por completo el subdocumento
  // anterior, borrando junto con él el motivo/estatus del rechazo.
  async uploadOwnDocuments(curp, files){
    try {
      const skater = await db.collection('skaters').findOne({curp})
      if(!skater){
        throw Boom.notFound('The CURP was not found')
      }

      const updates = {}
      const reuploadedLabels = []
      for(const tipo of DOCUMENT_TYPES){
        const file = files?.[tipo]?.[0]
        if(!file) continue
        const existing = skater.documentos?.[tipo]
        if(existing?.path){
          throw Boom.conflict('Ya tienes ese documento cargado')
        }
        updates[`documentos.${tipo}`] = file
        if(existing?.rechazado){
          reuploadedLabels.push(DOCUMENT_LABELS[tipo])
        }
      }

      if(Object.keys(updates).length === 0){
        throw Boom.badRequest('No se recibió ningún documento')
      }

      await db.collection('skaters').updateOne({curp}, {$set:updates})

      // Si lo que subió corrige un rechazo, la asociación tiene que enterarse
      // para volver a revisarlo (mismo patrón que letters.create la avisa de
      // una solicitud nueva): sin esto, el documento corregido se queda
      // esperando en silencio hasta que alguien entre a revisar por su cuenta.
      if(reuploadedLabels.length && skater.asociacion?._id){
        await notifications.create({
          audience:'association',
          associationId:skater.asociacion._id,
          type:'document_reuploaded',
          title:'Documento reenviado para revisión',
          message:`${skater.nombre} ${skater.apellido_paterno} volvió a subir: ${reuploadedLabels.join(', ')}.`,
          link:`/gestion/view/patinadores/${curp}`,
        })
      }

      return await db.collection('skaters').findOne({curp})
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('No se pudieron guardar los documentos')
    }
  }

  // Rechazo de un documento puntual (no de todo el registro): a diferencia de
  // aprove(), que decide sobre el registro completo, esto deja que
  // asociación/admin invaliden solo el acta o solo el CURP con un motivo
  // concreto. El archivo se borra del disco de inmediato (no debe quedar
  // basura en uploads/private/ por documentos que ya nadie puede ver ni
  // volver a servir) y `path:null` es justo lo que uploadOwnDocuments lee
  // como "puede volver a subirlo": el permiso de re-carga es implícito, no un
  // campo aparte que alguien tenga que activar.
  async rejectDocument(curp, tipo, motivo){
    try {
      if(!DOCUMENT_TYPES.includes(tipo)){
        throw Boom.badRequest('Tipo de documento no válido')
      }
      if(!motivo?.trim()){
        throw Boom.badData('El motivo del rechazo es necesario')
      }

      const skater = await db.collection('skaters').findOne({curp})
      if(!skater){
        throw Boom.notFound('The CURP was not found')
      }

      const doc = skater.documentos?.[tipo]
      if(!doc?.path){
        throw Boom.notFound('Este patinador no tiene ese documento cargado')
      }

      if(fs.existsSync(doc.path)){
        fs.unlinkSync(doc.path)
      }

      const motivoRechazo = motivo.trim()
      const updateData = {
        [`documentos.${tipo}`]: {
          path: null,
          rechazado: true,
          motivoRechazo,
          rechazadoAt: new Date(),
        },
      }

      // Un documento de identidad inválido invalida la aprobación completa:
      // no debe seguir apareciendo "Aprobado" mientras uno de los dos
      // documentos está rechazado.
      if(skater.verificacion){
        updateData.verificacion = false
      }

      await db.collection('skaters').updateOne({curp}, {$set:updateData})

      if(skater.accountId){
        const label = DOCUMENT_LABELS[tipo]
        await notifications.create({
          audience:'skater',
          accountId:skater.accountId,
          type:'document_rejected',
          title:'Documento rechazado',
          message:`Tu ${label} fue rechazado: ${motivoRechazo}. Ya puedes volver a subirlo desde tu cuenta.`,
          link:'/cuenta',
        })

        // La campana es fácil de no ver a tiempo; el correo es el segundo
        // canal para que el patinador se entere y corrija antes de la fecha
        // límite de inscripción, igual que aprove() ya hace para el registro
        // completo.
        await sendMail({
          from:config.emailSupport,
          to:skater.correo,
          subject:'Documento rechazado - FEMEPASHIDI',
          data:{
            name:`${skater.nombre} ${skater.apellido_paterno}`,
            documentLabel:label,
            motivo:motivoRechazo,
            loginLink:`${config.urlApp}/cuenta/login`,
          },
          templateEmail:'documentRejected',
          attachments:[
            {
              filename:'encabezado',
              path:path.join('emails/encabezado.png'),
              cid:'encabezado'
            }
          ]
        })
      }

      return await db.collection('skaters').findOne({curp})
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('No se pudo rechazar el documento')
    }
  }

  // Registro desde cero: crea la cuenta (1:1) y el patinador en la misma
  // operación, en vez del viejo flujo que solo daba de alta al patinador sin
  // ninguna cuenta asociada. Reemplaza a addSketer/new-skater.
  async registerWithAccount(files, data){
    
    try {
      const { password, confirmPassword, curp, correo, id_asociacion } = data

      if(!password || password.length < 8){
        throw Boom.badData('La contraseña debe tener al menos 8 caracteres')
      }
      if(password !== confirmPassword){
        throw Boom.badData('Las contraseñas no coinciden')
      }
      if(!correo){
        throw Boom.badData('El correo es necesario')
      }
      if(!curp){
        throw Boom.badData('El CURP es necesario')
      }
      if(!id_asociacion){
        throw Boom.badData('La asociación es necesaria')
      }

      const normalizedCurp = curp.toUpperCase()
      const normalizedEmail = correo.toLowerCase()

      const existingSkater = await db.collection('skaters').findOne({ curp:normalizedCurp })
      if(existingSkater){
        throw Boom.conflict('Ya existe un patinador registrado con ese CURP')
      }

      const existingAccount = await db.collection('accounts').findOne({ email:normalizedEmail })
      if(existingAccount){
        throw Boom.conflict('Ya existe una cuenta con ese correo')
      }

      const association = await db.collection('associations').findOne({ _id:new ObjectId(id_asociacion) })
      if(!association){
        throw Boom.badRequest('Asociación no encontrada')
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const accountInsert = await db.collection('accounts').insertOne({
        email:normalizedEmail,
        password:hashedPassword,
        status:'active',
        createdAt:new Date(),
        updatedAt:new Date(),
        activationEmailSentAt:null,
      })

      const newSkater = {
        ...data,
        curp:normalizedCurp,
        correo:normalizedEmail,
        asociacion:association,
        accountId:accountInsert.insertedId,
        verificacion:false,
        img:files?.foto?.[0] || null,
        documentos:{
          actaNacimiento:files?.actaNacimiento?.[0] || null,
          curpDoc:files?.curpDoc?.[0] || null,
        },
      }
      delete newSkater.password
      delete newSkater.confirmPassword
      // id_asociacion (string, ya viene del form) se conserva tal cual: la
      // aprobación (aprove() -> updateOneByCurp) lo requiere para volver a
      // resolver la asociación al aprobar/rechazar.

      let skaterInsert
      try {
        skaterInsert = await db.collection('skaters').insertOne(newSkater)
      } catch (error) {
        // No dejar una cuenta huérfana si falló la creación del patinador.
        await db.collection('accounts').deleteOne({ _id:accountInsert.insertedId })
        throw error
      }

      console.log('Enviando correo de confirmación al patinador...')
      // La asociación ya no se notifica por correo: en su lugar recibe una
      // notificación en la plataforma (campana en /gestion) para que el
      // presidente vea y apruebe los registros pendientes de su asociación
      // (ver PATCH /skaters/:curp/approve, protegido por rol).
      await notifications.create({
        audience:'association',
        associationId:association._id,
        type:'skater_pending',
        title:'Nuevo registro de patinador',
        message:`${data.nombre} ${data.apellido_paterno} se registró y espera aprobación.`,
        link:`/gestion/view/patinadores/${normalizedCurp}`,
      })

      const emailSkater = await sendMail({
        from:config.emailSupport,
        to:normalizedEmail,
        subject:'Registro a plataforma FEMEPASHIDI',
        data:{name:`${data.nombre} ${data.apellido_paterno}`},
        templateEmail:'register',
        attachments:[
          {
            filename:'encabezado',
            path:path.join('emails/encabezado.png'),
            cid:'encabezado'
          }
        ]
      })

      return { skaterId:skaterInsert.insertedId, accountId:accountInsert.insertedId, emailSkater }
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('No se pudo completar el registro')
    }
  }

  async getByCurp(curp){
    try {
      curp = curp.toUpperCase()
      const isCurp = await db.collection('skaters').findOne({curp})
      return isCurp !== null
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! 2 ')
    }
  }

  async getOneByCurp(curp){
    try {
      curp = curp.toUpperCase()
      const isCurp = await db.collection('skaters').findOne({curp})
      if(!isCurp){
        throw Boom.notFound('The CURP was not found')
      }
      return isCurp
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! 2 ')
    }
  }

  async getSkatersWithPagination({page,limit,search,associationId,status}){

    try {

      const skip = ( page - 1 ) * limit

      const filtro = search ?
        {
          $or:[
            {nombre:{ $regex:search , $options:'i'}},
            {apellido_paterno:{ $regex:search , $options:'i'}},
            {curp:{ $regex:search , $options:'i'}},
          ]
      }
      :{}

      // Un presidente de asociación solo debe ver a los patinadores de su
      // propia asociación (admin no manda associationId, ve todo). `asociacion._id`
      // queda guardado a veces como ObjectId (updateOneByCurp, que relee la
      // asociación de su colección) y a veces como string (addSketer, que
      // inserta tal cual el objeto que mandó el cliente) — se aceptan ambas
      // formas para no dejar patinadores fuera del filtro por esa inconsistencia.
      if(associationId){
        filtro['asociacion._id'] = { $in: [new ObjectId(associationId), associationId] }
      }

      // Filtro de estatus de aprobación. 'pendiente' cubre tanto
      // verificacion:false como el campo ausente (patinadores viejos que
      // nunca se tocaron con aprove()), que es como ya se interpreta
      // "pendiente" en el resto del frontend (!user.verificacion).
      if(status === 'aprobado'){
        filtro.verificacion = true
      }else if(status === 'pendiente'){
        filtro.verificacion = { $ne: true }
      }

      const collection = await db.collection('skaters')

      const total = await collection.countDocuments(filtro)
      const skaters = await collection
      .find(filtro)
      .skip(skip)
      .limit(limit)
      .sort({apellido_paterno:1})
      .toArray()

      return { total, skaters }


      }catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! 2 ')
    }
  }

  async updateOneByCurp(curp, newData) {
    try {
      console.log('[]')
      console.log(newData)
      
      if (!newData.id_asociacion) {
        throw Boom.badRequest('id_asociacion is required');
      }

      const newAssociation = await db.collection('associations').findOne({ _id: new ObjectId(newData.id_asociacion) });

      if (!newAssociation) {
        throw Boom.badRequest('Association not found');
      }

      newData.asociacion = newAssociation;
      delete newData._id
      const updateOne = await db.collection('skaters').updateOne(
        { curp},
        { $set: newData }
      );

      if (updateOne.matchedCount === 0) {
        throw Boom.notFound('The CURP was not found');
      }

      return updateOne;
    } catch (error) {
      if (Boom.isBoom(error)) {
        throw error.message;
      }
      throw Boom.badImplementation('Something went wrong!');
    }
  }

  async aprove(curp,status){
    console.log('CURP:',curp)
    console.log('STATUS:',status)

    try {
      const skater = await db.collection('skaters').findOne({curp})
      let response
      if(status){
        response = await sendMail({
          from:config.emailSupport,
          to:skater.correo,
          subject:'Aceptación de registro en plataforma FEMEPASHIDI',
          data:{name:`${skater.nombre} ${skater.apellido_paterno}`,loginLink:`${config.urlApp}/cuenta/login`},
          templateEmail:'approveSkater',
          attachments:[
            {
              filename:'encabezado',
              path:path.join('emails/encabezado.png'),
              cid:'encabezado'
            }
          ]
        })

      }else{
        response = await sendMail({
          from:config.emailSupport,
          to:skater.correo,
          subject:'Registro en plataforma FEMEPASHIDI',
          data:{name:`${skater.nombre} ${skater.apellido_paterno}`},
          templateEmail:'noApproveSkater',
          attachments:[
            {
              filename:'encabezado',
              path:path.join('emails/encabezado.png'),
              cid:'encabezado'
            }
          ]
        })
      }

      if(!response.success){
        throw Boom.badRequest("Can't send email to confirm")
      }

      const updateData = {verificacion:status,id_asociacion:skater.asociacion._id}

      if(status && !skater.numero_competidor){
        updateData.numero_competidor = await nextCompetitorNumber()
      }
      console.log(updateData)

      if(skater.accountId){
        await notifications.create({
          audience:'skater',
          accountId:skater.accountId,
          type: status ? 'skater_approved' : 'skater_rejected',
          title: status ? 'Tu registro fue aprobado' : 'Tu registro no fue aprobado',
          message: status
            ? 'Tu asociación aprobó tu registro en la plataforma FEMEPASHIDI.'
            : 'Tu asociación no aprobó tu registro. Contáctala para más información.',
          link:'/cuenta',
        })
      }

      return this.updateOneByCurp(curp,updateData)

    } catch (error) {
      if(Boom.isBoom(error)){
              throw error
            }
            throw Boom.badImplementation('Can´t update the register')
          }
  }

  async delete(curp){
    try {
      const skater = await db.collection('skaters').findOne({curp})
      const deleteOne = await db.collection('skaters').deleteOne({curp})

      // Se borra también la cuenta vinculada: registerWithAccount rechaza el
      // registro si ya existe una cuenta con ese correo, así que dejarla viva
      // impediría volver a inscribirse con el mismo correo.
      if(skater?.accountId){
        await db.collection('accounts').deleteOne({_id:skater.accountId})
      }

      return deleteOne
    } catch (error) {
      if(Boom.isBoom(error)){
          throw error
        }
        throw Boom.badImplementation('Can´t update the register')
      }
  }

  async updateVerifications(){
    try {
      const result = await db.collection('skaters').aggregate([
      { $group: { _id: "$curp", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();


      return result
    } catch (error) {
      if(Boom.isBoom(error)){
          throw error
        }
        throw Boom.badImplementation('Can´t update the verification')
    }
  }

  async updateCreateAt(){
    try {
      const result = await db.collection('skaters')
      .find(
        {verificacion:{$exists:false}}
      ).toArray()

      const dates = result.filter(item=>item.img)



      return dates
    } catch (error) {
      if(Boom.isBoom(error)){
          throw error
        }
        throw Boom.badImplementation('No se puede obtener')
    }
  }



  }



export default Skaters
export { DOCUMENT_TYPES }
