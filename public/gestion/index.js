/****************************************************************************************************************
 * Llamada a formularios
 * ***********************************************************************************************************/
const meses = {
    0:'ENERO',
    1:'FEBRERO',
    2:'MARZO',
    3:'ABRIL',
    4:'MAYO',
    5:'JUNIO',
    6:'JULIO',
    7:'AGOSTO',
    8:'SEPTIEMBRE',
    9:'OCTUBRE',
    10:'NOVIEMBRE',
    11:'DICIEMBRE'
}
function fechaLarga(fecha){
  const e = fecha.split('-');
  console.log(e)
  const f = new Date(e[0],e[1]-1,e[2]);
  console.log(`${f.getDate()} DE ${meses[f.getMonth()]} DE ${f.getFullYear()} `)
  return `${f.getDate()} DE ${meses[f.getMonth()]} DE ${f.getFullYear()} `;
}
function fechaCorta(){
const hoy = new Date();
const año = hoy.getFullYear();
const mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
const dia = ('0' + hoy.getDate()).slice(-2);
return `${año}-${mes}-${dia}`;
}
/****************************************************************************************************************
 * funciones para facilitar el llamado a elementos del DOM
 * ***********************************************************************************************************/
const $ = (elemento)=> document.querySelector(elemento);
const $a = (elemento)=> document.querySelectorAll(elemento);
const n = (elemento)=> document.getElementById(elemento);
const nuevo = (elemento)=> document.createElement(elemento);
const monitor = $('main');
/****************************************************************************************************************
 * Funciones que se agregarán a los btotones principales una vez renderizado el DOM
 ***********************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
    n('patinadores').onclick = ()=> callPatinadoresList();
    n('asociaciones').onclick = ()=> callAsociacionesList();
    n('solicitudes').onclick = ()=> callSolicitudesList();
    n('eventos').onclick = ()=> callEventosList();
    n('comunicados').onclick = ()=> callComunicadosList();
    n('galeria').onclick = ()=> callGaleriaList();
});
/****************************************************************************************************************
 * Variables para la API para mandar a llamar a construir en el monitor
 ***********************************************************************************************************/
const server = 'https://femepashidi-production.up.railway.app/';
// const server = 'http://localhost:3000/';

const API_USERS = `${server}api/v1/users/`;
const API_ASSOCIATIONS = `${server}api/v1/associations/`;
const API_REGISTERS = `${server}api/v1/register/`;
const API_EVENTS = `${server}api/v1/events/`;
const API_COMUNICATIONS = `${server}api/v1/communications/`;
const API_IMAGE = `${server}images/users/`;
const API_DOCUMENTS =  `${server}images/communications/`;
const API_GALLERY = `${server}api/v1/gallery/`;



function formatearNombre(nombre) {
  return nombre.toLowerCase().replace(/\b\w/g, function (letra) {
      return letra.toUpperCase();
  });
}
/****************************************************************************************************************
 * Funciones para mandar a llamar a construir en el monitor
 ***********************************************************************************************************/
