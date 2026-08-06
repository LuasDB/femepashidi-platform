const ordenarPorNombre = (array) => {
    return array.sort((a, b) => {
        if (a.nombre < b.nombre) {
            return -1;
        }
        if (a.nombre > b.nombre) {
            return 1;
        }
        return 0;
    });
};

function formatoFecha(fechaToEdit) {
  if(!fechaToEdit){
    return ''
  }
  let fechaFormateada=''
    if(fechaToEdit.length > 10){
      const fecha = new Date(fechaToEdit)
      let year1 = fecha.getFullYear();
      let month1 = String(fecha.getMonth() + 1).padStart(2, '0'); 
      let day1 = String(fecha.getDate()).padStart(2, '0');
  
      fechaFormateada = `${year1}-${month1}-${day1}`;
    }else{
      fechaFormateada = fechaToEdit;
    }
    

    const [year, month, day] = fechaFormateada.split('-');
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const mes = meses[parseInt(month) - 1];
    
    return `${day}-${mes}-${year}`;
  }
 
function obtenerEtiqueta(nivel, genero, categoria = "") {
  // Normalizamos entradas
  const nivelKey = nivel.trim().toUpperCase();
  const generoKey = genero.trim().toLowerCase();
  const categoriaKey = categoria.trim().toUpperCase();


  if(nivelKey === 'AVANZADOS 1' && categoriaKey === 'AVANZADOS 1 ABIERTO' && generoKey ==='femenino'){
    return 'FSKWSINGLES-JUNIOA----------------'
  }else if(nivelKey === 'AVANZADOS 1' && categoriaKey === 'AVANZADOS 1 ABIERTO' && generoKey ==='masculino'){
    return 'FSKMSINGLES-JUNIOA----------------'
  }

  if(nivelKey === 'NOVICIOS' && categoriaKey === 'NOVICIOS ABIERTO' && generoKey ==='femenino'){
    return 'FSKWSINGLES-ADVNOA----------------'
  }else if(nivelKey === 'NOVICIOS' && categoriaKey === 'NOVICIOS ABIERTO' && generoKey ==='masculino'){
    return 'FSKMSINGLES-ADVNOA----------------'
  }
  
 
  
  // Etiquetas de niveles sin categoría
  const etiquetasFemeniles = {
  'ADVANCED NOVICE': 'FSKWSINGLES-ADVNOV----------------',
  'AVANZADOS 1': 'FSKWSINGLES-JUNIOR----------------',
  'AVANZADOS 1 (ISU)': 'FSKWSINGLES-JUNIOR----------------',
  'AVANZADOS 1 ABIERTO': 'FSKWSINGLES-JUNIOA----------------',
  'AVANZADOS 2': 'FSKWSINGLES-----------------------',
  'JUNIOR': 'FSKWSINGLES-JUNIOR----------------',
  'NOVICE': 'FSKWSINGLES-ADVNOA----------------',
  'NOVICIOS': 'FSKWSINGLES-ADVNOV----------------',
  'NOVICIOS (ADVANCED NOVICE) ISU': 'FSKWSINGLES-ADVNOV----------------',
  'NOVICIOS (ISU)': 'FSKWSINGLES-ADVNOV----------------',
  // 'NOVICIOS ABIERTO': 'FSKWSINGLES-ADVNOA----------------',
  'SENIOR': 'FSKWSINGLES-SENIOR----------------',
}
  
  const etiquetasVaroniles = {
  'ADVANCED NOVICE': 'FSKMSINGLES-ADVNOV----------------',
  'AVANZADOS 1': 'FSKMSINGLES-JUNIOR----------------',
  'AVANZADOS 1 (ISU)': 'FSKMSINGLES-JUNIOR----------------',
  'AVANZADOS 1 ABIERTO': 'FSKMSINGLES-JUNIOA----------------',
  'AVANZADOS 2': 'FSKMSINGLES-----------------------',
  'JUNIOR': 'FSKMSINGLES-JUNIOR----------------',
  'NOVICE': 'FSKMSINGLES-ADVNOV----------------',
  'NOVICIOS': 'FSKMSINGLES-ADVNOV----------------',
  'NOVICIOS (ADVANCED NOVICE) ISU': 'FSKMSINGLES-ADVNOV----------------',
  'NOVICIOS (ISU)': 'FSKMSINGLES-ADVNOV----------------',
  // 'NOVICIOS ABIERTO': 'FSKMSINGLES-ADVNOA----------------',
  'SENIOR': 'FSKMSINGLES-SENIOR----------------',
};

  // Etiquetas de niveles con categoría 
  const etiquetasFemenilesCat = {
      'INTERMEDIOS 2': 'FSKWSINGLES-IN2CAT----------------',
      'INTERMEDIOS 1': 'FSKWSINGLES-IN1CAT----------------',
      'PRELIMINAR':'FSKWSINGLES-PRECAT----------------',
      'PRE-PRELIMINAR':'FSKWSINGLES-PPRCAT----------------',
      'PRE-PRELIMINAR ESPECIAL':'FSKWSINGLES-PPECAT----------------',
      'BÁSICOS':'FSKWSINGLES-BASCAT----------------',
      'BÁSICOS ESPECIAL':'FSKWSINGLES-BAECAT----------------',
      'BASICOS':'FSKWSINGLES-BASCAT----------------',
      'BASICOS ESPECIAL':'FSKWSINGLES-BAECAT----------------',
      'PRE-BÁSICOS':'FSKWSINGLES-PRBCAT----------------',
      'PRE-BASICOS':'FSKWSINGLES-PRBCAT----------------',
      'PRE BÁSICOS':'FSKWSINGLES-PRBCAT----------------',
      'PRE-BÁSICOS ESPECIAL':'FSKWSINGLES-PRECAT----------------',
      'DEBUTANTES 2':'FSKWSINGLES-DE2CAT----------------',
      'DEBUTANTES 2 ESPECIAL':'FSKWSINGLES-D2ECAT----------------',
      'DEBUTANTES 1':'FSKWSINGLES-DE1CAT----------------',
      'ADULTO BRONCE':'FSKWSINGLES-BRTCAT----------------',
      'ADULTO BRONCE ARTISTICO':'FSKWSINGLES-BRACAT----------------',
      'ADULTO BRONCE ESPECIAL ARTISTICO':'FSKWSINGLES-BRECAT----------------',
      'ADULTO PLATA':'FSKWSINGLES-SITCAT----------------',
      'ADULTO PLATA ARTISTICO':'FSKWSINGLES-SIACAT----------------',
      'ADULTO ORO':'FSKWSINGLES-GOTCAT----------------',
      'ADULTO ORO ARTISTICO':'FSKWSINGLES-GOACAT----------------',
      'ADULTO MASTER':'FSKWSINGLES-MATCAT----------------',
      'ADULTO MASTER ARTISTICO':'FSKWSINGLES-MAACAT----------------',
      'ADULTO ELITE':'FSKWSINGLES-ELTCAT----------------',
      'ADULTO ELITE ARTISTICO':'FSKWSINGLES-ELACAT----------------',
      // 'PRE-PRELIMINARY':'FSKWSINGLES-PPYCAT----------------',
      'PRE-PRELIMINARY SPECIAL':'FSKWSINGLES-PYSCAT----------------',
      // 'PRELIMINARY':'FSKWSINGLES-PRYCAT----------------',
      // 'JUVENILE':'FSKWSINGLES-JUVCAT----------------',
      // 'INTERMEDIATE':'FSKWSINGLES-INTCAT----------------',
      'OPEN PRE-PRELIMINARY':'FSKWSINGLES-PPYCAT----------------',
      'OPEN PRE-PRELIMINARY SPECIAL':'FSKWSINGLES-PYSCAT----------------',
      'OPEN PRELIMINARY':'FSKWSINGLES-PRYCAT----------------',
      'OPEN JUVENILE':'FSKWSINGLES-JUVCAT----------------',
      'OPEN INTERMEDIATE':'FSKWSINGLES-INTCAT----------------',
      'ADULT BRONZE':'FSKWSINGLES-BRTCAT----------------',
      'ADULT BRONZE ARTISTIC':'FSKWSINGLES-BRACAT----------------',
      'ADULT SILVER':'FSKWSINGLES-SITCAT----------------',
      'ADULT SILVER ARTISTIC':'FSKWSINGLES-SIACAT----------------',
      'ADULT GOLD':'FSKWSINGLES-GOTCAT----------------',
      'ADULT GOLD ARTISTIC':'FSKWSINGLES-GOACAT----------------',
      'ADULT MASTER':'FSKWSINGLES-MATCAT----------------',
      'ADULT MASTER ARTISTIC':'FSKWSINGLES-MAACAT----------------',
      'ADULT ELITE':'FSKWSINGLES-ELTCAT----------------',
      'ADULT ELITE ARTISTIC':'FSKWSINGLES-ELACAT----------------',
      'BRONZE':'FSKWSINGLES-BRTCAT----------------',
      'BRONZE ARTISTIC':'FSKWSINGLES-BRACAT----------------',
      'BRONZE SPECIAL ARTISTIC':'FSKWSINGLES-BEACAT----------------',
      'SILVER':'FSKWSINGLES-SITCAT----------------',
      'SILVER ARTISTIC':'FSKWSINGLES-SIACAT----------------',
      'GOLD':'FSKWSINGLES-GOTCAT----------------',
      'GOLD ARTISTIC':'FSKWSINGLES-GOACAT----------------',
      'MASTER':'FSKWSINGLES-MATCAT----------------',
      'MASTER ARTISTIC':'FSKWSINGLES-MAACAT----------------',
      'ELITE':'FSKWSINGLES-ELTCAT----------------',
      'ELITE ARTISTIC':'FSKWSINGLES-ELACAT----------------',
      //Nuevos
      'DEBUTANTS':'FSKWSINGLES-DEBCAT----------------',
      'BEGINNERS':'FSKWSINGLES-BEGCAT----------------',
      'PRE-BASICS':'FSKWSINGLES-PRBCAT----------------',
      'BASICS':'FSKWSINGLES-BASCAT----------------',
      'ADVANCED BASICS':'FSKWSINGLES-ADBCAT----------------',
      'PRE-PRELIMINARY':'FSKWSINGLES-PRPCAT----------------',
      'PRELIMINARY':'FSKWSINGLES-PRECAT----------------',
      'PRE-JUVENILE':'FSKWSINGLES-PRJCAT----------------',
      'JUVENILE':'FSKWSINGLES-JUVCAT----------------',
      'INTERMEDIATE':'FSKWSINGLES-INTCAT----------------',
      //
      'BRONCE ARTISTICA':'FSKWSINGLES-BRACAT----------------',
      'PLATA ARTISTICA':'FSKWSINGLES-SIACAT----------------',
      'ORO ARTISTICA':'FSKWSINGLES-GOACAT----------------',
      'MASTER ARTISTICA':'FSKWSINGLES-MAACAT----------------',
      'ELITE ARTISTICA':'FSKWSINGLES-ELACAT----------------',


  };

  const etiquetasVaronilesCat = {
      'INTERMEDIOS 2': 'FSKMSINGLES-IN2CAT----------------',
      'INTERMEDIOS 1': 'FSKMSINGLES-IN1CAT----------------',
      'PRELIMINAR':'FSKMSINGLES-PRECAT----------------',
      'PRE-PRELIMINAR':'FSKMSINGLES-PPRCAT----------------',
      'PRE-PRELIMINAR ESPECIAL':'FSKMSINGLES-PPECAT----------------',
      'BÁSICOS':'FSKMSINGLES-BASCAT----------------',
      'BASICOS':'FSKMSINGLES-BASCAT----------------',
      'PRE-BÁSICOS':'FSKMSINGLES-PRBCAT----------------',
      'PRE-BASICOS':'FSKMSINGLES-PRBCAT----------------',
      'PRE BÁSICOS':'FSKMSINGLES-PRBCAT----------------',
      'DEBUTANTES 2':'FSKMSINGLES-DE2CAT----------------',
      'DEBUTANTES 2 ESPECIAL':'FSKMSINGLES-D2ECAT----------------',
      'DEBUTANTES 1':'FSKMSINGLES-DE1CAT----------------',
      'ADULTO BRONCE':'FSKMSINGLES-BRTCAT----------------',
      'ADULTO PLATA':'FSKMSINGLES-SITCAT----------------',
      'ADULTO ORO':'FSKMSINGLES-GOTCAT----------------',
      'ADULTO MASTER':'FSKMSINGLES-MATCAT----------------',
      'ADULTO ELITE':'FSKMSINGLES-ELTCAT----------------',
      'ADULTO BRONCE ARTISTICO':'FSKMSINGLES-BRACAT----------------',
      'ADULTO BRONCE ESPECIAL ARTISTICO':'FSKMSINGLES-BRECAT----------------',
      'ADULTO PLATA ARTISTICO':'FSKMSINGLES-SIACAT----------------',
      'ADULTO ORO ARTISTICO':'FSKMSINGLES-GOACAT----------------',
      'ADULTO MASTER ARTISTICO':'FSKMSINGLES-MAACAT----------------',
      'ADULTO ELITE ARTISTICO':'FSKMSINGLES-ELACAT----------------',
      'BÁSICOS ESPECIAL':'FSKMSINGLES-BAECAT----------------',
      'BASICOS ESPECIAL':'FSKMSINGLES-BAECAT----------------',
      'PRE-BÁSICOS ESPECIAL':'FSKMSINGLES-PRECAT----------------',
      // 'PRE-PRELIMINARY':'FSKMSINGLES-PPYCAT----------------',
      'PRE-PRELIMINARY SPECIAL':'FSKMSINGLES-PYSCAT----------------',
      // 'PRELIMINARY':'FSKMSINGLES-PRYCAT----------------',
      // 'JUVENILE':'FSKMSINGLES-JUVCAT----------------',
      // 'INTERMEDIATE':'FSKMSINGLES-INTCAT----------------',
      'OPEN PRE-PRELIMINARY':'FSKMSINGLES-PPYCAT----------------',
      'OPEN PRE-PRELIMINARY SPECIAL':'FSKMSINGLES-PYSCAT----------------',
      'OPEN PRELIMINARY':'FSKMSINGLES-PRYCAT----------------',
      'OPEN JUVENILE':'FSKMSINGLES-JUVCAT----------------',
      'OPEN INTERMEDIATE':'FSKMSINGLES-INTCAT----------------',
      'ADULT BRONZE':'FSKMSINGLES-BRTCAT----------------',
      'ADULT BRONZE ARTISTIC':'FSKMSINGLES-BRACAT----------------',
      'ADULT SILVER':'FSKMSINGLES-SITCAT----------------',
      'ADULT SILVER ARTISTIC':'FSKMSINGLES-SIACAT----------------',
      'ADULT GOLD':'FSKMSINGLES-GOTCAT----------------',
      'ADULT GOLD ARTISTIC':'FSKMSINGLES-GOACAT----------------',
      'ADULT MASTER':'FSKMSINGLES-MATCAT----------------',
      'ADULT MASTER ARTISTIC':'FSKMSINGLES-MAACAT----------------',
      'ADULT ELITE':'FSKMSINGLES-ELTCAT----------------',
      'ADULT ELITE ARTISTIC':'FSKMSINGLES-ELACAT----------------',
      'BRONZE':'FSKMSINGLES-BRTCAT----------------',
      'BRONZE ARTISTIC':'FSKMSINGLES-BRACAT----------------',
      'BRONZE SPECIAL ARTISTIC':'FSKMSINGLES-BEACAT----------------',
      'SILVER':'FSKMSINGLES-SITCAT----------------',
      'SILVER ARTISTIC':'FSKMSINGLES-SIACAT----------------',
      'GOLD':'FSKMSINGLES-GOTCAT----------------',
      'GOLD ARTISTIC':'FSKMSINGLES-GOACAT----------------',
      'MASTER':'FSKMSINGLES-MATCAT----------------',
      'MASTER ARTISTIC':'FSKMSINGLES-MAACAT----------------',
      'ELITE':'FSKMSINGLES-ELTCAT----------------',
      'ELITE ARTISTIC':'FSKMSINGLES-ELACAT----------------',
      'ADVANCED NOVICE':'FSKMSINGLES-ADVNOV----------------',
      'JUNIOR':'FSKMSINGLES-JUNIOR----------------',
      'SENIOR':'FSKMSINGLES-SENIOR----------------',
      //Nuevos
      'DEBUTANTS':'FSKMSINGLES-DEBCAT----------------',
      'BEGINNERS':'FSKMSINGLES-BEGCAT----------------',
      'PRE-BASICS':'FSKMSINGLES-PRBCAT----------------',
      'BASICS':'FSKMSINGLES-BASCAT----------------',
      'ADVANCED BASICS':'FSKMSINGLES-ADBCAT----------------',
      'PRE-PRELIMINARY':'FSKMSINGLES-PRPCAT----------------',
      'PRELIMINARY':'FSKMSINGLES-PRECAT----------------',
      'PRE-JUVENILE':'FSKMSINGLES-PRJCAT----------------',
      'JUVENILE':'FSKMSINGLES-JUVCAT----------------',
      'INTERMEDIATE':'FSKMSINGLES-INTCAT----------------',
      //
      'BRONCE ARTISTICA':'FSKMSINGLES-BRACAT----------------',
      'PLATA ARTISTICA':'FSKMSINGLES-SIACAT----------------',
      'ORO ARTISTICA':'FSKMSINGLES-GOACAT----------------',
      'MASTER ARTISTICA':'FSKMSINGLES-MAACAT----------------',
      'ELITE ARTISTICA':'FSKMSINGLES-ELACAT----------------',
  };

  // Mapeo de categorías
  const categorias = {
      'PRE-INFANTIL A': 'PRI',
      'PRE-INFANTIL B': 'PRI',
      'INFANTIL A': 'INA',
      'INFANTIL B': 'INB',
      'INFANTIL C': 'INC',
      'JUVENIL A': 'JUA',
      'JUVENIL B': 'JUB',
      'JUVENIL C': 'JUC',
      'MAYOR': 'MAY',
      'CLASS I':'CL1',
      'CLASS II':'CL2',
      'CALSS II':'CL2',
      'CLASS III':'CL3',
      'CLASS IV':'CL4',
      'CLASE I':'CL1',
      'CLASE II':'CL2',
      'CLASE III':'CL3',
      'CLASE IV':'CL4',
      'CLASS 1':'CL1',
      'CLASS 2':'CL2',
      'CLASS 3':'CL3',
      'CLASS 4':'CL4',
      'ADULTO':'ADU',
      'A':'AAA',
      'B':'BBB',
      'C':'CCC',
      'D':'DDD',
      //nUEVOS
      'MINORS':'MIN',
      'CHILDREN':'CHI',
      'PRE-TEENS':'PRT',
      'TEENS':'TEE',
      'YOUNG ADULTS':'YAD',
      'ESPECIAL':'TEE',
  };

  // Selección de etiqueta
  let etiqueta = '';
  if (generoKey === 'femenino') {
      etiqueta = etiquetasFemeniles[nivelKey] || etiquetasFemenilesCat[nivelKey];
  } else {
      etiqueta = etiquetasVaroniles[nivelKey] || etiquetasVaronilesCat[nivelKey];
  }

  // Reemplazo de categoría
  if (etiqueta && categoriaKey) {
      const idCategoria = categorias[categoriaKey];
      if (idCategoria) {
          etiqueta = etiqueta.replace('CAT', idCategoria);
      }
  }

  return etiqueta || 'Nivel o género no válido';
}

