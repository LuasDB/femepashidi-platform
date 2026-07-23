
import { useEffect,useState,useRef } from 'react'
import {  useParams,useNavigate } from "react-router-dom"
import {
    Card, CardBody, CardTitle, CardText, Button, Input,
    Container, Row, Col, ListGroup, ListGroupItem,FormGroup,CardHeader
  } from 'reactstrap';
import { FaCopy } from "react-icons/fa";

import axios from "axios"
import { server,urlApp } from './../../db/server'
import { io } from 'socket.io-client';

import CenteredSpinner from './../../Components/CenteredSpinner'

import Swal from "sweetalert2";

export default function ExamenAdmin(){
    const { id,year } = useParams()
    const navigator = useNavigate()
    const [examen,setExamen] = useState(null)
    const [nuevoNivel,setNuevoNivel] = useState('')
    const [resultados,setResultados] = useState(
        {
            "tecnica": '',
            "artistico": '',
            "interpretacion": '',
            "coreografia": ''
           }
    )
     // Estado para manejar los datos recibidos
    const [message, setMessage] = useState('nada');

  // Conectar al servidor Socket.IO al montar el componente
    useEffect(() => {
        // Configura la conexión con el servidor
        const socket = io(`${server}`); 
        socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });

        // Escuchar eventos desde el servidor
        socket.on('new-judge', (dataServer) => {
            console.log('Datos recibidos desde el servidor:', dataServer);
            setExamen(dataServer.examen)
            
        });
        
        socket.on('new-cal-judge', (dataServer) => {
            console.log('Datos recibidos desde el servidor:', dataServer);
            setExamen(dataServer.examen)
            calcularResultados(dataServer.examen)

        });
        

        // Limpiar la conexión cuando el componente se desmonte
        return () => {
        socket.disconnect();
        };
    }, []);


    useEffect(()=>{
        const getExam = async ()=>{
            try {
            const {data} = await axios.get(`${server}api/v1/exams/get-one/${year}/${id}`)
            setExamen(data.data)
            calcularResultados(data.data)
            console.log('Ifo descargada:',data.data)
            } catch (error) {
                Swal.fire('Algo salio mal',`Ocurrio un error al descargar la información. Error: ${error}`,'error')
            }
        }
        getExam()
    },[year,id])

    const calcularResultados = (examen)=>{
        const calcularPromedio = (jueces,campo) => {
            const suma = jueces.reduce((acc, juez) => acc + parseInt(juez.calificaciones[campo]), 0);
            const promedio = suma / jueces.length;
            return promedio;
          };
       const jueces = examen.jueces
       setResultados({
        "tecnica": calcularPromedio(jueces,'tecnica'),
        "artistico": calcularPromedio(jueces,'artistico'),
        "interpretacion": calcularPromedio(jueces,'interpretacion'),
        "coreografia": calcularPromedio(jueces,'coreografia')
       })
    }

    const handleFinishExam = (isApproved)=>{
        console.log('Enviando',isApproved)

        if (nuevoNivel==='' && isApproved) {
            Swal.fire('Error', 'Debes seleccionar el nuevo nivel', 'error');
            return;
        }

        Swal.fire({
            position: "center",
             icon: "question",
             title: "ALTA EN BASE DE DATOS",
             html: `<p>Por favor revise que la informacion este completa antes de enviar</p>`,
             showConfirmButton: true,
             showCancelButton: true,
             confirmButtonText: 'Esta correcta',
             cancelButtonText: 'No, espera'
         }).then(async(result)=>{
             if(result.isConfirmed){
                 const { data } = await axios.patch(`${server}api/v1/exams/exam/edit-one/${year}/${id}`,{
                    isApproved,status:'Finalizado',nuevoNivel
                 })
                 console.log('FINAL',data)
                 if(data.success){
                     Swal.fire('Datos Actualizados con Exito','Se envio la respsuesta','success')
                    //  navigator('/gestion/examenes')
 
                 }else{
                     Swal.fire('Algo salio mal',`No fue posible guardar sus respuestas.Error:${data.message}`,'error')
                 }
                 }
             }
         )
    }

    const handleSelectChange =(selected)=>{
        setNuevoNivel(selected)
    }

   
        

