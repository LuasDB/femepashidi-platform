import { useContext, useEffect, useState } from 'react'
import { TablaInscripciones } from '../../Components/Tabla'
import CenteredSpinner  from '../../Components/CenteredSpinner'
import ExportToExcel from './../../Components/ExportToExcel'
import { AuthContext } from '../../Context/AuthContext'

import { server } from '../../db/server'
import { ordenarPorNombre,ordenarPorItem, formatoFecha,formatoNombre } from '../../Functions/funciones'


import axios from 'axios';
import Swal from 'sweetalert2'
import GenerateXml from '../../Components/GenerateXml'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

const useFetchDataTables = ({collection,server})=>{
    const [data,setData]=useState([])
    // Todos los registros del evento sin paginar (ExportToExcel/GenerateXml
    // exportan siempre el total del evento, no la página que se ve en pantalla).
    const [exportData,setExportData]=useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState(null)
    const [isFetched, setIsFetched] = useState(false);
    const [selectedEvent,setSelectedEvent] = useState('')
    const [isSelected,setIsSelected] = useState(false)
    const [status,setStatus] = useState('')
    //Para la paginación
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState('')


    const handleSelectedEvent = (e)=>{
        e.preventDefault()
        setSelectedEvent(e.target.value)
        setIsSelected(true)
        setPage(1)
    }

    const handleChangeStatus = (e)=>{
        setStatus(e.target.value)
        setPage(1)
    }

    const handleChangeSearch = (e)=>{
        setSearch(e.target.value)
        setPage(1)
    }

    const fetchData = async()=>{
        try {
            const { data } = await axios.get(`${server}api/v1/${collection}/event/${selectedEvent}`,{
                params:{ status, page, limit, search },
                headers: authHeader()
            })
            console.log(data)

            if(data.success){

                const orderArray = data.data.map(item=>({
                    id:item._id,
                    data:[item.user.curp, `${formatoNombre(item.user.nombre)} ${item.user.apellido_paterno.toUpperCase()} ${item.user.apellido_materno.toUpperCase()}`,item.user.numero_competidor || 'Pendiente de asignar',item.fecha_solicitud,item.association.nombre,item.status],
                    content:item
                }))

                setData(orderArray)
                setTotal(data.total)
                setIsFetched(true);

            }else{
                setData([])
                setTotal(0)
                console.log('No funciona')
            }
        }catch (error) {
            setError(error)
        }finally{
            setLoading(false)
        }
    }
    const fetchExportData = async()=>{
        try {
            const { data } = await axios.get(`${server}api/v1/${collection}/event/${selectedEvent}`,{
                headers: authHeader()
            })
            if(data.success){
                const orderArray = data.data.map(item=>({
                    id:item._id,
                    data:[item.user.curp, `${formatoNombre(item.user.nombre)} ${item.user.apellido_paterno.toUpperCase()} ${item.user.apellido_materno.toUpperCase()}`,item.user.numero_competidor || 'Pendiente de asignar',item.fecha_solicitud,item.association.nombre,item.status],
                    content:item
                }))
                setExportData(orderArray)
            }else{
                setExportData([])
            }
        }catch (error) {
            setError(error)
        }
    }

    useEffect(()=>{
        fetchData()
    },[selectedEvent,status,page,limit,search])

    useEffect(()=>{
        if (selectedEvent) {
            fetchExportData()
        }
    },[selectedEvent])

    useEffect(()=>{
        if (!isFetched) {
            fetchData();
        }
    },[isFetched])

    return {
        data,exportData,error,loading,handleSelectedEvent,selectedEvent,isSelected,status,handleChangeStatus,
        page,limit,total,setPage,search,handleChangeSearch,
    }
}

export default function Inscripciones(){
    const { user } = useContext(AuthContext)
    // El presidente de asociación no debe poder exportar a Excel/XML,
    // solo el admin.
    const isAdmin = user?.role === 'admin'

    const {
        data,exportData,loading,handleSelectedEvent,selectedEvent,isSelected,status,handleChangeStatus,
        page,limit,total,setPage,search,handleChangeSearch,
    } = useFetchDataTables({
        collection:'register',
        server
    })



    return (
    <>
        <div className='flex flex-col basis-4 scroll-y' >
        {loading && (<CenteredSpinner />)}





        {isAdmin && exportData && selectedEvent && (<ExportToExcel data={exportData} fileName={selectedEvent}/>)}

        {!loading && (<div>
        <p>{selectedEvent}</p>
            <TablaInscripciones
                className='w-100'
                path={'/gestion/view/inscripciones/'}
                encabezados={['CURP','NOMBRE','NO. COMPETIDOR','FECHA DE INSCRIPCIÓN','ASOCIACION','ESTATUS']}
                data={data}
                title={'Inscripciones'}
                collection={'users'}
                server={server}
                handleSelectedEvent={handleSelectedEvent}
                selectedEvent={selectedEvent}
                isSelected={isSelected}
                status={status}
                handleChangeStatus={handleChangeStatus}
                search={search}
                onSearchChange={handleChangeSearch}
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
            />
        </div>)}

        {isAdmin && exportData && selectedEvent && (<GenerateXml data={exportData} />)}

        </div>
    </>

    )

}