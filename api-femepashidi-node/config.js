import 'dotenv/config'

// Quita el/los slash(es) finales para que construir links como
// `${config.urlApp}/ruta` nunca genere un doble '//', sin importar si la
// variable de entorno URL_APP se definió con o sin slash final.
const stripTrailingSlash = (url) => url ? url.replace(/\/+$/, '') : url

export default {
  port:process.env.PORT || 3000,
  server:process.env.SERVER,
  appUrl:stripTrailingSlash(process.env.URL_APP),
  mongoURI:process.env.MONGO_URI,
  database:process.env.MONGO_DATABASE,
  jwtSecret:process.env.JWT_SECRET,
  hostEmailSupport:process.env.HOST_EMAIL_SUPPORT,
  portEmailSupport:process.env.PORT_EMAIL_SUPPORT,
  emailSupport:process.env.EMAIL_SUPPORT,
  passSupport:process.env.PASS_EMAIL_SUPPORT,
  emailFrom:process.env.MAIL_FROM,
  urlApp:stripTrailingSlash(process.env.URL_APP),
  apiKeyResend:process.env.APIKEY_RESEND
}