//Linea Para probar la función de etiqueta
console.log(obtenerEtiqueta('PRE-BÁSICOS','FEMENINO','MAYOR'))

function formatoNumeroMX(numero) {
  return Number(numero).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
}

function formatoFolios(numero, digitos) {
  // Convertir el número a cadena
  let numStr = numero.toString();
  
  // Rellenar con ceros a la izquierda hasta alcanzar la longitud deseada
  while (numStr.length < digitos) {
    numStr = '0' + numStr;
  }

  return numStr;
}

function generateUID() {
  const timestamp = Date.now().toString(36); // Convertir la marca de tiempo a base 36
  const randomNumber = Math.random().toString(36).substring(2, 15); // Generar un número aleatorio y convertirlo a base 36
  const uid = (timestamp + randomNumber).substring(0, 20); // Combinar ambos y truncar a 20 caracteres
  return uid;
}
  

  function formatoFechaHora(fechaToEdit){
  
  const fechaHora = fechaToEdit.toString().split('T');

  return `${formatoFecha(fechaToEdit)} a las ${fechaHora[1]} HRS`
}


function sumaArray(array,item){

  return array.reduce((sum,current)=>{
    return sum + parseFloat(current[item])
  },0)
}

function generarListaYears(initYear){

  let year = []
  let currentYear = new Date().getFullYear()
  for (let index = initYear; index <= currentYear; index++) {
    year.push(index)
    
  }

  return year
  
}