const callPatinadoresList = async()=>{
  try {
    const resApi =await fetch(API_USERS);
    const data = await resApi.json();
    monitor.innerHTML=`
    <section class="card bg-blue-100">
    <button class="button" id="descargar">Descargar lista</button>
        <h3>Patinadores</h3>
        <button id="nuevo-patinador"><span class="material-symbols-outlined">
    add_circle
    </span>Nuevo</button>
        <table>
          <thead>
            <tr>
              <th>CURP</th>
              <th>NOMBRE</th>
              <th>NIVEL</th>
              <th>FECHA DE NACIMIENTO</th>
              <th>ASOCIACION</th>
              <th>STATUS</th>
              <th>VER</th>
              <th>EDITAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody id="listado_users">

          </tbody>
        </table>

        <table id="tabla_patinadores" class="hidden">
          <thead>
            <tr>
              <th>ASOCIACION</th>
              <th>CURP</th>
              <th>NOMBRE</th>
              <th>NIVEL</th>
              <th>CATEGORIA</th>
              <th>GENERO</th>
            </tr>
          </thead>
          <tbody id="listado_users_excel">

          </tbody>
        </table>


      </section>`;
    data.documents.forEach(element => {
      let fila = nuevo('tr');
      fila.innerHTML=`
        <td>${element.data.curp}</td>
        <td>${element.data.nombre} ${element.data.apellido_paterno} ${element.data.apellido_materno}</td>
        <td>${element.data.nivel_actual}</td>
        <td>${element.data.fecha_nacimiento}</td>
        <td>${element.data.asociacion.nombre}</td>
        <td>${element.data.verificacion}</td>
        <td id="${element.id}" class="blue"><span class="material-symbols-outlined" id="${element.id}">visibility</span></td>
        <td class="blue" id="${element.id}_edit"><span class="material-symbols-outlined" id="${element.id}_edit">edit</span></td>
        <td id="${element.id}_delete" class="red"><span class="material-symbols-outlined" id="${element.id}_delete">delete</span></td>`;
        n('listado_users').appendChild(fila);

        n(element.id).onclick = ()=> visualizar(element,'users');
        n(`${element.id}_edit`).onclick = ()=> editar(element,'users');
        n(`${element.id}_delete`).onclick = ()=> eliminar(element,'users');


    });
    n('nuevo-patinador').onclick = ()=> nuevoRegistro('patinador');



    //FUNCION PARA ORDENAMIENTO DE TABLA EXCEL
    let conteo={}
    let clave ='';
    data.documents.forEach(element => {
      clave=`${element.data.asociacion.nombre},${element.data.nivel_actual},${element.data.categoria},${element.data.sexo}`;
      if(!conteo[clave]){
        conteo[clave] = { total:0, participantes:{}}
      }
      conteo[clave].total +=1;
    });
    for (const clave in conteo) {
      if (conteo.hasOwnProperty(clave)) {
        data.documents.forEach(element=>{
          let claveElement = `${element.data.asociacion.nombre},${element.data.nivel_actual},${element.data.categoria},${element.data.sexo}`;
          if( clave === claveElement){

            let genero= element.data.sexo ==='FEMENINO'?'FEMENIL':'VARONIL';

             //Creacion de tabla para descarga en excel
            let fila2 = nuevo('tr');
            fila2.innerHTML=`
              <td>${element.data.asociacion.nombre}</td>
              <td>${element.data.curp}</td>
              <td>${formatearNombre(element.data.nombre)} ${element.data.apellido_paterno.toUpperCase()} ${element.data.apellido_materno.toUpperCase()}</td>
              <td>${element.data.nivel_actual}</td>
              <td>${element.data.categoria}</td>
              <td>${genero}</td>
              `;
              n('listado_users_excel').appendChild(fila2);

          }
        });

      }
    }

    n('descargar').onclick = ()=> {
      const tabla = document.getElementById('tabla_patinadores');
      const nombreArchivo = 'lista_patinadores.xlsx';

      let workbook = XLSX.utils.table_to_book(tabla, {sheet: "Patinadores"});
      XLSX.writeFile(workbook, nombreArchivo);
    }




  } catch (error) {
    console.log('ERROR',error);
  }

}
const callAsociacionesList = async()=>{
  try {
    const resApi =await fetch(API_ASSOCIATIONS);
    const data = await resApi.json();
    console.log(data);
    monitor.innerHTML=`
    <section class="card bg-blue-100">
        <h3>Asociaciones</h3>
        <button id="nuevo-asociacion"><span class="material-symbols-outlined">
    add_circle
    </span>Nuevo</button>
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>SIGLAS</th>
              <th>REPRESENTANTE</th>
              <th>CORREO</th>
              <th>STATUS</th>
              <th>EDITAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody id="listado_asociaciones">

          </tbody>
        </table>
      </section>`;
      data.documents.forEach(element =>{
        let fila = nuevo('tr');
        fila.innerHTML=`
        <td>${element.data.nombre}</td>
        <td>${element.data.abreviacion}</td>
        <td>${element.data.representante}</td>
        <td>${element.data.correo}</td>
        <td class="${element.data.status.toLowerCase()}"><p>${element.data.status}</p></td>
        <td class="blue" id="${element.id}"><span class="material-symbols-outlined" id="${element.id}">
          edit
          </span></td>
        <td class="red" id="${element.id}_delete"><span class="material-symbols-outlined" id="${element.id}_delete">
          delete
          </span></td>
        </tr>`;
        n('listado_asociaciones').appendChild(fila);
        n(element.id).onclick = ()=> editar(element,'associations');
        n(`${element.id}_delete`).onclick = ()=> eliminar(element,'associations');
      });
      n('nuevo-asociacion').onclick = ()=> nuevoRegistro('asociacion');
  } catch (error) {
    console.log(error);
  }
}
const callSolicitudesList = async()=>{
  try {
    const resApi =await fetch(API_REGISTERS);
    const data = await resApi.json();
    console.log(data);
    monitor.innerHTML=`
    <section class="card bg-blue-100">
      <button class="button" id="descargar">Descargar lista</button>
        <h3>Solicitudes</h3>
        <table id="tabla">
          <thead>
            <tr>
              <th>COMPETENCIA</th>
              <th>NOMBRE</th>
              <th>CATEGORIA</th>
              <th>NIVEL</th>
              <th>GENERO</th>
              <th>ASOCIACIÓN</th>
              <th>STATUS</th>
              <th>VER SOLICITUD</th>
              <th>EDITAR</th>

              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody id="listado_solicitudes">
          </tbody>
        </table>
      </section>`;
      let conteo={}
      let clave ='';
      data.documents.forEach(element => {
        clave=`${element.data.event.nombre},${element.data.status},${element.data.categoria},${element.data.nivel_actual},${element.data.user.sexo},${element.data.association.abreviacion},`;
        if(!conteo[clave]){
          conteo[clave] = { total:0, participantes:{}}
        }
        conteo[clave].total +=1;
      });

      for (const clave in conteo) {
        if (conteo.hasOwnProperty(clave)) {
          data.documents.forEach(element=>{
            let claveElement = `${element.data.event.nombre},${element.data.status},${element.data.categoria},${element.data.nivel_actual},${element.data.user.sexo},${element.data.association.abreviacion},`;
            if( clave === claveElement){
              let fila = nuevo('tr');
              let genero= element.data.user.sexo==='FEMENINO'?'FEMENIL':'VARONIL';
              fila.innerHTML = `
              <td>${element.data.event.nombre}</td>
              <td>${formatearNombre(element.data.user.nombre)} ${element.data.user.apellido_paterno.toUpperCase()} ${element.data.user.apellido_materno.toUpperCase()}</td>
              <td>${element.data.categoria}</td>
              <td>${element.data.nivel_actual}</td>
              <td>${genero}</td>
              <td>${element.data.association.abreviacion}</td>
              <td class="${element.data.status.toLowerCase()}"><p>${element.data.status.toUpperCase()}</p></td>
              <td class="blue" id="${element.id}"><span class="material-symbols-outlined" id="${element.id}">visibility</span></td>
              <td class="blue" id="${element.id}_editar"><span class="material-symbols-outlined" id="${element.id}">edit</span></td>
              <td class="red" id="${element.id}_delete"><span class="material-symbols-outlined" id="${element.id}_delete">
              delete
              </span></td>`;
              n('listado_solicitudes').appendChild(fila);

             n(`${element.id}`).onclick = ()=> visualizar(element,'register');
             n(`${element.id}_delete`).onclick = ()=> eliminar(element,'register');
             n(`${element.id}_editar`).onclick = ()=> editar(element,'register');


            }



          });

        }
      }

      n('descargar').onclick = ()=> {
        const tabla = document.getElementById('tabla');
        const nombreArchivo = 'solicitudes.xlsx';

        let workbook = XLSX.utils.table_to_book(tabla, {sheet: "Solicitudes"});
        XLSX.writeFile(workbook, nombreArchivo);
      }

      // n('descargar').onclick = ()=> {
      //   console.log('Se fue ')
      //   const tabla = document.getElementById('tabla');
      //   const nombreArchivo = 'solicitudes.xlsx';

      //  let workbook = XLSX.utils.book_new();
      //  let sheet1 = XLSX.utils.aoa_to_sheet([["Elementos de tabla A"]]);
      //  let sheet2 = XLSX.utils.aoa_to_sheet([["Elementos de Tabla B"]]);

      //  workbook = XLSX.utils.table_to_book(tabla,sheet1);

      //  XLSX.utils.book_append_sheet(workbook, sheet1, 'HojaA');
      // XLSX.utils.book_append_sheet(workbook, sheet2, 'HojaB');

      // XLSX.writeFile(workbook, nombreArchivo);

      // }




  } catch (error) {
    console.log(error)
  }
}
const callEventosList = async()=>{
  try {
    const resApi =await fetch(API_EVENTS);
    const data = await resApi.json();
    console.log('evento',data);
    monitor.innerHTML=`
    <section class="card bg-blue-100">
        <h3>Eventos</h3>
        <button id="nuevo-evento"><span class="material-symbols-outlined">
    add_circle
    </span>Nuevo</button>
        <table>
          <thead>
            <tr>
              <th>EVENTO</th>
              <th>FECHA INICIO</th>
              <th>FECHA FIN</th>
              <th>LUGAR</th>
              <th>STATUS</th>
              <th>EDITAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody id="listado_eventos">
          </tbody>
        </table>
      </section>`;
      data.documents.forEach(element =>{
        let fila = nuevo('tr');
        fila.innerHTML = `
        <td>${element.data.nombre}</td>
        <td>${fechaLarga(element.data.fecha_inicio)}</td>
        <td>${fechaLarga(element.data.fecha_fin)}</td>
        <td>${element.data.lugar}</td>
        <td class="${element.data.status.toLowerCase()}"><p>${element.data.status}</p></td>
        <td class="blue" id="${element.id}"><span class="material-symbols-outlined" id="${element.id}">edit</span></td>
        <td class="red" id="${element.id}_delete"><span class="material-symbols-outlined" id="${element.id}_delete">delete</span></td>
        `;
        n('listado_eventos').appendChild(fila);
        n(element.id).onclick = ()=> editar(element,'events');
        n(`${element.id}_delete`).onclick = ()=> eliminar(element,'events');
      });
    n('nuevo-evento').onclick = ()=> nuevoRegistro('evento');
  } catch (error) {
    console.log(error);
  }


}
const callComunicadosList = async()=>{
  try {
    const resApi =await fetch(API_COMUNICATIONS);
    const data = await resApi.json();
    console.log(data);
    monitor.innerHTML=`
    <section class="card bg-blue-100">
        <h3>Comunicados</h3>
        <button id="nuevo-comunicado"><span class="material-symbols-outlined">
    add_circle
    </span>Nuevo</button>
        <table>
          <thead>
            <tr>
              <th>TITULO</th>
              <th>DESCRIPCIÓN</th>
              <th>STATUS</th>
              <th>EDITAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody id="listado_com">

          </tbody>
        </table>
      </section>`;
    data.documents.forEach(element =>{
      let fila = nuevo('tr');
      fila.innerHTML = `
      <td>${element.data.titulo.toUpperCase()}</td>
      <td>${element.data.texto1} ${element.data.texto2} ${element.data.texto3}...</td>
      <td class="${element.data.status.toLowerCase()}"><p>${element.data.status}</p></td>
      <td class="blue" id="${element.id}"><span class="material-symbols-outlined" id="${element.id}">edit</span></td>
      <td class="red" id="${element.id}_delete"><span class="material-symbols-outlined" id="${element.id}_delete">delete</span></td>
      `;
      n('listado_com').appendChild(fila);
      n(element.id).onclick = ()=> editar(element,'communications');
      n(`${element.id}_delete`).onclick = ()=> eliminar(element,'communications');

    });
      n('nuevo-comunicado').onclick = ()=> nuevoRegistro('comunicado');

  } catch (error) {
    console.log(error);
  }
}
const callGaleriaList = async()=>{
  try {
    const resApi = await fetch(API_GALLERY);
    const data = await resApi.json();
    const galeriaActual = data.data;

    monitor.innerHTML = `
    <section class="card bg-blue-100">
        <h3>Galería</h3>
        <button id="nueva-galeria"><span class="material-symbols-outlined">
    add_circle
    </span>Reemplazar galería</button>
        ${galeriaActual
          ? `<p><strong>${galeriaActual.titulo || 'Sin título'}</strong> · ${galeriaActual.fotos.length} foto(s)</p>
             <div class="gallery-preview">
               ${galeriaActual.fotos.map(foto => `<img src="${server}${foto.path}" alt="foto de galería">`).join('')}
             </div>`
          : `<p>Todavía no hay ninguna galería subida.</p>`
        }
      </section>`;
    n('nueva-galeria').onclick = ()=> nuevoRegistro('galeria');
  } catch (error) {
    console.log(error);
  }
}
/****************************************************************************************************************
 * Funciones para mandar a llamar a construir formularios
 ***********************************************************************************************************/
