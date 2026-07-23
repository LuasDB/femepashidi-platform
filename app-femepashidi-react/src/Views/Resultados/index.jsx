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
                const {data} = await axios.get(`${server}api/v1/${collection}`)
                console.log(data)
                if(data.success){
                    const dataOrder = ordenarPorNombre(data.data)
                    const orderArray = dataOrder
                    .filter(item => item.status === 'Activo')  // Filtra los elementos que tienen el status 'Activo'
                    .map(item => ({
                        id: item._id,
                        data: [item.titulo, item.carpeta, item.condicion, item.status],
                        content: item
                    }));
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

export default function Resultados(){
    const { data,error,loading } = useFetchDataTables({
        collection:'results',
        server
    })

    
   
    
    return (
    <>
        <div className='flex flex-col basis-4 scroll-y overflow-x-auto' > 

            <Tabla 
                className='w-100'
                path={'/gestion/forms/resultados/'} 
                encabezados={['Titulo','Carpeta','Condicion','Status']}
                data={data}
                title={'Resultados'}
                collection={'results'}
            />
            
          
        </div>
    </>
        
    )

}