import { useEffect, useState } from 'react'
import {Tabla} from '../../Components/Tabla'
import axios from 'axios';
import { server } from '../../db/server'
import { formatoFecha, ordenarPorItem } from '../../Functions/funciones'


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
                    const dataOrder = ordenarPorItem(data.data,'status')
                    const orderArray = dataOrder
                    .map(item => ({
                        id: item._id,
                        data: [item.nombre, formatoFecha(item.fecha_inicio), formatoFecha(item.fecha_fin), item.lugar,item.status],
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

export default function Eventos(){
    const { data,error,loading } = useFetchDataTables({
        collection:'events',
        server
    })

    
   
    
    return (
    <>
        <div className='flex flex-col basis-4 scroll-y overflow-x-auto' > 

            <Tabla 
                className='w-100'
                path={'/gestion/forms/eventos/'} 
                encabezados={['NOMBRE','FECHA INICIO','FECHA FIN','LUGAR','STATUS']}
                data={data}
                title={'Eventos'}
                collection={'events'}
            />
            
        </div>
    </>
        
    )

}