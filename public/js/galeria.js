
const getFotos = async()=>{
  const res = await fetch(API_GALLERY)
  const data = await res.json()

  if(data.success && data.data){
    document.getElementById('titulo_galeria').innerHTML=data.data.titulo
    const esVideo = (mimetype) => Boolean(mimetype) && mimetype.startsWith('video/');

    const newImageData = data.data.fotos.map((i) => {
      const src = `${GALLERY_SERVER}${i.path}`;
      console.log(src)

      if(esVideo(i.mimetype)){
        const video = document.createElement('video');
        video.src = src;
        video.muted = true;
        // Detectamos si el video es horizontal o vertical
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            const orientation = video.videoWidth > video.videoHeight ? 'horizontal' : 'vertical';
            resolve({ src: i.path, orientation, tipo: 'video' });
          };
        });
      }

      const img = new Image();
      img.src = src;
      // Detectamos si la imagen es horizontal o vertical
      return new Promise((resolve) => {
        img.onload = () => {
          const orientation = img.naturalWidth > img.naturalHeight ? 'horizontal' : 'vertical';
          resolve({ src: i.path, orientation, tipo: 'imagen' });
        };
      });
    });

    Promise.all(newImageData).then((fotos) =>{

      let galeria = document.getElementById('galeria_vertical')
      let galeria2 = document.getElementById('galeria_horizontal')

      const crearElementoMedia = (element) => {
        const src = `${GALLERY_SERVER}${element.src}`;
        if(element.tipo === 'video'){
          const video = document.createElement('video')
          video.src = src
          video.controls = true
          video.muted = true
          video.playsInline = true
          video.preload = 'metadata'
          console.log('[VIDEOS]',video.src)
          return video
        }
        const img = document.createElement('img')
        img.src = src
        console.log('[IMAGES]',img.src)
        return img
      }

      fotos.forEach(element => {
        if(element.orientation === 'vertical'){
          const divImg = document.createElement('div')
          divImg.classList.add('image')
          if(element.tipo === 'video') divImg.classList.add('image--video')
          divImg.appendChild(crearElementoMedia(element))
          galeria.appendChild(divImg)
        }


      });

      fotos.forEach(element => {
        if(element.orientation === 'horizontal'){
          const divImg = document.createElement('div')
          divImg.classList.add('image')
          if(element.tipo === 'video') divImg.classList.add('image--video')
          divImg.appendChild(crearElementoMedia(element))
          galeria2.appendChild(divImg)
        }


      });

    // Obtener el modal
 const modal = document.getElementById("myModal");




     // Obtener la imagen y añadir el modal
 const images = document.querySelectorAll(".image");
 const modalImg = document.getElementById("img01");
 images.forEach(function(image) {
  console.log('entrando a ponerles onclick')
   const img = image.querySelector("img");
   if(!img) return; // los videos se reproducen inline, no abren el modal
   img.onclick = function() {
     modal.style.display = "block";
     modalImg.src = this.src;
   }
 });

 // Obtener el span que cierra el modal
  const span = document.getElementById('close_modal');
// Cerrar el modal al hacer clic en el span
span.onclick = function() {
   modal.style.display = "none";
 }



 // Cerrar el modal al hacer clic fuera de la imagen
 window.onclick = function(event) {
  console.log('EVENTO DE MODAL')
   if (event.target === modal) {
     modal.style.display = "none";
   }
 }





    }


    );












  }
}

getFotos()
