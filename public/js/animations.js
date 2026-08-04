

/****************************************************************************************************************
 * Barra de navegación
 * ******************************************************************************************************************/
function selectedMenu(){
  document.querySelectorAll('.nav-menus a').forEach(element => {
    element.classList.remove('selectedMenu');
  })
  this.classList.add('selectedMenu');

  // En mobile el menú es un panel fijo con el scroll del body bloqueado
  // mientras está abierto; si no se cierra aquí, el salto al ancla
  // (#about, #events, etc.) queda bloqueado y parece que no pasa nada.
  const menuButton = document.getElementById('menu_button');
  if(menuButton){
    menuButton.checked = false;
  }
}
document.querySelectorAll('.nav-menus a').forEach(element => {
  element.addEventListener('click',selectedMenu);
})



/*
galeryANIMACION PARA ELEMENTOS HACIA ARRIBA
*/
const observerAbout = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show-up');
        }else{
            entry.target.classList.remove('show-up');
        }
    });
});
const elements_animate= document.querySelectorAll('.scroll-animation-up');
elements_animate.forEach((element) => observerAbout.observe(element));
/*
ANIMACION PARA ELEMENTOS HACIA ABAJO
*/
const observerAbout2 = new IntersectionObserver((entries)=>{

  entries.forEach(entry=>{
      if(entry.isIntersecting){
          entry.target.classList.add('show-down');
      }else{
          entry.target.classList.remove('show-down');
      }
  });
});
const elements_animate2= document.querySelectorAll('.scroll-animation-down');
elements_animate2.forEach((element) => observerAbout2.observe(element));
/*
ANIMACION PARA ELEMENTOS CON SCALE
*/
const observerScale = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('animation-scale');
        }else{
            entry.target.classList.remove('animation-scale');


        }
    });
  });
  const elements_scale= document.querySelectorAll('.animation-event-to-scale');
  elements_scale.forEach((element) => observerScale.observe(element));

/*
ANIMACION PARA ELEMENTOS CON SCALE
*/
const observerRight = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('animation-right');
        }else{
            entry.target.classList.remove('animation-right');
        }
    });
  });
  const elements_right= document.querySelectorAll('.animation-event-to-right');
  elements_right.forEach((element) => observerRight.observe(element));
/*
OBSERVAR SCROLL
*/



document.addEventListener("DOMContentLoaded", function () {
const menu = document.querySelector('#menu');
// Los links del dropdown (submenús de INICIO/EVENTOS) quedan fuera: en
// escritorio siempre deben verse blancos sobre el panel oscuro del dropdown,
// sin importar el color que el scroll le vaya poniendo al resto del nav.
const letras = Array.from(document.querySelectorAll('#menu nav a')).filter(
  (a) => !a.closest('.dropdown-content')
);
const nombre = document.querySelector('#menu div div');

// Función para manejar el evento de scroll
function handleScroll() {
    // Define la media query que deseas verificar
    const mediaQuery = window.matchMedia('(max-width: 1023.98px)');

    // Verifica si la media query coincide actualmente
    if (mediaQuery.matches) {

    }
    else{
        const scrollPosition = window.scrollY;

       if(scrollPosition > 595 ){
        // menu.style.backgroundColor = "rgb(32, 32, 154,0.4)";
        // menu.style.backdropFilter = "blur(15px)";
        // nombre.style.color= "rgb(41 127 144)";
        // letras.forEach(a=>{
        //     a.style.color= "rgb(41 127 144)";
        menu.style.backgroundColor = "rgb(112, 171, 247,0.4)";
        menu.style.backdropFilter = "blur(15px)";
        nombre.style.color= "rgb(41 127 144)";
        letras.forEach(a=>{
            a.style.color= "rgb(41 127 144)";
        }) ;
        }
       else{

        menu.style.backdropFilter = "blur(10px)";
        menu.style.backgroundColor="";
        letras.forEach(a=>{
            a.style.color= "white";
        }) ;
        nombre.style.color= "white";
       }

    }

}


/*PRUEBA*/



// const arrow_down = document.querySelector('.down-arrow img');
//     arrow_down.addEventListener('click',()=>{
//         const ventana_about = document.querySelector('.section-galery2');
//         let desplazamientoY = window.scrollY += ventana_about.clientHeight + 100;

//         window.scrollTo({
//             top:desplazamientoY,
//             behavior:'smooth'
//             });
//             // window.scrollY -= ventana_about.clientHeight + 100;
//     });



// Agrega un event listener para el evento de scroll
window.addEventListener("scroll", handleScroll);


});

/* Para modal de galeria */









