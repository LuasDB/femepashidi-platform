import { useEffect,useState } from "react";
import { fechaActual,formatoNombre,obtenerTimestamp,formatoDosDigitos,obtenerEtiqueta } from './../../Functions/funciones'


const agruparPorCombinacion=(data)=> {
    const grupos = {};
    let count = 0
  
    data.forEach(item => {
        if(item.data[4] === 'aprobado'){
            count++
            const {  sexo } = item.content.user;
            const { nivel_actual, categoria } = item.content
            
            // const clave = `${nivel_actual}_${categoria}_${sexo}`;
            const clave = `${nivel_actual}`;
        
            if (!grupos[clave]) {
                grupos[clave] = [];
            }
        
            grupos[clave].push({count,...item});
        }
       
    });
  
    return grupos;
  }

  const agruparPorCombinacionSinCat=(data)=> {
    const grupos = {};
    let count = 0
  
    data.forEach(item => {
        if(item.data[4] === 'aprobado'){
            count++
            const { nivel_actual} = item.content;
            // const clave = `${nivel_actual}_${item.content.user.sexo}`;
            const clave = `${nivel_actual}`;

        
            if (!grupos[clave]) {
                grupos[clave] = [];
            }
        
            grupos[clave].push({count,...item});
        }
       
    });
  
    return grupos;
  }

 

  // Función para convertir el array en XML
  const convertirGrupoAXml = (grupo,id,codigoCompetencia) => {
    const timestamp = obtenerTimestamp()

    let xml = `<?xml version="1.0" encoding="utf-8"?><OdfBody CompetitionCode="${codigoCompetencia}"
    DocumentCode="FSK-------------------------------" DocumentType="DT_PARTIC" Version="0" FeedFlag="P" Date="${fechaActual()}" Time="${timestamp}" LogicalDate="${fechaActual()}"><Competition>`;

    grupo.forEach((item,index)=>{
        xml += `<Participant Code="${item.count}" Parent="${item.count}" Status="ACTIVE" GivenName="${formatoNombre(item.content.user.nombre)}" FamilyName="${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()}" PrintName="${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()} ${formatoNombre(item.content.user.nombre)}" PrintInitialName="${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()}" TVName="${formatoNombre(item.content.user.nombre)} ${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()}" TVInitialName="${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()}" TVFamilyName="${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()}" Gender="${item.content.user.sexo.toLowerCase() === 'femenino' ? 'W' : 'M'}" Organisation="${item.content.association.abreviacion}" BirthDate="${item.content.user.fecha_nacimiento}" CountryofBirth="México" Nationality="MEX" MainFunctionId="AA01" Current="true" ModificationIndicator="N"><Discipline Code="FSK-------------------------------" IFId="${item.count}"><RegisteredEvent Event="${obtenerEtiqueta(item.content.nivel_actual,item.content.user.sexo.toLowerCase(),item.content.categoria)}"><EventEntry Type="ER_EXTENDED" Code="COACH" Value="" /></RegisteredEvent></Discipline></Participant>`;

    })
    xml += `</Competition></OdfBody>`

    return xml;
  };

  
  // Función para descargar el archivo XML
function descargarXml(xmlContent, nombreArchivo) {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nombreArchivo}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

export default function GenerateXml({data}) {
    const [gruposCat, setGruposCat] = useState({});
    const [grupos, setGrupos] = useState({});
    const [todosGrupos, setTodosGrupos] = useState({});

    // Agrupar los datos al cargar el componente
    useEffect(() => {
        const agrupacionesCat = agruparPorCombinacion(data.filter(reg =>
          reg.content.nivel_actual !== 'Avanzados 1' &&
          reg.content.nivel_actual !== 'Avanzados 2' &&
          reg.content.nivel_actual !== 'Novicios'
        ));

        const agrupaciones = agruparPorCombinacionSinCat(data.filter(reg =>
          reg.content.nivel_actual === 'Avanzados 1' ||
          reg.content.nivel_actual === 'Avanzados 2' ||
          reg.content.nivel_actual === 'Novicios'
        ));
        
      setGruposCat(agrupacionesCat);
      setGrupos(agrupaciones)
      const mergedArray = Object.values({
        ...agrupacionesCat,...agrupaciones
       }).flat()
     setTodosGrupos(mergedArray)
      
      
      

    }, [data]);
  
    return (
      <div className="w-full">
        <h1 className="text-green-700">Lista de Agrupaciones:</h1>
        <ul className="">
          {Object.keys(gruposCat).map((clave, index) => (
            <li key={index} className="p-1 font-bold">
              <span className="text-blue-600">Agrupaciónes Con Categoria: </span>{clave}
              <button
                className="bg-violet-500 w-1/4 rounded-md shadow-lg border-2 border-violet-700 text-violet-200 ml-3"
                onClick={() => {
                  const xmlContent = convertirGrupoAXml(gruposCat[clave],index,gruposCat[clave][0].codigoCompetencia);
                  descargarXml(xmlContent, clave);
                }}
              >
                Descargar XML
              </button>
            </li>
          ))}

        </ul>
        <ul className="">
          {Object.keys(grupos).map((clave, index) => (
            <li key={index} className="p-1 font-bold">
              <span className="text-red-600">Agrupaciónes Sin Categoria: </span>{clave}
              <button
                className="bg-violet-500 w-1/4 rounded-md shadow-lg border-2 border-violet-700 text-violet-200 ml-3"
                onClick={() => {
                  const xmlContent = convertirGrupoAXml(grupos[clave],index,grupos[clave][0].codigoCompetencia);
                  descargarXml(xmlContent, clave);
                }}
              >
                Descargar XML
              </button>
            </li>
          ))}
          
        </ul>

        <ul className="">
         
            <li  className="p-1 font-bold">
              <span className="text-green-600">GENERAL: </span>{'GENERAL'}
              <button
                className="bg-violet-500 w-1/4 rounded-md shadow-lg border-2 border-violet-700 text-violet-200 ml-3"
                onClick={() => {
                  const xmlContent = convertirGrupoAXml(todosGrupos,1,todosGrupos[0].codigoCompetencia);
                  descargarXml(xmlContent, 'GENERAL');
                }}
              >
                Descargar XML
              </button>
            </li>
         
          
        </ul>
       
      </div>
    );
}


