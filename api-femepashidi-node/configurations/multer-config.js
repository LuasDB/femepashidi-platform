import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storageConfig = (collection)=>{
  const uploadPath = `uploads/${collection}`
  if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath,{recursive:true})
  }

  return multer.diskStorage({
    destination: (req,file,cb)=>{
      cb(null,uploadPath)
    },
    filename:(req,file,cb)=>{
      const identificador = Date.now() + '_' + Math.round(Math.random() * 1E9)
      cb(null,`${file.fieldname}_${identificador}${path.extname(file.originalname)}`)
    }
  })
}
const upload = (collection)=>{
  const options = { storage: storageConfig(collection) }
  if(collection === 'gallery'){
    // La galería acepta fotos y videos, nada más
    options.fileFilter = (req, file, cb) => {
      const esImagenOVideo = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')
      cb(null, esImagenOVideo)
    }
  }
  return multer(options)
}

// Campos que, a diferencia de la foto de credencial, no deben quedar bajo
// `uploads/` (servido públicamente por express.static en server.js). Se
// guardan en `uploads-private/`, fuera de esa carpeta pública, y solo se
// entregan mediante el endpoint autenticado GET /skaters/:curp/documentos/:tipo.
const PRIVATE_FIELDS = ['actaNacimiento', 'curpDoc']

// Multer usado solo por el registro de patinadores: enruta cada campo del
// mismo formulario a un destino distinto según sea público (foto) o privado
// (documentos de identidad), en vez de mandar todo al mismo folder.
const uploadSkaterRegistration = () => {
  const publicPath = 'uploads/skaters'
  const privatePath = 'uploads-private/skaters-docs'
  for(const dir of [publicPath, privatePath]){
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir,{recursive:true})
    }
  }

  const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
      cb(null, PRIVATE_FIELDS.includes(file.fieldname) ? privatePath : publicPath)
    },
    filename: (req,file,cb)=>{
      const identificador = Date.now() + '_' + Math.round(Math.random() * 1E9)
      cb(null,`${file.fieldname}_${identificador}${path.extname(file.originalname)}`)
    }
  })

  return multer({ storage })
}

export default upload
export { uploadSkaterRegistration }