async function nuevoRegistro(tipo){
  switch (tipo) {
    case 'patinador':
      console.log('nuevo:',tipo);
      monitor.innerHTML=formNewUser;

      //Buscamos las asociaciones vigentes
      const res = await fetch(API_ASSOCIATIONS);
      const data_associations=await res.json();
      const associations = data_associations.documents;
      if(data_associations.message != "TODOS"){
        return;
      }
      const asociaciones = n('asociacion');
    associations.forEach(association =>{
    const option = document.createElement('option');
    option.innerHTML=association.data.nombre;
    option.value=association.id;
    asociaciones.appendChild(option);
  })


      n('guardar').onclick = ()=> enviarBd('users');
      let img = n('img_user');
      //Funcionalidad para las imagenes
      n('file_input').addEventListener('change', (event) => {

        // n('nombre_archivo').textContent= event.target.files[0].name;

        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
              img.src = e.target.result;
            };

            reader.readAsDataURL(file);
          }});
      break;
    case 'asociacion':
      console.log('nuevo:',tipo);
      monitor.innerHTML = formNewAssociation;
      n('guardar').onclick = ()=> enviarBd('associations');

      break;
    case 'evento':
      console.log('nuevo:',tipo);
      monitor.innerHTML = formNewEvent;
      n('guardar').onclick = ()=> enviarBd('events');
      break;
    case 'comunicado':
      console.log('nuevo:',tipo);
      monitor.innerHTML = formNewCommunication;
      n('guardar').onclick = ()=> enviarBd('communications');
      let imgCom = n('img_user');
      //Funcionalidad para las imagenes
      n('file_input').addEventListener('change', (event) => {

        // n('nombre_archivo').textContent= event.target.files[0].name;

        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
              imgCom.src = e.target.result;
            };

            reader.readAsDataURL(file);
          }});

      break;
    case 'galeria':
      console.log('nuevo:',tipo);
      monitor.innerHTML = formNewGallery;
      n('guardar').onclick = ()=> enviarBd('gallery');
      //Vista previa de las fotos seleccionadas (varias a la vez)
      n('fotos_input').addEventListener('change', (event) => {
        const preview = n('galeria_preview');
        preview.innerHTML = '';
        Array.from(event.target.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = nuevo('img');
            img.src = e.target.result;
            preview.appendChild(img);
          };
          reader.readAsDataURL(file);
        });
      });
      break;
    default:
      break;
  }
}
/****************************************************************************************************************
 * Funciones para enviar a Base de datos
 ***********************************************************************************************************/
