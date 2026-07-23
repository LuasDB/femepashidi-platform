import {useEffect, useState } from 'react'
import { Card,CardHeader,Button,Label, CardTitle, CardBody, Table, CardText,Row,Col, FormGroup, Input} from "reactstrap";
import { IoDocumentText } from "react-icons/io5";
import { useParams,useNavigate} from 'react-router-dom';
import CenteredSpinner from '../../Components/CenteredSpinner';

import axios from 'axios';
import Swal from 'sweetalert2';



import {server} from '../../db/server'
import { formatoNumeroMX, formatoFecha,formatoFechaHora,sumaArray} from '../../Functions/funciones'
import StatusServicio from '../../Components/StatusServicio';
import Cotizador from '../../Components/Cotizador';
import DepositosChoferes from '../../Components/DepositosChoferes';



export default function ResumenServicio(){
    const { id } = useParams()
    const navigator = useNavigate()
    const [loading,setLoading] = useState(true)
    const [isFetched, setIsFetched] = useState(false);
    const [dataService,setDataService] = useState({})
    const [numStatus,setNumStatus] = useState('0')
    const [comprobanteFinal, setComprobanteFinal] = useState(null)
    


    useEffect(()=>{
        const fetchData = async()=>{
            try {
                setLoading(true)
                const {data} = await axios.get(`${server}api/v1/services/${id}`)
                if(data.success){
                    console.log(data.data)
                    setDataService(data.data) 
                    setNumStatus(data.data.numEstado)
                }              
            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }
            
            
        }
        if (!isFetched) {
            fetchData();
        }
    },[isFetched])

    const handleChangeStatus =async()=>{
        let num = Number(numStatus)
        num++
        setNumStatus(String(num))
        let estado = 'Servicio solicitado'
        if(num === 1){
            estado='En curso'
        }else if(num === 2){
            estado = 'Finalizado'
        }

        try {
            const {data} = await axios.patch(`${server}api/v1/services/${id}`,{numEstado:num,estado})
            if(data.success){
                Swal.fire('Actualizado',`${data.message}`,'success')
            }
        } catch (error) {
            Swal.fire('Algo salio mal',`${error}`,'error')
        }
       

    }

   

    return (
        <>
        {loading && (<CenteredSpinner />)}

        {!loading && (<div>
        <Card className='m-1 rounded-xl shadow mt-0  p-8 overflow-x-auto bg-white' >
           
            <CardTitle className="flex font-bold">FOLIO: {dataService.folio} </CardTitle>
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Estatus de servicio </CardTitle>
                <StatusServicio 
                estado={numStatus}
                handleChangeStatus={handleChangeStatus} 
                buttonActive={false}
                />      
            </CardHeader> 
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Datos del cliente </CardTitle>

                <FormGroup>
                    <span className='text-curious-blue-700'>Razon social</span> 
                    <h2 className='font-medium text-gray-600'>{dataService.clienteData.razonSocial}</h2>
                </FormGroup>
                <FormGroup>
                    <span className='text-curious-blue-700'>RFC</span> 
                    <h2 className='font-medium text-gray-600'>{dataService.clienteData.rfc}</h2>
                </FormGroup>              
            </CardHeader>
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Datos del Servicio </CardTitle>
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Fecha de solicitud</span> 
                        <h2 className='font-medium text-gray-600'>{formatoFecha(dataService.fechaSolicitud)}</h2>
                    </div>
                    
                    
                </FormGroup>   
                
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Dirección de Inicio</span> 
                        <h2 className='font-medium text-gray-600'>{dataService.direccionInicio}</h2>
                    </div>
                    <div className='w-1/2'>
                        <span className='text-curious-blue-700'>Fecha Inicio</span> 
                        <h2 className='font-medium text-gray-600'>{formatoFechaHora(dataService.fechaInicio)}</h2>
                    </div>
                   
                </FormGroup>    
                 
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Dirección de Destino</span> 
                        <h2 className='font-medium text-gray-600'>{dataService.direccionDestino}</h2>
                    </div>
                    <div className='w-1/2'>
                        <span className='text-curious-blue-700'>Fecha de entrega Programada</span> 
                        <h2 className='font-medium text-gray-600'>{formatoFechaHora(dataService.fechaFin)}</h2>
                    </div>
                   
                </FormGroup>        
            </CardHeader>
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Asignación</CardTitle>
     
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Unidad</span> 
                        <h2 className='font-medium text-gray-600'>{dataService.unidadData.marca} {dataService.unidadData.modelo}</h2>
                        
                    </div>
                    <div className='w-1/2'>
                        <span className='text-curious-blue-700'>Placas</span> 
                        <h2 className='font-medium text-gray-600'>{dataService.unidadData.placas}</h2>      
                    </div>
                   
                </FormGroup>    
                 
                <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Chofer asignado</span> 
                        <h2 className='font-medium text-gray-600'>{dataService.choferData.nombre}</h2>
                    </div>
                    <div className='w-1/2'>
                        <span className='text-curious-blue-700'>Licencia</span> 
                        <h2 className='font-medium text-gray-600'>{dataService.choferData.numLicencia}</h2>

                    </div>
                   
                </FormGroup>        
            </CardHeader>  
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Cotización del servicio</CardTitle>
                <FormGroup className='flex flex-col gap-10'>
                    
                    <div className="overflow-x-auto">
                        <table className="text-sm w-3/4">
                            <thead>
                                <tr>
                                    <th className='w-1/4'>Concepto</th>
                                    <th className='w-1/4'>Monto</th>
                                </tr>
                            </thead>
                        <tbody >
                        {dataService.services?.map((item,index)=>(
                            <tr key={`${index}-conceptos`}>
                                <td>{item.concepto}</td>
                                <td>$ {formatoNumeroMX(item.monto)}</td>
                            </tr>
                        ))}
                        <tr className='border-t-2 border-t-blue-500'>
                            <td><span className=' text-curious-blue-700 w-full'>Total</span></td>
                            
                            <td><p className=' text-curious-blue-700 w-full'>$ {formatoNumeroMX(sumaArray(dataService.services,'monto'))}</p></td>
                            <td></td>
                        </tr>
                
                        </tbody>
                       
                        </table>                  
                    </div>
                    
                </FormGroup>   
                      
            </CardHeader>        
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Depositos a Choferes</CardTitle>                
                <div className="overflow-x-auto">
                    <table className="text-sm w-3/4">
                    <thead>
                        <tr>
                        <th className='w-1/4'>Fecha</th>
                        <th className='w-1/4'>Concepto</th>
                        <th className='w-1/4'>Monto</th>
                        <th className='w-1/4'>Referencia</th>
                        </tr>
                    </thead>
                    <tbody >
                    
                        {dataService.deposits?.map((item, index) =>{
                        
                        return (
                        <tr key={index}>
                            <td>{formatoFecha(item.fechaDeposito)}</td>
                            <td>{item.concepto}</td>
                            <td>${formatoNumeroMX(item.monto)}</td>
                            <td>{item.referencia}</td>
                            
                        </tr>
                        )}
                        )
                        }
                        <tr className='border-t-2 border-t-blue-500'>
                            <td><span className=' text-curious-blue-700 w-full'>Total</span></td>
                            <td></td>
                            <td><p className=' text-curious-blue-700 w-full'>$ {formatoNumeroMX(sumaArray(dataService.deposits,'monto'))}</p></td>
                            <td></td>
                        </tr>
                    </tbody>
                    
                    </table> 
                </div>
            </CardHeader> 
            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Finalización de Servicio </CardTitle>
                {
                   (dataService.estado != 'Finalizado') && (
                    <>
                        <h2>El servicio aun no ha finalizado</h2>
                    </>
                   )   
                }
                {
                    (dataService.estado === 'Finalizado') && (
                    <>
                    <FormGroup className='flex flex-row gap-10'>
                    <div className='w-1/2'> 
                        <span className='text-curious-blue-700'>Fecha de cierre </span> 
                        <h2 className='font-medium text-gray-600'>{formatoFecha(dataService.fechaFin)}</h2>
                        
                    </div>
                    <div className='w-1/2'>
                        <span className='text-curious-blue-700'>Evidencia</span> 
                        <a href={dataService.comprobanteFinal} target="_blank" rel="noopener noreferrer">
                            <IoDocumentText className='text-[30px] text-gray-500 hover:text-gray-900 cursor-pointer' />
                        </a>      
                    </div>
                   
                </FormGroup> 
                    </>
                   )
                }
            </CardHeader>  

           
            
        </Card>
        </div>)}
       

        </>
       
    )
}