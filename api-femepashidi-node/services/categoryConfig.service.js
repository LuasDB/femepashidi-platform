import Boom from "@hapi/boom"
import { db } from "../db/mongoClient.js"

const DEFAULT_CONFIG = {
  temporada: "2026/2027",
  vigenteDesde: "2026-07-01",
  rangos: [
    { categoria: "PRE-INFANTIL", inicio: "2022-07-01", fin: "2026-06-30" },
    { categoria: "INFANTIL A", inicio: "2019-07-01", fin: "2022-06-30" },
    { categoria: "INFANTIL B", inicio: "2016-07-01", fin: "2019-06-30" },
    { categoria: "JUVENIL A", inicio: "2012-07-01", fin: "2016-06-30" },
    { categoria: "JUVENIL B", inicio: "2008-07-01", fin: "2012-06-30" },
    { categoria: "MAYOR", inicio: "1998-07-01", fin: "2008-06-30" }
  ],
  nivelesISU: [
    { nivel: "NOVICIOS", minEdad: 10, maxEdad: 16, nombreISU: "NOVICIOS (ADVANCED NOVICE) ISU", nombreAbierto: "NOVICIOS ABIERTO" },
    { nivel: "AVANZADOS 1", minEdad: 13, maxEdad: 19, nombreISU: "AVANZADOS 1 (JUNIOR) ISU", nombreAbierto: "AVANZADOS 1 ABIERTO" },
    { nivel: "AVANZADOS 2", minEdad: 17, maxEdad: null, nombreISU: "AVANZADOS 2 (SENIOR) ISU", nombreAbierto: "AVANZADOS 2 ABIERTO" }
  ]
}

const CATEGORIAS_ESPERADAS = DEFAULT_CONFIG.rangos.map(r => r.categoria)
const NIVELES_ESPERADOS = DEFAULT_CONFIG.nivelesISU.map(n => n.nivel)

function validarConfig(data) {
  if (!data || typeof data !== 'object') {
    throw Boom.badRequest('Configuración inválida')
  }

  if (!data.vigenteDesde || isNaN(new Date(data.vigenteDesde).getTime())) {
    throw Boom.badRequest('vigenteDesde debe ser una fecha válida')
  }

  if (!Array.isArray(data.rangos) || data.rangos.length !== CATEGORIAS_ESPERADAS.length) {
    throw Boom.badRequest(`rangos debe incluir exactamente estas categorías: ${CATEGORIAS_ESPERADAS.join(', ')}`)
  }

  for (const categoria of CATEGORIAS_ESPERADAS) {
    const rango = data.rangos.find(r => r.categoria === categoria)
    if (!rango) {
      throw Boom.badRequest(`Falta el rango de la categoría ${categoria}`)
    }
    const inicio = new Date(rango.inicio)
    const fin = new Date(rango.fin)
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw Boom.badRequest(`Fechas inválidas en la categoría ${categoria}`)
    }
    if (inicio >= fin) {
      throw Boom.badRequest(`En ${categoria}, "inicio" debe ser anterior a "fin"`)
    }
  }

  if (!Array.isArray(data.nivelesISU) || data.nivelesISU.length !== NIVELES_ESPERADOS.length) {
    throw Boom.badRequest(`nivelesISU debe incluir exactamente estos niveles: ${NIVELES_ESPERADOS.join(', ')}`)
  }

  for (const nivel of NIVELES_ESPERADOS) {
    const bracket = data.nivelesISU.find(n => n.nivel === nivel)
    if (!bracket) {
      throw Boom.badRequest(`Falta el nivel ISU ${nivel}`)
    }
    if (typeof bracket.minEdad !== 'number' || Number.isNaN(bracket.minEdad)) {
      throw Boom.badRequest(`minEdad de ${nivel} debe ser numérico`)
    }
    if (bracket.maxEdad !== null && (typeof bracket.maxEdad !== 'number' || Number.isNaN(bracket.maxEdad))) {
      throw Boom.badRequest(`maxEdad de ${nivel} debe ser numérico o null`)
    }
  }
}

class CategoryConfigService {
  constructor() {}

  async getConfig() {
    try {
      let config = await db.collection('categoryConfig').findOne({})
      if (!config) {
        await db.collection('categoryConfig').insertOne({ ...DEFAULT_CONFIG })
        config = await db.collection('categoryConfig').findOne({})
      }
      return config
    } catch (error) {
      throw Boom.isBoom(error) ? error : Boom.badImplementation('Error obteniendo la configuración de categorías')
    }
  }

  async updateConfig(data) {
    try {
      validarConfig(data)

      const { temporada, vigenteDesde, rangos, nivelesISU } = data
      const result = await db.collection('categoryConfig').updateOne(
        {},
        { $set: { temporada, vigenteDesde, rangos, nivelesISU } },
        { upsert: true }
      )

      return result
    } catch (error) {
      throw Boom.isBoom(error) ? error : Boom.badImplementation('Error actualizando la configuración de categorías')
    }
  }
}

export default CategoryConfigService
