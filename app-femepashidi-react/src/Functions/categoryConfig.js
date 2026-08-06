import axios from "axios";
import { server } from "../db/server";
import { DEFAULT_CATEGORY_CONFIG } from "./funciones";

let cached = null;

// Lectura pública, sin token: se usa desde /registro y /cuenta/inscripcion,
// que no tienen sesión de admin. Se cachea en memoria para no repetir el
// fetch en cada cambio de nivel dentro de la misma página.
async function fetchCategoryConfig() {
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${server}api/v1/category-config`);
    if (data.success) {
      cached = data.data;
      return cached;
    }
  } catch (error) {
    console.error('No se pudo obtener la configuración de categorías, se usa el respaldo local', error);
  }

  return DEFAULT_CATEGORY_CONFIG;
}

export { fetchCategoryConfig };
