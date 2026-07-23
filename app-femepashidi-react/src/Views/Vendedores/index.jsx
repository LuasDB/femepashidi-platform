import { useEffect, useState } from 'react'
import {Tabla} from '../../Components/Tabla'




import axios from 'axios';

import { server } from '../../db/server'
import { ordenarPorNombre } from '../../Functions/funciones'


const useFetchDataTables = ({collection,server})=>{
    const [data,setData]=useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState(null)
    const [isFetched, setIsFetched] = useState(false);


    useEffect(()=>{
        const fetchData = async()=>{
            try {
                setLoading(true)
                const response = await axios.get(`${server}api/v1/${collection}`)
    
                if(response.data.success){
                    const data = ordenarPorNombre(response.data.data)
                    const orderArray = data.map(item=>({
                        id:item.id,
                        data:[item.nombre,item.telefono,item.status],
                        content:item
                    }))
                    setData(orderArray)
                    setIsFetched(true);
            
                    console.log('TABLA',orderArray)
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

export default function Clientes(){
    const { data,error,loading } = useFetchDataTables({
        collection:'sellers',
        server
    })

    
   
    
    return (
    <>
        <div className='flex flex-col basis-4 scroll-y overflow-x-auto' > 
            <Tabla 
                className='w-100'
                path={'/forms/vendedores/'} 
                encabezados={['Nombre','Telefono','Estatus']}
                data={data}
                title={'Vendedores'}
                collection={'sellers'}
            />        
        </div>
    </>
        
    )

}