const enviarBd = async(collection)=>{

  Swal.fire({
    title: "¡Estas a punto de registrarte!",
    text: "¿Revisaste que la información sea correcta?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "No,espera",
    confirmButtonText: "Si,claro"
  }).then(async(result) => {
    if (result.isConfirmed){
      switch (collection) {
        case 'users': envioUsuario()
          break;

        case 'associations': envioAsociaciones()
          break;
        case 'events': envioEventos();
          break;
        case 'communications': envioComunicados();
          break;
        case 'gallery': envioGaleria();
          break;


        default:
          break;
      }
    }
  });
}

const actualizarBd= (collection,id)=>{
  Swal.fire({
    title: "¡Estas a punto de actualizar este registro!",
    text: "¿Revisaste que la información sea correcta?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "No,espera",
    confirmButtonText: "Si,claro"
  }).then((result) => {
    if (result.isConfirmed){
      switch (collection) {
        // case 'users': envioActualizarUsuario()
        //   break;

        case 'associations': envioActualizarAsociaciones(id);
          break;
        case 'events': envioActualizarEventos(id);
          break;
        case 'communications': envioActualizarComunicados(id);
          break;
        case 'users': envioActualizarUsers(id);
          break;
        case 'register': envioActualizarRegister(id);
          break;


        default:
          break;
      }
    }
  });
}
/****************************************************************************************************************
 * Funciones para mandar a llamar alguna accion
 ***********************************************************************************************************/
