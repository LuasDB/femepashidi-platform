
import { useEffect,useState,useRef } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import {
    Card, CardBody, CardTitle, CardText, Button, Input,
    Container, Row, Col, ListGroup, ListGroupItem,FormGroup,CardHeader
  } from 'reactstrap';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FaCopy } from "react-icons/fa";

import axios from "axios"
import { server,urlApp } from './../../db/server'
import { generateUID } from './../../Functions/funciones.js'
import { io } from 'socket.io-client';

import CenteredSpinner from './../../Components/CenteredSpinner'

import Swal from "sweetalert2";



export default function ExamenAdmin(){
    const { id,year } = useParams()
    const [examen,setExamen] = useState(null)
    const [isLogin,setIsLogin] = useState(false)
    const [isFinish,setIsFinish] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', asociacion: '' });
    const [calificaciones,setCalificaciones]=useState({
        "tecnica": 0,
        "artistico": 0,
        "interpretacion": 0,
        "coreografia": 0
    })
    const [idJuez,setIdJuez] = useState(null)
    
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
            if(data.data.status !== 'Activo'){
                Swal.fire('Este examen ya concluyo',`Contacte a la presidencia de FEMEPASHIDI para mas información`,'question')
                return

            }
            setExamen(data.data)
            console.log('Ifo descargada:',data.data)
            } catch (error) {
                Swal.fire('Algo salio mal',`Ocurrio un error al descargar la información. Error: ${error}`,'error')
            }

        }
        getExam()
    },[year,id])

    const handleAddJudge = (e) => {
        e.preventDefault()
        setIsModalOpen(true);
    };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    const handleFormSubmit = async(e) => {
        e.preventDefault()
        const allFieldsFilled = Object.values(formData).every(value => value !== 0 && value !== '');

    if (!allFieldsFilled) {
        Swal.fire('Error', 'Todos los campos deben ser llenados', 'error');
        return;
    }
        const lastData = examen
        const idJudge = generateUID();
        const newJudge = { ...formData, id:idJudge,calificaciones:
            {"tecnica": 0,
        "artistico": 0,
        "interpretacion": 0,
        "coreografia": 0} };
        setIdJuez(idJudge)

        // Llama a tu API aquí para enviar `newJudge`
        const {data} = await axios.post(`${server}api/v1/exams/exam/${year}/${id}/judges`, newJudge)
        if (data.success) {
            setIsModalOpen(false);
            setIsLogin(true);
            
            lastData.jueces.push(newJudge)
            setExamen(lastData)
            console.log('Nuevo juez añadido:', newJudge);  // Verifica si el juez se añadió correctamente
        }
    };

    const handleSendCal = ()=>{
        const allFieldsFilled = Object.values(calificaciones).every(value => value !== 0 && value !== '');

        if (!allFieldsFilled) {
            Swal.fire('Error', 'Todos los campos deben ser llenados', 'error');
            return;
        }
        let previewHtml = '<h3>Por favor, revise sus respuestas:</h3><ul>';
        for (const [key, value] of Object.entries(calificaciones)) {
            previewHtml += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        previewHtml += '</ul>';

        Swal.fire({
           position: "center",
            icon: "question",
            title: "ALTA EN BASE DE DATOS",
            html: `${previewHtml}<p>¿Revisaste que la información sea correcta?</p>`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sí, claro',
            cancelButtonText: 'No, espera'
        }).then(async(result)=>{
            if(result.isConfirmed){
                const { data } = await axios.patch(`${server}api/v1/exams/exam/${year}/${id}/judges/${idJuez}`,{
                    calificaciones
                })
                if(data.success){
                    Swal.fire('Datos Actualizados con Exito','Sus calificaciones fueron enviadas gracias por participar!','success')
                    setIsFinish(true)
                }else{
                    Swal.fire('Algo salio mal',`No fue posible guardar sus respuestas.Error:${data.message}`,'error')
                }
                }
                
                
               
            }
        )

    }
    const handleCalChange = (e)=>{
        const { name, value } = e.target

        setCalificaciones({
            ...calificaciones,
            [name]:value
        })

    }



   
        

    return (
        <>
          {examen && (
            <div className="flex flex-col p-4 md:p-8">
              <Col md={8} className="w-full">
                <Row className="w-full">
                  <Card className="m-2 rounded-xl shadow-lg p-4 md:p-8 overflow-x-auto bg-white">
                    <CardTitle className="font-bold text-curious-blue-900 text-xl md:text-2xl">Datos del patindor</CardTitle>
                    <CardHeader className="flex flex-col md:flex-row bg-white">
                      <FormGroup className="flex flex-col md:flex-row gap-4 md:gap-10 w-full md:w-2/3">
                        <div className="w-full md:w-1/2">
                          <span className="text-curious-blue-700">Nombre</span>
                          <h2 className="font-medium text-gray-600">
                            {examen.dataUser.nombre} {examen.dataUser.apellido_paterno} {examen.dataUser.apellido_materno}
                          </h2>
                        </div>
                        <div className="w-full md:w-1/2">
                          <span className="text-curious-blue-700">Nivel Actual</span>
                          <h2 className="font-medium text-gray-600">{examen.dataUser.nivel_actual}</h2>
                        </div>
                      </FormGroup>
                      {!isLogin && (
                        <div className="w-full md:w-1/3 p-2">
                          <Button
                            type="button"
                            className="w-full bg-blue-400 hover:bg-blue-600"
                            onClick={(e) => handleAddJudge(e)}
                          >
                            Unirme
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                </Row>
      
                <Row className="w-full">
                  <Card className="m-2 rounded-xl shadow-lg p-4 md:p-8 overflow-x-auto bg-white text-sm md:text-base">
                    <CardTitle className="font-bold text-curious-blue-900">Jueces</CardTitle>
                    {examen.jueces?.map((item, index) => (
                      <CardHeader className="flex flex-col justify-between bg-white" key={`${index}-juez`}>
                        <FormGroup className="flex flex-col md:flex-row gap-4 md:gap-10">
                          <div className="w-full md:w-1/2">
                            <span className="text-curious-blue-700">Nombre</span>
                            <h2 className="font-medium text-gray-600">{item.nombre}</h2>
                            <span className="text-curious-blue-700">Asociación</span>
                            <h2 className="font-medium text-gray-600">{item.asociacion}</h2>
                          </div>
                          <div className="w-full md:w-1/2">
                            <span className="text-curious-blue-700">Técnica</span>
                            <h2 className="font-medium text-gray-600">{item.calificaciones.tecnica}</h2>
                          </div>
                          <div className="w-full md:w-1/2">
                            <span className="text-curious-blue-700">Interpretación</span>
                            <h2 className="font-medium text-gray-600">{item.calificaciones.interpretacion}</h2>
                          </div>
                          <div className="w-full md:w-1/2">
                            <span className="text-curious-blue-700">Artístico</span>
                            <h2 className="font-medium text-gray-600">{item.calificaciones.artistico}</h2>
                          </div>
                          <div className="w-full md:w-1/2">
                            <span className="text-curious-blue-700">Coreografía</span>
                            <h2 className="font-medium text-gray-600">{item.calificaciones.coreografia}</h2>
                          </div>
                        </FormGroup>
                      </CardHeader>
                    ))}
                  </Card>
                </Row>
              </Col>
      
              {isModalOpen && (
                <Col md={3} className="w-full">
                  <Card className="m-2 rounded-xl shadow-lg p-4 md:p-8 overflow-x-auto bg-white">
                    <CardTitle className="font-bold text-curious-blue-900">Agrega tu información</CardTitle>
                    <CardHeader className="flex flex-col justify-between bg-white">
                      <FormGroup>
                        <label>Nombre</label>
                        <Input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Asociación</label>
                        <Input
                          type="text"
                          name="asociacion"
                          value={formData.asociacion}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </CardHeader>
      
                    <FormGroup className="flex justify-center items-center">
                      <div className="w-full flex justify-center">
                        <Button className="w-full bg-green-400 hover:bg-green-600" onClick={handleFormSubmit}>
                          Unirme
                        </Button>
                      </div>
                    </FormGroup>
                  </Card>
                </Col>
              )}
      
              {isLogin && (
                <Col md={3} className="w-full">
                  <Card className="m-2 rounded-xl shadow-lg p-4 md:p-8 overflow-x-auto bg-white">
                    <CardTitle className="font-bold text-curious-blue-900">Mi evaluación</CardTitle>
                    <CardHeader className="flex flex-col justify-between bg-white">
                      <FormGroup className="flex flex-col md:flex-row gap-4 md:gap-10">
                        <div className="w-full md:w-1/2">
                          <span className="text-curious-blue-700">Nombre</span>
                          <h2 className="font-medium text-gray-600">{formData.nombre}</h2>
                        </div>
                      </FormGroup>
                    </CardHeader>
      
                    {['tecnica', 'interpretacion', 'artistico', 'coreografia'].map((field, index) => (
                      <CardHeader className="flex flex-col justify-between bg-white" key={index}>
                        <FormGroup className="flex flex-col md:flex-row gap-4 md:gap-10">
                          <div className="w-full">
                            <span className="text-curious-blue-700">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                            <Input
                              name={field}
                              type="number"
                              className="font-medium text-gray-600"
                              onChange={(e) => handleCalChange(e)}
                            />
                          </div>
                        </FormGroup>
                      </CardHeader>
                    ))}
      
                    {!isFinish && (
                      <FormGroup className="flex justify-center items-center">
                        <div className="w-full flex justify-center">
                          <Button className="w-full bg-green-400 hover:bg-green-600" onClick={handleSendCal}>
                            Enviar calificaciones
                          </Button>
                        </div>
                      </FormGroup>
                    )}
                  </Card>
                </Col>
              )}
            </div>
          )}
        </>
      );
      
}