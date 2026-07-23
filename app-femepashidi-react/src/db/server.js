// const server = 'http://localhost:3000/'
// const urlApp = 'http://localhost:5173/'


// const urlApp = 'https://femepashidi.up.railway.app/'


// const server = 'https://femepashidi.siradiacion.com.mx/'
// const urlApp = 'https://femepashidi.com.mx/inicio/femepashidi/'

// const server = 'https://femepashidi-production.up.railway.app/'

const server = import.meta.env.VITE_SERVER
const urlApp = import.meta.env.VITE_URL_APP


export  {server,urlApp}