return (
    <>
        {examen && (
        <div className='flex justify-around p-4'>
            <Col md={8}>
            <Row>
                <Card className='m-1 rounded-xl shadow mt-0  p-8 overflow-x-auto bg-white'>
                <CardTitle className='font-bold text-curious-blue-900'>Datos del patindor </CardTitle>
                    <CardHeader className="flex flex-row  bg-white">
                        <FormGroup className='flex flex-row gap-10 w-2/3'>
                            <div className='w-1/2'> 
                                <span className='text-curious-blue-700'>Nombre</span> 
                                <h2 className='font-medium text-gray-600'>{examen.dataUser.nombre} {examen.dataUser.apellido_paterno} {examen.dataUser.apellido_materno}</h2>
                            </div>
                            <div className='w-1/2'> 
                                <span className='text-curious-blue-700'>Nivel Actual</span> 
                                <h2 className='font-medium text-gray-600'>{examen.dataUser.nivel_actual} </h2>
                            </div>
                                    
                        </FormGroup>  
                        <div className='w-1/3 p-2'>
                            <Button type='button' className='m-2 bg-green-400 hover:bg-green-600' onClick={()=>handleFinishExam(true)}>Aprobado</Button>
                            <Button type='button' className='m-2 bg-red-400 hover:bg-red-600' onClick={()=>handleFinishExam(false)}>No aprobado</Button>
                        </div> 
                    </CardHeader>
                    <CardHeader className="flex flex-row  bg-white">
                        <Input type='select' onChange={(e)=>handleSelectChange(e.target.value)} >
                            <option value="">--Selecciona Nuevo nivel aprobado--</option>
                            <option value="Debutantes 1">Debutantes 1</option>
                            <option value="Debutantes 1 Artistico">Debutantes 1 Artistico</option>
                            <option value="Debutantes 1 Especial">Debutantes 1 Especial</option>
                            <option value="Debutantes 2">Debutantes 2</option>
                            <option value="Debutantes 2 Artistico">Debutantes 2 Artistico</option>
                            <option value="Debutantes 2 Especial">Debutantes 2 Especial</option>
                            <option value="Pre-Básicos">Pre-Básicos</option>
                            <option value="Pre-Básicos Artistico">Pre-Básicos Artistico</option>
                            <option value="Pre-Básicos Especial">Pre-Básicos Especial</option>
                            <option value="Básicos">Básicos</option>
                            <option value="Básicos Especial">Básicos Especial</option>
                            <option value="Básicos Artistico">Básicos Artistico</option>
                            <option value="Pre-preliminar">Pre-preliminar</option>
                            <option value="Pre-preliminar Especial">Pre-preliminar Especial</option>
                            <option value="Preliminar">Preliminar</option>
                            <option value="Intermedios 1">Intermedios 1</option>
                            <option value="Intermedios 2">Intermedios 2</option>
                            <option value="Novicios">Novicios</option>
                            <option value="Avanzados 1">Avanzados 1</option>
                            <option value="Avanzados 2">Avanzados 2</option>
                            <option value="Adulto Bronce Artistico">Adulto Bronce Artistico</option>
                            <option value="Adulto Plata Artistico">Adulto Plata Artistico</option>
                            <option value="Adulto Oro Artistico">Adulto Oro Artistico</option>
                            <option value="Adulto Master Artistico">Adulto Master Artistico</option>
                            <option value="Adulto Master Elite Artistico">Adulto Master Elite Artistico</option>
                            <option value="ADULTO PAREJAS Artistico">ADULTO PAREJAS Artistico</option>
                            <option value="ADULTO PAREJAS INTERMEDIATE Artistico">ADULTO PAREJAS INTERMEDIATE Artistico</option>
                            <option value="ADULTO PAREJAS MASTER Artistico">ADULTO PAREJAS MASTER Artistico</option>
                            <option value="ADULTO PAREJAS MASTER ELITE Artistico">ADULTO PAREJAS MASTER ELITE Artistico</option>
                        </Input>
                    </CardHeader>
                    
                </Card>
                
            </Row>
            <Row>
            <Card className='m-1 rounded-xl shadow mt-0  p-8 overflow-x-auto bg-white text-[14px] text-center'>
                
                <CardTitle className='font-bold text-curious-blue-900'>Jueces </CardTitle>
                    {examen.jueces?.map((item,index)=>(
                        <CardHeader className="flex flex-col justify-between bg-white" key={`${index}-juez`}>
                        <FormGroup className='flex flex-row gap-10' >
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Nombre</span> 
                            <h2 className='font-medium text-gray-600'>{item.nombre} </h2>
                            <span className='text-curious-blue-700'>Asociacion</span> 
                            <h2 className='font-medium text-gray-600'>{item.asociacion} </h2>
                        </div>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Técnica</span> 
                            <h2 className='font-medium text-gray-600'>{item.calificaciones.tecnica} </h2>
                        </div>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Interpretación</span> 
                            <h2 className='font-medium text-gray-600'>{item.calificaciones.interpretacion} </h2>
                        </div>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Artistico</span> 
                            <h2 className='font-medium text-gray-600'>{item.calificaciones.artistico} </h2>
                        </div>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Coreografia</span> 
                            <h2 className='font-medium text-gray-600'>{item.calificaciones.coreografia} </h2>
                        </div>               
                    </FormGroup>
                    </CardHeader>
                        
                    ))}
                    
                </Card>    
            </Row>
        
            </Col>
            <Col md={3} >
            <Card className='m-1 rounded-xl shadow mt-0  p-4 overflow-x-auto bg-white'>
            <CardTitle className='font-bold text-curious-blue-900'>Resultados </CardTitle>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <FormGroup className='flex flex-row gap-10' >
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Técnica</span> 
                            <h2 className='font-medium text-gray-600'>{resultados.tecnica} </h2>
                            
                        </div>
                    </FormGroup>
                </CardHeader>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <FormGroup className='flex flex-row gap-10' >
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Interpretación</span> 
                            <h2 className='font-medium text-gray-600'>{resultados.interpretacion} </h2>
                            
                        </div>
                    </FormGroup>
                </CardHeader>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <FormGroup className='flex flex-row gap-10' >
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Artistico</span> 
                            <h2 className='font-medium text-gray-600'>{resultados.artistico} </h2>
                            
                        </div>
                    </FormGroup>
                </CardHeader>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <FormGroup className='flex flex-row gap-10' >
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Coreografia</span> 
                            <h2 className='font-medium text-gray-600'>{resultados.coreografia} </h2>
                            
                        </div>
                    </FormGroup>
                </CardHeader>
            </Card>
            </Col>
        
        </div>)
        }
    </>
)
}