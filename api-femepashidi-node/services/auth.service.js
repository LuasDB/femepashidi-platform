import { db } from './../db/mongoClient.js'
import Boom from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import config from '../config.js'
import { sendMail } from './../utils/sendMail.js'
import path from 'path'

// 'admin' gestiona toda la plataforma; 'presidente_asociacion' solo ve/gestiona
// lo de su propia asociación (requiere associationId). Los usuarios `users`
// creados antes de que existiera este campo se tratan como 'admin' (ver
// migration/userRoles.migration.js y el fallback en login()).
const ROLES = ['admin', 'presidente_asociacion']

class Auth{
  constructor(){

  }

  async create(data){

    try {
      const { name, email, password, role = 'admin', associationId } = data
      if(!name || !email ){
        throw Boom.badData('Todos los datos son necesarios')
      }

      if(!ROLES.includes(role)){
        throw Boom.badData(`Rol inválido, debe ser uno de: ${ROLES.join(', ')}`)
      }

      if(role === 'presidente_asociacion' && !associationId){
        throw Boom.badData('associationId es necesario para el rol presidente_asociacion')
      }

      const user = await db.collection('users').findOne({email:email})

      if(user){
        throw Boom.conflict(`El usuario con correo ${email} ya existe`);
      }

      data.role = role
      if(role === 'presidente_asociacion'){
        data.associationId = new ObjectId(associationId)
      }else{
        delete data.associationId
      }

      if(password){
        const hashedPassword = await bcrypt.hash(password,10);
        data.password = hashedPassword
      }


      const result = await db.collection('users').insertOne(data)

      if(result.insertedId){
        const resetToken = jwt.sign(
          { userId: result.insertedId,email },
          config.jwtSecret,
          { expiresIn: '1h' }
        );

        const resetLink = `${config.urlApp}/reset-password?token=${resetToken}`
        if(!password){
          sendMail({
            to:email,
            subject:'Creación de contraseña',
            data:{name,company,resetLink},
            templateEmail:'register',
            attachments:[{
              filename:'samartech',
              path:path.join('emails/samartech.png'),
              cid:'logo_empresa'
            }]
          })
        }

        return {id:result.insertedId,email}

      }

    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Error al registrar usuario',error)

    }

  }

  async login(data){
    try {
      const { password,email } = data
      const user = await db.collection('users').findOne({email})

      if(!user){
        throw Boom.unauthorized('Email o passwor incorrectos')
      }

      const isPasswordValid = await bcrypt.compare(password,user.password)

      if(!isPasswordValid){
        throw Boom.unauthorized('Email o passwor incorrectos')
      }

      const payload = {
        userId:user._id,
        email:user.email,
        name:user.name,
        // Fallback a 'admin' para cuentas creadas antes de que existiera este campo.
        role:user.role || 'admin',
        associationId:user.associationId || null,
      }
      const token = jwt.sign(payload,config.jwtSecret,{ expiresIn:'24h'})

      return token

    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Error al registrar usuario',error)
    }
  }

  async forgotPassword(data){
    try {
      console.log(data)
      const { email } = data
      const user = await this.getUserByEmail(email)

      const resetToken = jwt.sign(
        { userId: user._id,email:user.email },
        config.jwtSecret,
        { expiresIn: '1min' }
      );

      const resetLink = `${config.urlApp}/reset-password?token=${resetToken}`
      sendMail({
        to:email,
        subject:'Creación de contraseña',
        data:{name:user.name,resetLink},
        templateEmail:'restartPass',
        attachments:[{
          filename:'samartech',
            path:path.join('emails/samartech.png'),
            cid:'logo_empresa'
        }]
      })
      return 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo.'
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Error al registrar usuario',error)
    }
  }

  async getUserByEmail(email){
    try {
      const user = await db.collection('users').findOne({email:email})
      if (!user) {
        throw Boom.notFound('No se encontró un usuario con ese correo');
      }

      return user

    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Error al registrar usuario',error)
    }
  }

  // Cuenta de presidente_asociacion ligada a una asociación, si ya existe
  // (sin password) — usado por el panel de admin para saber si debe mostrar
  // el formulario de creación o el de cambio de contraseña.
  async getUserByAssociation(associationId){
    try {
      const user = await db.collection('users').findOne(
        { role:'presidente_asociacion', associationId:new ObjectId(associationId) },
        { projection:{ password:0 } }
      )
      return user
    } catch (error) {
      throw Boom.badImplementation('Error al buscar el usuario')
    }
  }

  // Admin fija directamente la contraseña de otro usuario (p.ej. el presidente
  // de una asociación), sin necesidad de conocer la contraseña anterior.
  async updatePasswordById(id, newPassword){
    try {
      if(!newPassword || newPassword.length < 8){
        throw Boom.badData('La contraseña debe tener al menos 8 caracteres')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      const result = await db.collection('users').updateOne(
        { _id:new ObjectId(id) },
        { $set:{ password:hashedPassword, updatedAt:new Date() } }
      )

      if(result.matchedCount === 0){
        throw Boom.notFound('Usuario no encontrado')
      }

      return { updated:true }
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('No se pudo actualizar la contraseña')
    }
  }

  // Self-service: el propio usuario logeado (admin o presidente_asociacion)
  // cambia su contraseña, verificando la actual primero.
  async changeOwnPassword(userId, currentPassword, newPassword){
    try {
      if(!newPassword || newPassword.length < 8){
        throw Boom.badData('La nueva contraseña debe tener al menos 8 caracteres')
      }

      const user = await db.collection('users').findOne({ _id:new ObjectId(userId) })
      if(!user){
        throw Boom.notFound('Usuario no encontrado')
      }

      const isValid = await bcrypt.compare(currentPassword || '', user.password)
      if(!isValid){
        throw Boom.unauthorized('La contraseña actual no es correcta')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db.collection('users').updateOne(
        { _id:user._id },
        { $set:{ password:hashedPassword, updatedAt:new Date() } }
      )

      return { updated:true }
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('No se pudo actualizar la contraseña')
    }
  }

  async resetPassword(token, newPassword){
    try {
      const decoded = jwt.verify(token,this.jwtSecret)

      const user = this.getUserByEmail(decoded.email)

      const hashedPassword = await bcrypt.hash(newPassword,10)

      await db.collection('users').updateOne(
        {_id:user._id},
        {$set:{password:hashedPassword}}
      )

      return { message:'Contraseña actualizada' }
    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Error al registrar usuario',error)
    }
  }

  async oto(data){
    try {

    } catch (error) {
      if(Boom.isBoom(error)){
        throw error
      }
      throw Boom.badImplementation('Error al registrar usuario',error)
    }
  }

}

export default Auth
