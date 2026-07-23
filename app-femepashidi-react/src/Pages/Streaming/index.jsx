import { useState,useEffect } from 'react'
import axios from 'axios'
import Snowfall from 'react-snowfall'
import { Container,Row,Col } from 'reactstrap'
import Swal from 'sweetalert2'
import { server } from './../../db/server'


export default function Streaming(){
    const [data, setData] = useState({
        textoInicio: '',
        urlStream: '',
        linkStatus: false
    })

    function extractSrc(iframeString) {
        // Expresión regular para encontrar el valor del atributo src
        const srcMatch = iframeString.match(/src="([^"]+)"/);
        
        // Si hay coincidencia, devolver el valor de src
        if (srcMatch && srcMatch[1]) {
          return srcMatch[1];
        } else {
          return null; // Si no encuentra el src, devuelve null
        }
      }

      useEffect(() => {
        const fetchResult = async () => {
          try {
            const { data } = await axios.get(`${server}api/v1/streaming/NZ2VilnGRHPWTrPNl9Dt`);
            if (data.success) {
              console.log(data.data);
    
              // Convertimos linkStatus en un booleano correctamente

              const isLinkActive = data.data.linkStatus === 'true' || data.data.linkStatus === true? true:false;
              console.log('isLinkActive',isLinkActive)

    
              // Extraemos el src del iframe
              const urlStream = extractSrc(data.data.urlStream);
    
              // Actualizamos el estado con los datos procesados
              setData({
                textoInicio: data.data.textoInicio,
                urlStream: urlStream,
                linkStatus: isLinkActive
              });
            }
          } catch (error) {
            Swal.fire('Algo Salio mal', error, 'error');
          }
        };
    
        fetchResult();
      }, []);
      return (
        <>
            <Snowfall />
            <Container fluid>
                <Row className='mt-5'>
                    <Col md={4} className='flex justify-center'>
                        <img src="https://www.femepashidi.com.mx/inicio/img/images/comite.png" alt="Logo 1" style={{ width: '80px' }} />
                    </Col>
                    <Col md={4} className='flex justify-center'>
                        <img src="https://www.femepashidi.com.mx/inicio//img/images/logo_fede.png" alt="Logo 1" style={{ width: '100px' }} />
                    </Col>
                    <Col md={4} className='flex justify-center'>
                        <img src="https://www.femepashidi.com.mx/inicio/img/images/isu.png" alt="Logo 1" style={{ width: '80px' }} />
                    </Col>
                </Row>
                {!data.linkStatus ? (
                    <Row className='flex justify-center mt-4'>
                        <Col md={10} className='rounded-2xl text-center'>
                            <h1>{data.textoInicio}</h1>
                        </Col>
                    </Row>
                ) : (
                    <Row className='flex justify-center mt-4'>
                        <Col md={10} className='rounded-2xl'>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', height: '600px', borderRadius: '10px' }} className='rounded-2xl z-40'>
                                <iframe 
                                    className='z-40'
                                    width="100%"
                                    src={data.urlStream}
                                    title="Transmisión en vivo Youtube"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
    
}