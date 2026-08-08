import Boom from "@hapi/boom"
import bcrypt from "bcrypt"
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

      const updateOne = await db.collection('skaters').updateOne({curp},{$set:updates})
      return updateOne
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Somethink was wrong! ')
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
