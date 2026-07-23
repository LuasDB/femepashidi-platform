import { useState,useEffect,useRef } from 'react';
import './styles.css';

export default function ImageGallery({ items,titulo }){
    const [imageData, setImageData] = useState([]);

    useEffect(() => {
      const newImageData = items.map(({ src, tipo }) => {
        if(tipo === 'video'){
          const video = document.createElement('video');
          video.src = src;

          // Detectamos si el video es horizontal o vertical
          return new Promise((resolve) => {
            video.onloadedmetadata = () => {
              const orientation = video.videoWidth > video.videoHeight ? 'horizontal' : 'vertical';
              resolve({ src, orientation, tipo });
            };
          });
        }

        const img = new Image();
        img.src = src;

        // Detectamos si la imagen es horizontal o vertical
        return new Promise((resolve) => {
          img.onload = () => {
            const orientation = img.naturalWidth > img.naturalHeight ? 'horizontal' : 'vertical';
            resolve({ src, orientation, tipo });
          };
        });
      });

      Promise.all(newImageData).then((data) => setImageData(data));
    }, [items]);

    const renderMedia = (image, index) => {
      if(image.tipo === 'video'){
        return (
          <video
            src={image.src}
            controls
            muted
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl bg-black"
          />
        );
      }
      return (
        <img
          src={image.src}
          alt={`Gallery image ${index}`}
          className="w-full h-full object-cover rounded-xl"
        />
      );
    };

    // Un video siempre ocupa toda la fila, sin importar en qué bloque
    // (vertical/horizontal) haya caído ni el tamaño de pantalla.
    const getWrapperClass = (image, sizeClasses) =>
      image.tipo === 'video'
        ? 'w-full max-w-[700px] mx-auto rounded-xl overflow-hidden border-ice image-to-show'
        : `${sizeClasses} rounded-xl overflow-hidden border-ice image-to-show`;

    return (
      <>
      <div className='flex justify-center'>
      <h2 className='text-blue-700 font-bold'>{titulo}</h2>
      </div>
  
      <div className="flex flex-wrap gap-4 mt-10 mb-10 justify-center">
        {imageData.map((image, index) => {
          if (image.orientation === 'vertical') {
            return (
              <div
                key={index}
                className={getWrapperClass(image, 'w-[250px] h-[350px] md:w-[200px] md:h-[300px] lg:w-[250px] lg:h-[350px]')}

              >
                {renderMedia(image, index)}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-10 mb-10 justify-center">
        {imageData.map((image, index) => {
          if (image.orientation === 'horizontal') {
            return (
              <div
                key={index}
                className={getWrapperClass(image, 'w-[350px] h-[250px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[250px]')}

              >
                {renderMedia(image, index)}
              </div>
            );
          }
          return null;
        })}
      </div>
    </>

    );
  }