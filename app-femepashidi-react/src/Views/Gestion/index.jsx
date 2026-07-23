import { useEffect, useState } from 'react'
import {Tabla} from '../../Components/Tabla'

// const server = 'http://localhost:3000/'


import axios from 'axios';

import { server } from '../../db/server'
import { ordenarPorNombre } from '../../Functions/funciones'
import CenteredSpinner from '../../Components/CenteredSpinner';


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
                    const { users, vehicles, drivers } = data.data
                    
                    let usersOrder = ordenarPorNombre(users)
                    
                    const orderArrayUsers = usersOrder.map(item=>({
                        id:item.id,
                        data:[item.nombre,item.email,item.status],
                        content:item
                    }))
                   
                     
                    const orderArrayVehicles = vehicles.map(item=>({
                        id:item.id,
                        data:[item.marca,item.modelo,item.placas,item.esDisponible],
                        content:item
                    }))
                    const orderArrayDrivers = drivers.map(item=>({
                        id:item.id,
                        data:[item.nombre,item.telefono,item.esDisponible],
                        content:item
                    }))
                    


                    setData({
                        users:orderArrayUsers,
                        vehicles:orderArrayVehicles,
                        drivers:orderArrayDrivers
                    })
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

export default function Gestion(){
    const { data,error,loading } = useFetchDataTables({
        collection:'managment/all-collections/for/all',
        server
    })

    
   
    
    return (
    <>
       <div className="flex flex-col basis-4 overflow-y-auto overflow-x-auto">
            {loading && (<CenteredSpinner />)}

          {!loading && (
            <div>
            <Tabla
                className="w-full"
                path={'/forms/usuarios/'}
                encabezados={['Nombre', 'Correo', 'Estatus']}
                data={data.users}
                title={'Usuarios'}
                collection={'auth/users'}
            />
            <Tabla
                className="w-full"
                path={'/forms/unidades/'}
                encabezados={['Marca', 'Modelo', 'Placas','Estatus']}
                data={data.vehicles}
                title={'Unidades'}
                collection={'vehicles'}
            />
             <Tabla
                className="w-full"
                path={'/forms/conductores/'}
                encabezados={['Nombre', 'Telefono', 'Estatus']}
                data={data.drivers}
                title={'Conductores'}
                collection={'drivers'}
            />

            </div> )}
        </div>
    </>
        
    )

}