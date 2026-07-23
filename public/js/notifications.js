/****************************************************************************************************************
 * funciones para facilitar el llamado a elementos del DOM
 * ***********************************************************************************************************/
const $ = (elemento)=> document.querySelector(elemento);
const $a = (elemento)=> document.querySelectorAll(elemento);
const n = (elemento)=> document.getElementById(elemento);
const nuevo = (elemento)=> document.createElement(elemento);
/****************************************************************************************************************
 * Variables para la API para mandar a llamar a construir en el monitor
 ***********************************************************************************************************/
// const server_url = 'https://femepashidi-production.up.railway.app/';



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

document.addEventListener("DOMContentLoaded", async function () {
  await fetch(API_COMMUNICATIONS)
    .then(response => response.json())
    .then(data => {
      const comunicados = n('communications_container');
      comunicados.innerHTML = '';

      data.data.forEach(element => {
        if (element.status !== 'Activo') return;

        const textoCompleto = [
          element.texto1,
          element.texto2,
          element.texto3,
          element.texto4
        ].filter(Boolean).join(' ');

        const card = nuevo('article');
        card.classList.add('notification-card');

        card.innerHTML = `
          <figure class="notification-image">
            <img 
              src="${server_url}${element.img}" 
              alt="${element.titulo}"
              loading="lazy"
            >
          </figure>

          <div class="notification-content">
            <span class="notification-tag">Comunicado</span>

            <h3 class="notifications-title">${element.titulo}</h3>

            ${
              textoCompleto 
                ? `<p class="notifications-excerpt">${textoCompleto}</p>` 
                : ''
            }

            <button 
              type="button" 
              class="notification-button"
              data-doc="${element.doc}"
            >
              Ver comunicado
            </button>
          </div>
        `;

        comunicados.appendChild(card);

        const button = card.querySelector('.notification-button');
        button.addEventListener('click', () => showPdf(element.doc));
      });
    })
    .catch(error => console.log(error));

  await fetch(API_EVENTS)
    .then(response => response.json())
    .then(data => {
      const events = n('events_container');
      events.innerHTML = '';

      data.data.forEach(element => {
        if (element.status !== 'Activo') return;

        const card = nuevo('div');
        card.classList.add('carrusel-item');

        card.innerHTML = `
          <article class="event-card">
            <span class="event-tag">${element.lugar || 'Evento sobre hielo'}</span>

            <h2>${element.nombre}</h2>

            <p><strong>Fecha de inicio:</strong> ${fechaLarga(element.fecha_inicio)}</p>
            <p><strong>Fecha de término:</strong> ${fechaLarga(element.fecha_fin)}</p>
            <p>${String(element.texto || '')}</p>

            <div class="area-button-event">
              <a href="${app_url}inscripcion" class="event-button">
                Registrarme
              </a>
            </div>
          </article>
        `;

        events.appendChild(card);
      });
    })
    .catch(error => console.log(error));
});


/****************************************************************************************************************
 * Funcion para abrir PDF
 * ***********************************************************************************************************/
const showPdf = (pdf)=>{
  if(!isMobileDevice()){
  n('myModalPdf').style.display="block";
  n('pdfViewer').src=`${server_url}${pdf}`
  }else{
    window.open(`${server_url}${pdf}`, "_blank");
  }

}
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}