const visualizar = async(element,collection)=>{

  $('section').classList.add('hidden');
  n('modal_bg').classList.remove('hidden');
  let visual = nuevo('section');
  visual.classList.add('card');
  visual.classList.add('modal');
  visual.id = `${element.id}_modal`;
  if(collection === 'users'){
    visual.innerHTML=`
    <div class="header-modal">
    <h3>${titulos[collection]}</h3>
    <span class="material-symbols-outlined red" id="close_modal">
      close_fullscreen
      </span>
    </div>
    <div class="flex-container-input">
    <img class="foto" src="${API_IMAGE}${element.data.img}" alt="Imagen deportista">
    <label for="">CURP
      <p>${element.data.curp}</p>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="">NOMBRE
      <p>${element.data.nombre} ${element.data.apellido_paterno} ${element.data.apellido_materno}</p>
    </label>
    <label for="">FECHA DE NACIMIENTO
      <p>${fechaLarga(element.data.fecha_nacimiento)}</p>
    </label>
    <label for="">LUGAR DE NACIMIENTO
      <p>${element.data.lugar_nacimiento}</p>
    </label>
    <label for="">SEXO
      <p>${element.data.sexo}</p>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="">CORREO
      <p>${element.data.correo}</p>
    </label>
    <label for="">TELEFONO/WHATSAPP
      <p>${element.data.telefono}</p>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="">ASOCIACION A LA QUE PERTENECE
      <p>${element.data.asociacion.nombre}</p>
    </label>
    <label for="">NIVEL ACTUAL
      <p>${element.data.nivel_actual}</p>
    </label>
    <label for="">CATEGORIA
    <p>${element.data.categoria}</p>
  </label>
  </div>


    `;




  }
  if(collection === 'register'){
    visual.innerHTML=`
    <div class="header-modal">
    <h3>${titulos[collection]}</h3>
    <span class="material-symbols-outlined red" id="close_modal">
      close_fullscreen
      </span>
    </div>
    <div class="flex-container-input">
    <img class="foto" src="${API_IMAGE}${element.data.user.img}" alt="Imagen deportista">
    <label for="">CURP
      <p>${element.data.user.curp}</p>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="">NOMBRE
      <p>${element.data.user.nombre} ${element.data.user.apellido_paterno} ${element.data.user.apellido_materno}</p>
    </label>
    <label for="">FECHA DE NACIMIENTO
      <p>${fechaLarga(element.data.user.fecha_nacimiento)}</p>
    </label>
    <label for="">LUGAR DE NACIMIENTO
      <p>${element.data.user.lugar_nacimiento}</p>
    </label>
    <label for="">SEXO
      <p>${element.data.user.sexo}</p>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="">CORREO
      <p>${element.data.user.correo}</p>
    </label>
    <label for="">TELEFONO/WHATSAPP
      <p>${element.data.user.telefono}</p>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="">ASOCIACION A LA QUE PERTENECE
      <p>${element.data.association.nombre}</p>
    </label>
    <label for="">NIVEL ACTUAL
      <p>${element.data.nivel_actual}</p>
    </label>
    <label for="">CATEGORIA
    <p>${element.data.categoria}</p>
  </label>
  </div>

  <div class="flex-container-input">
    <label for="">COMPETENCIA
      <p>${element.data.event.nombre}</p>
    </label>
    <label for="">LUGAR
      <p>${element.data.event.lugar}</p>
    </label>
    <label for="">FECHA DE COMPETENCIA
    <p>${element.data.event.fecha_larga}</p>
  </label>
  </div>
  <div class="flex-container-input">
  <label for="">FECHA DE COMPETENCIA
      <p>${fechaLarga(element.data.fecha_solicitud)}</p>
    </label>
    <label for="">ESTATUS
      <p>${element.data.status.toUpperCase()}</p>
    </label>

      <a href="${API_REGISTERS}approval/${element.id}/aprobado" target="_blank">CLICK AQUI PARA APORBAR</a>

  </div>
    `;
  }
  console.log(element);
  monitor.appendChild(visual);

  // https://femepashidi.siradiacion.com.mx/api/v1/register/approval/RJsxKhJ3tECLyiRCKT5T/aprobado
  n('close_modal').onclick = () => cerrarModal(visual.id);



}
const eliminar = (element,collection)=>{
  console.group('Eliminar');
  console.log(collection);
  console.log(element.id);
  console.groupEnd()
  Swal.fire({
    title: "¡Estas a punto de eliminar este registro!",
    text: "¿Deseas continuar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "No,espera",
    confirmButtonText: "Si,claro"
  }).then(async(result) => {
    if (result.isConfirmed){
      switch (collection) {
        case 'users':
          const borrar = await fetch(`${API_USERS}${element.id}`,{
            method:'DELETE'
          });
          const res = await borrar.json();
          if(res.message){
            Swal.fire({
              title: `${res.message}`,
              text: "El registro se ha BORRADO correctamente",
              icon: "success",
              showConfirmButton: true,
            })
            .then(res=>{
              if(res.isConfirmed){
                window.location.reload();
              }
            });
          }
          break;


        case 'associations':
          const borrarAsoc = await fetch(`${API_ASSOCIATIONS}${element.id}`,{
            method:'DELETE'
          });
          const resAsoc = await borrarAsoc.json();
          if(resAsoc.message){
            Swal.fire({
              title: `${res.message}`,
              text: "El registro se ha BORRADO correctamente",
              icon: "success",
              showConfirmButton: true,
            })
            .then(res=>{
              if(res.isConfirmed){
                window.location.reload();
              }
            });
          }
          break;

        case 'events':
          const borrarEvent = await fetch(`${API_EVENTS}${element.id}`,{
            method:'DELETE'
          });
          const resEvent = await borrarEvent.json();
          if(resEvent.message){
            Swal.fire({
              title: `${resEvent.message}`,
              text: "El registro se ha BORRADO correctamente",
              icon: "success",
              showConfirmButton: true,
            })
            .then(res=>{
              if(res.isConfirmed){
                window.location.reload();
              }
            });
          }
        break;

        case 'communications':
          const borrarCom = await fetch(`${API_COMUNICATIONS}${element.id}`,{
            method:'DELETE'
          });
          const resCom = await borrarCom.json();
          if(resCom.message){
            Swal.fire({
              title: `${resCom.message}`,
              text: "El registro se ha BORRADO correctamente",
              icon: "success",
              showConfirmButton: true,
            })
            .then(res=>{
              if(res.isConfirmed){
                window.location.reload();
              }
            });
          }
          break;

        case 'register':
        const borrarRegister = await fetch(`${API_REGISTERS}${element.id}`,{
          method:'DELETE'
        });
        const resRegister = await borrarRegister.json();
        if(resRegister.message){
          Swal.fire({
            title: `${resRegister.message}`,
            text: "El registro se ha BORRADO correctamente",
            icon: "success",
            showConfirmButton: true,
          })
          .then(res=>{
            if(res.isConfirmed){
              window.location.reload();
            }
          });
        }
      break;


        default:
          break;
      }

    }
  });




}
const editar = (element,collection)=>{
  console.group('Editar');
  console.log(collection);
  console.log(element.id);
  console.groupEnd();

  if(collection === 'users'){
    monitor.innerHTML =`
<datalist id="list_nivel">
<option value="Debutantes 1">Debutantes 1</option>
<option value="Debutantes 1 Artistic">Debutantes 1 Artistic</option>
<option value="Debutantes 2">Debutantes 2</option>
<option value="Debutantes 2 Artistic">Debutantes 2 Artistic</option>
<option value="Pre-Básicos">Pre-Básicos</option>
<option value="Pre-Básicos Artistic">Pre-Básicos Artistic</option>
<option value="Básicos">Básicos</option>
<option value="Básicos Artistic">Básicos Artistic</option>
<option value="Pre-preliminar">Pre-preliminar</option>
<option value="Preliminar">Preliminar</option>
<option value="Intermedios 1">Intermedios 1</option>
<option value="Intermedios 2">Intermedios 2</option>
<option value="Novicios">Novicios</option>
<option value="Avanzados 1">Avanzados 1</option>
<option value="Avanzados 2">Avanzados 2</option>
<option value="Adulto Bronce">Adulto Bronce</option>
<option value="Adulto Plata">Adulto Plata</option>
<option value="Adulto Oro">Adulto Oro</option>
<option value="Adulto Master">Adulto Master</option>
<option value="Adulto Master Elite">Adulto Master Elite</option>
<option value="ADULTO PAREJAS">ADULTO PAREJAS</option>
<option value="ADULTO PAREJAS INTERMEDIATE">ADULTO PAREJAS INTERMEDIATE</option>
<option value="ADULTO PAREJAS MASTER">ADULTO PAREJAS MASTER</option>
<option value="ADULTO PAREJAS MASTER ELITE">ADULTO PAREJAS MASTER ELITE</option>
</datalist>
<datalist id="list_categoria">
<option value="PRE-INFANTIL A">PRE-INFANTIL A</option>
<option value="PRE-INFANTIL B">PRE-INFANTIL B</option>
<option value="INFANTIL A">INFANTIL A</option>
<option value="INFANTIL B">INFANTIL B</option>
<option value="INFANTIL C">INFANTIL C</option>
<option value="JUVENIL A">JUVENIL A</option>
<option value="JUVENIL B">JUVENIL B</option>
<option value="JUVENIL C">JUVENIL C</option>
<option value="MAYOR">MAYOR</option>
<option value="ADULTO">ADULTO</option>
</datalist>
<datalist id="list_verification">
<option value="true">true</option>
<option value="false">false</option>
</datalist>
<form id="form_nuevo">
<section class="card container-form">
<h3>Datos del deportista</h3>
  <div class="flex-container-input">
    <label for="curp">
      CURP
      <input type="text" name="curp" class="envioDb" id="curp" value="${element.data.curp}">
    </label>
  </div>

  <div class="">
    <div class="flex-container-input">
      <label for="nombre"> Nombre
        <input type="text" name="nombre" class="envioDb" value="${element.data.nombre}">
      </label>
      <label for="apellido_paterno"> Apellido paterno
        <input type="text" name="apellido_paterno" class="envioDb" value="${element.data.apellido_paterno}">
      </label><label for="apellido_materno"> Apellido materno
        <input type="text" name="apellido_materno" class="envioDb" value="${element.data.apellido_materno}">
      </label>
    </div>
    <div class="flex-container-input">
      <label for="fecha_nacimiento"> Fecha de nacimiento
        <input type="date" name="fecha_nacimiento" class="envioDb" value="${element.data.fecha_nacimiento}">
      </label>
      <label for="lugar_nacimiento"> Lugar de Nacimiento
        <input type="text" name="lugar_nacimiento" class="envioDb" value="${element.data.lugar_nacimiento}">
      </label>
      <label for="sexo"> Sexo
      <input type="text" name="sexo" class="envioDb" value="${element.data.sexo}">
      </label>
    </div>
    <div class="flex-container-input">
      <label for="correo"> Correo de contacto
        <input type="text" name="correo" class="envioDb" value="${element.data.correo}">
      </label>
      <label for="telefono"> Teléfono/whatsapp
        <input type="text" name="telefono" class="envioDb" value="${element.data.telefono}">
      </label>
    </div>
  </div>
  <div class="flex-container-input">
    <label for="nivel_actual"> Nivel Actual
      <input list="list_nivel" name="nivel_actual" class="envioDb" value="${element.data.nivel_actual}">
    </label>
    <label for="categoria"> Categoria
      <input list="list_categoria" name="categoria" class="envioDb" value="${element.data.categoria}">
  </label>
  <label for="verificacion"> Verificación
      <input list="list_verification" name="verificacion" class="envioDb" value="${element.data.verificacion}">
  </label>
  </div>

  <button id="guardar" type="button">Guardar</button>
</section>
</form>
    `;
  }

  if(collection==='associations'){
    monitor.innerHTML = `
    <form id="form_nuevo">
      <section class="card container-form">
      <h3>Datos de la asociación</h3>
        <div class="flex-container-input">
          <label for="nombre">
            Nombre
            <input type="text" id="nombre" name="nombre" class="envioDb" value="${element.data.nombre}">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="representante">
            Representante
            <input type="text" id="representante"  name="representante" class="envioDb" value="${element.data.representante}">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="correo">
            Correo
            <input type="text" id="correo" name="correo" class="envioDb" value="${element.data.correo}">
          </label>
        </div>
        <div class="flex-container-input">
    <label for="correo">
      Abreviación
      <input type="text" id="abreviacion" name="abreviacion" class="envioDb" value="${element.data.abreviacion}">
    </label>
  </div>
        <div class="flex-container-input">
          <label for="status">
            Status
            <select name="status" id="status" name="status" class="envioDb" value="${element.data.status}">
              <option value="Activo">Activo</option>
              <option value="Baja">Baja</option>
            </select>
          </label>
        </div>
        <button id="guardar" type="button">Guardar</button>
      </section>
    </form>
    `;

  }
  else if(collection==='events'){
    monitor.innerHTML= `
    <form id="form_nuevo">
    <section class="card container-form">
          <h3>Datos de la competencia</h3>

            <div class="flex-container-input">
              <label for="nombre">
                Nombre
                <input type="text" id="nombre" name="nombre" class="envioDb" value="${element.data.nombre}">
              </label>
            </div>
            <div class="flex-container-input">
              <label for="lugar">
                Lugar
                <input type="text" name="lugar" class="envioDb" value="${element.data.lugar}">
              </label>
            </div>
            <div class="flex-container-input">
              <label for="fecha_inicio">
                Fecha de inicio
                <input type="date" name="fecha_inicio" class="envioDb" value="${element.data.fecha_inicio}">
              </label>
            </div>
            <div class="flex-container-input">
              <label for="fecha_fin">
                Fecha de termino
                <input type="date" name="fecha_fin" class="envioDb" value="${element.data.fecha_fin}">
              </label>
            </div>
            <div class="flex-container-input">
              <label for="texto">
                Descripción
                <input type="text" name="texto" class="envioDb" value="${element.data.texto}">
              </label>
            </div>
            <div class="flex-container-input">
              <label for="status">
              Tipo de competencia
              <select name="tipo_competencia" id="tipo_competencia" class="envioDb" >
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
              </select>
              </label>
            </div>
            <div class="flex-container-input">
              <label for="status">
                Status
                <select name="status" id="status" class="envioDb" value="${element.data.status}">
                  <option value="Activo">Activo</option>
                  <option value="Baja">Baja</option>
                </select>
              </label>
            </div>
            <button id="guardar" type="button">Guardar</button>
        </section>
      </form>
    `;
    n('tipo_competencia').value = element.data.tipo_competencia;
    n('status').value = element.data.status;

  }
  else if(collection==='communications'){
    monitor.innerHTML = `
    <form id="form_nuevo" enctype="multipart/form-data">
    <section class="card container-form">
    <h3>Datos del comunicado</h3>

      <div class="flex-container-input">
        <label for="titulo">
          Titulo
          <input type="text" name="titulo" class="envioDb" value="${element.data.titulo}">
        </label>
      </div>
    <h3>Descripcion del comunicado</h3>
      <div class="flex-container-input">
        <label for="texto1">
          Texto 1
          <input type="text" name="texto1" class="envioDb" value="${element.data.texto1}">
        </label>
      </div>
      <div class="flex-container-input">
        <label for="texto2">
          Texto 2
          <input type="text" name="texto2" class="envioDb" value="${element.data.texto2}">
        </label>
      </div>
      <div class="flex-container-input">
        <label for="texto3">
          Texto 3
          <input type="text" name="texto3" class="envioDb" value="${element.data.texto3}">
        </label>
      </div>
      <div class="flex-container-input">
        <label for="texto4">
          Texto 4
          <input type="text" name="texto4" class="envioDb" value="${element.data.texto4}">
        </label>
      </div>
      <div class="flex-container-input">
        <label for="texto5">
          Texto 5
          <input type="text" name="texto5" class="envioDb" value="${element.data.texto5}">
        </label>
      </div>
      <div class="flex-container-input">
        <label for="documento">
          Documento de comunicado
          <input type="file" name="documento" id="documento" class="envioDb">
        </label>
      </div>
      <div class="flex-container-input">
      <figure class="img-update">
      <div>
        <label for="file_input" id="nombre_archivo">Haz click aqui para subir una foto
          <input type="file" style="display:none" id="file_input" name="file_input" class="envioDb fotoNueva" >
          <img src="./user.png" class="img-user" id="img_user">
        </label>
      </div>
    </figure>
      </div>
      <div class="flex-container-input">
        <label for="status">
          Status
          <select name="status" id="status" class="envioDb" value="${element.data.status}">
            <option value="Activo">Activo</option>
            <option value="Baja">Baja</option>
          </select>
        </label>
      </div>
      <button id="guardar" type="button">Guardar</button>
    </section>
    </form>`;
      let imgCom = n('img_user');
      //Funcionalidad para las imagenes
      n('file_input').addEventListener('change', (event) => {

        // n('nombre_archivo').textContent= event.target.files[0].name;

        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
              imgCom.src = e.target.result;
            };

            reader.readAsDataURL(file);
          }});

  }
  else if(collection === 'register'){


    monitor.innerHTML=`
    <form id="form_nuevo">
      <section class="card container-form">

      <h3>Datos del deportista</h3>
  <div class="flex-container-input">
    <label for="curp">
      CURP
      <input type="text" name="curp" class="envioDb" id="curp" value="${element.data.user.curp}">
    </label>
  </div>

  <div class="">
    <div class="flex-container-input">
      <label for="nombre"> Nombre
        <input type="text" name="nombre" class="envioDb" value="${element.data.user.nombre}">
      </label>
      <label for="apellido_paterno"> Apellido paterno
        <input type="text" name="apellido_paterno" class="envioDb" value="${element.data.user.apellido_paterno}">
      </label>
      <label for="apellido_materno"> Apellido materno
        <input type="text" name="apellido_materno" class="envioDb" value="${element.data.user.apellido_materno}">
      </label>
    </div>
    <div class="flex-container-input">
    <label for="sexo"> Sexo
        <input type="text" name="sexo" class="envioDb" value="${element.data.user.sexo}">
      </label>
      <label for="img"> URL IMAGEN
        <input type="text" name="img" class="envioDb" value="${element.data.user.img}">
      </label>
    </div>
    <div class="flex-container-input">
      <label for="fecha_nacimiento"> Fecha de nacimiento
        <input type="date" name="fecha_nacimiento" class="envioDb" value="${element.data.user.fecha_nacimiento}">
      </label>
      <label for="lugar_nacimiento"> Lugar de Nacimiento
        <input type="text" name="lugar_nacimiento" class="envioDb" value="${element.data.user.lugar_nacimiento}">
      </label>

    </div>
    <div class="flex-container-input">
      <label for="correo"> Correo de contacto
        <input type="text" name="correo" class="envioDb" value="${element.data.user.correo}">
      </label>
      <label for="telefono"> Teléfono/whatsapp
        <input type="text" name="telefono" class="envioDb" value="${element.data.user.telefono}">
      </label>
    </div>
  </div>

        <h3>Datos de la inscripcion</h3>
        <div class="flex-container-input">
        <label for="nivel_actual">
          Nivel de inscripción
          <input type="text" name="nivel_actual" class="envioDb"  value="${element.data.nivel_actual}">
        </label>
      </div>
        <div class="flex-container-input">
          <label for="categoria">
            Categoria
            <input type="text" id="categoria" name="categoria" class="envioDb" value="${element.data.categoria}">
          </label>
        </div>

        <div class="flex-container-input">
        <label for="abreviacion">
          Abreviación
          <input type="text" name="abreviacion" class="envioDb"  value="${element.data.association.abreviacion}">
        </label>
      </div> <div class="flex-container-input">
      <label for="correo">
        Correo
        <input type="text" name="correo_a" class="envioDb"  value="${element.data.association.correo}" id="correo_asociacion">
      </label>
    </div>
    <div class="flex-container-input">
    <label for="nombre">
      Nombre de asociacion
      <input type="text" name="nombre_a" class="envioDb"  value="${element.data.association.nombre}" id="nombre_asociacion">
    </label>
  </div> <div class="flex-container-input">
  <label for="representante">
    Representante
    <input type="text" name="representante" class="envioDb"  value="${element.data.association.representante}">
  </label>
</div>

<h3>Datos de la competencia</h3>
<div class="flex-container-input">
<label for="fecha_inicio">
  Fecha Inicio
  <input type="text" name="fecha_inicio" class="envioDb"  value="${element.data.event.fecha_inicio}">
</label>
</div>
<div class="flex-container-input">
  <label for="fecha_fin">
    Fecha Fin
    <input type="text" id="fecha_fin" name="fecha_fin" class="envioDb" value="${element.data.event.fecha_fin}">
  </label>
</div>

<div class="flex-container-input">
<label for="lugar">
  Lugar
  <input type="text" name="lugar" class="envioDb"  value="${element.data.event.lugar}">
</label>
</div> <div class="flex-container-input">
<label for="nombre">
Nombre Competencia
<input type="text" name="nombre_e" class="envioDb"  value="${element.data.event.nombre}" id="nombre_competencia">
</label>
</div>





        <button id="guardar" type="button">Guardar</button>
    </section>
  </form>
    `;
  }


  n('guardar').onclick = ()=> actualizarBd(collection,element.id);

}
const cerrarModal = (id)=>{
  console.log('CERRANDO')
  n('modal_bg').classList.add('hidden');
  n(id).remove();
  $('section').classList.remove('hidden');
}
// Azalea CONTRERAS CALLEJA

