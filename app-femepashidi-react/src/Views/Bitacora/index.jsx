import { useEffect, useState } from 'react'
import { FormGroup, Label,Input, Button } from 'reactstrap'
import { TablaBitacora } from '../../Components/Tabla'
import CenteredSpinner  from './../../Components/CenteredSpinner'

import { server } from '../../db/server'
import { ordenarPorNombre,formatoFecha, formatoNumeroMX,generarListaYears ,ordenarPorItem} from '../../Functions/funciones'

import axios from 'axios';
import Swal from 'sweetalert2'

const useFetchDataTables = ({collection,server})=>{
    const [data,setData]=useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState(null)
    const [isFetched, setIsFetched] = useState(false);


    useEffect(()=>{
        const fetchData = async()=>{
            try {
                setLoading(true)
                const response = await axios.get(`${server}api/v1/services/services/for/pay/`)
    
                if(response.data.success){
                    const data = ordenarPorNombre(response.data.data)
                    const orderArray = data.map(item=>({
                        id:item.id,
                        data:[item.folio,item.clienteData.razonSocial,formatoFecha(item.fechaInicio.split('T')[0]),item.estado,`$ ${formatoNumeroMX(item.adeudo)}`,item.estadoPagos],
                        content:item
                    }))
                    setData(orderArray)
                    setIsFetched(true);
            
                }
                }catch (error) {
                setError(error) 
                }finally{
                setLoading(false)
                }
        }
        
        if (!isFetched) {
            fetchData();
        }
        
    },[isFetched])

    return {
        data,error,loading
    }
}



export default function Bitacora(){

    
    const [listYear,setListYear] = useState([])
    const [data,setData]=useState([])
    const [loading,setLoading] = useState(false)
    const [selectedYear,setSelectedYear] = useState('')
    
    useEffect(()=>{
        setListYear(generarListaYears(2024))
    },[])

    const handleSearchYear = async()=>{
       
        setLoading(true)
       

        try {
            const { data }= await axios.get(`${server}api/v1/services/services/for/year/${selectedYear}`)
            if(data.success){
                setLoading(false)
                if(data.data.length === 0){
                    Swal.fire('No se encontraron registros este año','Sin registros','warning')
                }
                const orderData = ordenarPorItem(data.data,'folio')
                
                    setData(orderData.map(item=>({
                        id:item.id,
                        data:[item.folio,item.clienteData.razonSocial,formatoFecha(item.fechaInicio.split('T')[0]),item.estado,item.estadoPagos],
                        content:item
                    })))
                

            }
        } catch (error) {
            Swal.fire('Algo salio mal con la consulta',error,'error')
            setLoading(false)
            
        }
    }
    return (
    <>
        <div className='flex flex-col basis-4 scroll-y' > 
        {loading && (<CenteredSpinner />)}

        {!loading && (<div>
            <FormGroup className='w-1/4 '>
                <Label>Año de Consulta</Label>
                <Input className='text-sm' type='select' onChange={(e)=>setSelectedYear(e.target.value)} value={selectedYear}>
                    <option value={''}>--Selecciona año de consulta</option>
                    {listYear?.map((item,index)=>(
                        <option key={`${index}-year`} value={item}>{item}</option>
                    ))}

                </Input>
                <Button className='mt-2' onClick={handleSearchYear}>Consultar</Button>
            </FormGroup>
            <TablaBitacora 
                className='w-100'
                path={'/gestion/view/resumen/'} 
                encabezados={['Folio','Cliente','Fecha Inicio','Status Servicio','Status Pago']}
                data={data}
                title={'Servicios'}
                collection={'services'}
            />
        </div>)}
           
        </div>
    </>
        
    )

}