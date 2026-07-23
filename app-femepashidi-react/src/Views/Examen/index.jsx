import { useEffect,useState,useRef } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { Card,CardHeader,Button,Label, CardTitle, CardBody, Table, CardText,Row,Col, FormGroup, Input} from "reactstrap";
import { FaCopy } from "react-icons/fa";

import axios from "axios"
import { server,urlApp } from './../../db/server'
import CenteredSpinner from './../../Components/CenteredSpinner'


import Swal from "sweetalert2";


export default function Examen(){

    const { id,year } = useParams()
    const linkRef = useRef(null)
    const linkRef2 = useRef(null)
    const [user,setUser] = useState(null)
    const [formError,setFormError] = useState({})
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        const getData = async ()=>{
            try {
                setLoading(true)
                const { data } = await axios.get(`${server}api/v1/exams/get-one/${year}/${id}`)
                console.log('Datos de examen',data)
                setUser(data.data)
            } catch (error) {
                Swal.fire('Algo salio mal',`No se puedo descargar la informacion ${error.message}`,'error')
            }finally{
                setLoading(false)
            }
        }

        getData()
    },[])

    const handleCopy = (link) => {
        if (link.current) {
          const textToCopy = link.current.textContent;
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              alert('Texto copiado al portapapeles!');
            })
            .catch(err => {
              console.error('Error al copiar el texto: ', err);
            });
        }
      };
    return (
        <>
        {loading && (<CenteredSpinner />)}

        {!loading && user && (<div>
        <Card className='m-1 rounded-xl shadow mt-0  p-8 overflow-x-auto bg-white' >
            <CardTitle className="flex font-bold"> {user.curp} </CardTitle>
            <img className='w-40'
            src={`${server}images/users/${user.dataUser.img}`} />
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Datos del patindor </CardTitle>
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Nombre</span> 
                        <h2 className='font-medium text-gray-600'>{user.dataUser.nombre} {user.dataUser.apellido_paterno} {user.dataUser.apellido_materno}</h2>
                    </div>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Nivel Actual</span> 
                        <h2 className='font-medium text-gray-600'>{user.dataUser.nivel_actual} </h2>
                    </div>
                            
                </FormGroup>    
                
                             
            </CardHeader>
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Datos del examen </CardTitle>
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Fecha de solicitud</span> 
                        <h2 className='font-medium text-gray-600'>{user.fecha_solicitud} </h2>
                    </div>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Fecha de examen</span> 
                        <h2 className='font-medium text-gray-600'>{user.fecha_examen} </h2>
                    </div>
                            
                </FormGroup>    
                
                             
            </CardHeader>
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Sala vistural para examen </CardTitle>
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Entrar como administrador</span> 
                        <h2 ref={linkRef2}
                        onClick={()=>handleCopy(linkRef2)}
                         className='font-medium text-gray-600 cursor-pointer'>{`${urlApp}examen-admin/${user.fecha_examen.split('-')[0]}/${user.id}`} </h2>
                    </div>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Link para invitados</span> 
                        <h2 ref={linkRef} className='font-medium text-gray-600 cursor-pointer' onClick={()=>handleCopy(linkRef)}>{`${urlApp}examen-judge/${user.fecha_examen.split('-')[0]}/${user.id}`} </h2><FaCopy />
                    </div>
                            
                </FormGroup>    
                
                             
            </CardHeader>
            
        
          

       
            
        </Card>

        </div>)}
       

        
       
    

        </>
    )
}