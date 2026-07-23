import React, { useState,useEffect,useRef } from 'react';
import { Button, Card, CardBody, CardImg, CardTitle, Col, Row, Input,FormGroup,Label } from 'reactstrap';
import { FaTimes } from 'react-icons/fa'; 
import GaleriaImagenes from './../../Components/GaleriaImagenes'
import Swal from 'sweetalert2';
import axios from 'axios';
import { server } from './../../db/server'

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [filesList,setFilesList] = useState([])
  const [titulo,setTitulo] = useState('')


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFilesList([...filesList, file])


    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos([...photos, reader.result]);

      };
      reader.readAsDataURL(file);
    }




  };

  const esVideo = (file) => Boolean(file) && file.type.startsWith('video/');

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));

    setFilesList(filesList.filter((_,i) => i !== index))
  };

  const hanldeUpdateGallery = async()=>{


    if(photos.length === 0 || titulo === ''){
      Swal.fire('Antención', 'Es necesario que coloques el titulo y subas por lo menos una imagen o video para poder actualizar tu galeria','warning')
      return
    }

    try {

      const formData = new FormData();
        formData.append('titulo',titulo)
        filesList.forEach((file,index)=>{
        formData.append(`foto_${index}`,file)
      })


      const { data } = await axios.post(`${server}api/v1/gallery`,formData,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if(data.success){

      Swal.fire('Galeria actualizada', 'La galeria se actualizó correctamente','success')

      }
    } catch (error) {
      Swal.fire('Algo salio mal', 'algo salio mal y no se pudo actualizar tu galeria:' + error,'warning')
      
    }
  }

  return (
    <div>
    <Row>
      <Col md={6}>
      <FormGroup >
      <Label>Titulo de la Galeria</Label>
      </FormGroup>
        <Input type="text" placeholder='Ejemplo: Torneo nacional 2024' onChange={(e)=>setTitulo(e.target.value)}/>
      </Col>
    </Row>
      <Row className='m-5'>
        {/* Botón para agregar una nueva foto */}
        <Col md="3">
          <Card onClick={() => document.getElementById('photoInput').click()} style={{ cursor: 'pointer' }} className='border-2 border-dashed border-gray-400 rounded-lg p-6 flex justify-center items-center cursor-pointer hover:bg-gray-100  h-80'>
            <CardBody className=''>
              <CardTitle className="text-4xl text-gray-400text-center ">+</CardTitle>
            </CardBody>
          </Card>
        </Col>

     
        {photos.map((photo, index) => (
          <Col md={esVideo(filesList[index]) ? '12' : '3'} key={index}>
            <Card className='relative'>
              {esVideo(filesList[index])
                ? <video src={photo} controls muted className='w-100' style={{ maxHeight: '70vh' }} />
                : <CardImg top src={photo} alt="Photo" className='h-80'/>
              }
                <FaTimes  onClick={() => removePhoto(index)} className='absolute top-1 right-1 cursor-pointer text-red-500' />
            </Card>
          </Col>
        ))}
      </Row>

    

      {/* Input oculto para subir fotos o videos */}
      <Input
        type="file"
        id="photoInput"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />

      {/* Botón para guardar los cambios */}
      <Button color="success" className="mt-3" onClick={hanldeUpdateGallery}>Guardar nueva galeria</Button>

      <GaleriaImagenes
        items={photos.map((src, index) => ({ src, tipo: esVideo(filesList[index]) ? 'video' : 'imagen' }))}
        titulo={titulo}
      />
    </div>

  );
};



export default PhotoGallery;