function ordenarPorItem(array,item){
  return array.sort((a, b) => {
      if (a[item] < b[item]) {
          return -1;
      }
      if (a[item] > b[item]) {
          return 1;
      }
      return 0;
  });
}
function fechaHoraActual(){
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza desde 0
  const dia = fecha.getDate().toString().padStart(2, '0');
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
  return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
 
  
}

function formatoNombre(nombre) {
  // Convierte todo el nombre a minúsculas y luego lo divide por espacios
  return nombre
    .toLowerCase()
    .split(' ') // Divide el nombre en palabras
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
    .join(' '); // Une las palabras nuevamente en una cadena
}

function fechaActual() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
  const day = String(fecha.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function obtenerTimestamp() {
  const ahora = new Date();
  
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');
  const milisegundos = String(ahora.getMilliseconds()).padStart(3, '0');

  return `${horas}${minutos}${segundos}${milisegundos}`;
}

function formatoDosDigitos(numero) {
  return String(numero).padStart(2, '0');
}

function obtenerCategoria(fechaNacimiento, nivel, isAdult=false) {
  
  const fecha = new Date(fechaNacimiento);
  const cutoffDate = new Date('2026-07-01');

  const edadAlCorte = cutoffDate.getFullYear() - fecha.getFullYear() - (
    cutoffDate < new Date(cutoffDate.getFullYear(), fecha.getMonth(), fecha.getDate()) ? 1 : 0
  );
  console.log(edadAlCorte);

  const time = fecha.getTime();

  // Rangos normales (no adultos)
  const rangos = {
    'PRE-INFANTIL': [
      new Date('2022-07-01').getTime(),
      new Date('2026-06-30').getTime()
    ],
    'INFANTIL A': [
      new Date('2019-07-01').getTime(),
      new Date('2022-06-30').getTime()
    ],
    'INFANTIL B': [
      new Date('2016-07-01').getTime(),
      new Date('2019-06-30').getTime()
    ],
    'JUVENIL A': [
      new Date('2012-07-01').getTime(),
      new Date('2016-06-30').getTime()
    ],
    'JUVENIL B': [
      new Date('2008-07-01').getTime(),
      new Date('2012-06-30').getTime()
    ],
    'MAYOR': [
      new Date('1998-07-01').getTime(),
      new Date('2008-06-30').getTime()
    ]
  };

  // Rangos adultos según documento
  const rangosAdultos = {
    'CLASS I': [
      new Date('1987-07-01').getTime(),
      new Date('1997-06-30').getTime()
    ],
    'CLASS II': [
      new Date('1977-07-01').getTime(),
      new Date('1987-06-30').getTime()
    ],
    'CLASS III': [
      new Date('1967-07-01').getTime(),
      new Date('1977-06-30').getTime()
    ],
    'CLASS IV': [
      new Date('1957-07-01').getTime(),
      new Date('1967-06-30').getTime()
    ],
    'CLASS V': [
      0, // antes de 1957-06-30
      new Date('1957-06-30').getTime()
    ]
  };
    console.log('IsAdult:',isAdult)

  if (isAdult) {
    // Competidor adulto → buscar en rangos adultos
    for (const [categoria, [inicio, fin]] of Object.entries(rangosAdultos)) {
      if (time >= inicio && time <= fin) {
        return categoria;
      }
      // Clase V: nacidos antes de 30 junio 1957
      if (categoria === 'CLASS V' && time <= fin) {
        return categoria;
      }
    }
  } else {
    console.log('[NIVELES ISU]')
    // Niveles ISU
    if (nivel === 'NOVICIOS') {
      if (edadAlCorte >= 10 && edadAlCorte < 16) {
        return 'NOVICIOS (ADVANCED NOVICE) ISU';
      }else{
        return 'NOVICIOS ABIERTO';
      }
    } else if (nivel === 'AVANZADOS 1') {
      if (edadAlCorte >= 13 && edadAlCorte < 19) {
        return 'AVANZADOS 1 (JUNIOR) ISU';
      }else{
        return 'AVANZADOS 1 ABIERTO';
      }
    } else if (nivel === 'AVANZADOS 2') {
      if (edadAlCorte >= 17) {
        return 'AVANZADOS 2 (SENIOR) ISU';
      }else{
        return 'AVANZADOS 2 ABIERTO';
      }
    } else {
      // Otras categorías juveniles
      for (const [categoria, [inicio, fin]] of Object.entries(rangos)) {
        if (time >= inicio && time <= fin) {
          return categoria;
        }
      }

      // Si nació antes del 1 de julio 1998 y no es adulto → general
      if (time < new Date('1998-07-01').getTime()) {
        return 'ADULTO';
      }
    }
  }

  return 'Sin categoría aplicable';
}
console.log(obtenerCategoria('2005-11-11','AVANZADOS 1'))


export { 
  ordenarPorNombre,
  formatoFecha,
  formatoNumeroMX,
  formatoFolios,
  formatoFechaHora,
  sumaArray,
  generarListaYears,
  ordenarPorItem,
  fechaHoraActual,
  formatoNombre,
  fechaActual,
  obtenerTimestamp,
  formatoDosDigitos,
  obtenerEtiqueta,
  generateUID,
  obtenerCategoria
}