/****************************************************************************************************************
 * Funciones de envios
 ***********************************************************************************************************/
async function envioUsuario(){
  console.log('enviando usuarios')
  let curp =n('curp').value;
      const curpVal = curp.toUpperCase();
      await fetch(`${API_USERS}validate/${curpVal}`)
      .then(response => response.json() )
      .then(async(result) =>{

        if(result.resultado){
          Swal.fire({
            title: `Este usuario ya ha sido dado de alta`,
            text: "Esta CURP ya se encuentra registrada",
            icon: "error",
            showConfirmButton: true,
          });
          }else{
          const form = n('form_nuevo');
          const formData = new FormData(form);
          await fetch(API_USERS,{
            method:'POST',
            body:formData
          })
          .then(response => response.json())
          .then(data => {
              if(data.id){
                Swal.fire({
                  title: `${data.message}`,
                  text: "Tu información se guardo correctamente, te enviamos un correo para confirmar tu registro",
                  icon: "success",
                  showConfirmButton: true,
                })
                .then(res=>{
                  if(res.isConfirmed){
                    window.location.reload();
                  }
                });
              }
          });
        }
      });

}

async function envioAsociaciones(){
  console.log('ENVIANDO ASOCIACIONES')
  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);

  const envio = await fetch(`${API_ASSOCIATIONS}`,{
  method:'POST',
  body:formData
  })
  const res = await envio.json();
  if(res.id){
    Swal.fire({
      title: `${res.message}`,
      text: "El nuevo registro se ha guardado correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioEventos(){
  console.log('ENVIANDO eventos')
  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);

  const envio = await fetch(`${API_EVENTS}`,{
  method:'POST',
  body:formData
  })
  const res = await envio.json();
  if(res.id){
    Swal.fire({
      title: `${res.message}`,
      text: "El nuevo registro se ha guardado correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioComunicados(){
  console.log('ENVIANDO comunicados')
  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);

  const envio = await fetch(`${API_COMUNICATIONS}`,{
  method:'POST',
  body:formData
  })
  const res = await envio.json();
  console.log(res)
  if(res.id){
    Swal.fire({
      title: `${res.message}`,
      text: "El nuevo registro se ha guardado correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioGaleria(){
  console.log('ENVIANDO galeria')
  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);

  const envio = await fetch(`${API_GALLERY}`,{
  method:'POST',
  body:formData
  })
  const res = await envio.json();
  console.log(res)
  if(res.success){
    Swal.fire({
      title: "Galería actualizada",
      text: "Las fotos anteriores se eliminaron y se guardó la nueva galería",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }
}

async function envioActualizarAsociaciones(id){

  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);

  const envio = await fetch(`${API_ASSOCIATIONS}/${id}`,{
  method:'PATCH',
  body:formData
  })
  const res = await envio.json();
  if(res.message){
    Swal.fire({
      title: `${res.message}`,
      text: "El registro se ha ACTUALIZADO correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioActualizarEventos(id){

  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);

  const envio = await fetch(`${API_EVENTS}/${id}`,{
  method:'PATCH',
  body:formData
  })
  const res = await envio.json();
  if(res.message){
    Swal.fire({
      title: `${res.message}`,
      text: "El registro se ha ACTUALIZADO correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioActualizarComunicados(id){

  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);
  for (let entry of formData.entries()) {
    console.log(entry);
}

  const envio = await fetch(`${API_COMUNICATIONS}/${id}`,{
  method:'PATCH',
  body:formData
  })
  const res = await envio.json();
  if(res.message){
    Swal.fire({
      title: `${res.message}`,
      text: "El registro se ha ACTUALIZADO correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioActualizarUsers(id){
  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);
  const curp = n('curp').value
  for (let entry of formData.entries()) {
    console.log(entry);
  }
  const envio = await fetch(`${API_USERS}${curp}`,{
    method:'PATCH',
    body:formData
  })
  const res = await envio.json();
  if(res.message){
    Swal.fire({
      title: `${res.message}`,
      text: "El registro se ha ACTUALIZADO correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }


}

async function envioActualizarRegister(id){
  const formulario = n('form_nuevo');
  const formData = new FormData(formulario);
  // Crear objeto para almacenar los datos
const data = {};

data['user']={}
data['association']={}
data['event']={}


  formData.forEach((value,key)=>{
    const input2 = formulario.querySelector(`[name="${key}"]`)
   console.log(input2)

    if(key==='curp' || key==='nombre' || key==='apellido_paterno' || key==='apellido_materno' || key==='fecha_nacimiento' || key==='lugar_nacimiento' || key==='correo' || key==='telefono' || key==='img' || key==='sexo'){

      data.user[key] = value;
    }else if(key ==='abreviacion' || key==='representante' || key==='status' || key==='correo_a' || key==='nombre_a'){
      if( key==='correo_a'){
        data.association['correo']=value;
      }else if(key==='nombre_a'){
        data.association['nombre']=value;
      }else{
        data.association[key]=value;
      }


    }
    else if(key ==='fecha_fin' || key==='fecha_inicio' || key==='lugar' || key==='nombre_e'){
      if(key==='nombre_e'){
        data.event['nombre'] = value;
    }else{
      data.event[key] = value;

    }
    }else{
      data[key] = value;
    }

  });

  console.log(data)

  await fetch(`${API_REGISTERS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
    console.log(res);
    Swal.fire({
      title: `${res.message}`,
      text: "El registro se ha ACTUALIZADO correctamente",
      icon: "success",
      showConfirmButton: true,
    })
    .then(res=>{
      if(res.isConfirmed){
        window.location.reload();
      }
    });
  }
  )
  .catch(error => {
    console.error('Error:', error);
  });




}

