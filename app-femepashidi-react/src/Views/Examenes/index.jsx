import { useEffect, useState } from 'react'
import CenteredSpinner from './../../Components/CenteredSpinner'
import { server } from './../../db/server'
import axios from 'axios';
import { TablaExamenes } from './../../Components/Tabla'
import { ordenarPorItem,formatoFecha } from './../../Functions/funciones.js'
import ExamUpdates from './../../Components/ExamUpdates'


const useFetchDataTables = ({collection,server})=>{
    const [data,setData]=useState([])
    const [dataToExport,setDataToExport]=useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState(null)
    const [isFetched, setIsFetched] = useState(false);

    const [years,setYears] = useState([])
    const [selectedYear,setSelectedYear] = useState()
   
    const today = new Date()


    const fetchData = async()=>{
        try {
            setLoading(true)
            const {data} = await axios.get(`${server}api/v1/${collection}/get-all/${selectedYear}`)
            console.log('Consulta',data)
            console.log('Consulta',data.success)

            if(data.success){
                console.log(data.success)

                const dataToOrder = ordenarPorItem(data.data,'fecha_examen')
                console.log(dataToOrder)

                const orderArray = dataToOrder.map(item=>({
                    id:item.id,
                    data:[item.dataUser.curp, `${item.dataUser.nombre} ${item.dataUser.apellido_paterno} ${item.dataUser.apellido_materno}`,item.dataUser.nivel_actual,formatoFecha(item.fecha_examen),`${item.status === 'Activo' ? 'Por realizar': `${item.isApproved ? 'Aprobado': 'Reprobado'}`}`],
                    content:item
                }))
                console.log('Cambio de año',orderArray)

                setData(orderArray)
                setIsFetched(true);
                setDataToExport(data)           
            }
            }catch (error) {
            setError(error) 
            }finally{
            setLoading(false)
            }
    }
    
    useEffect(()=>{
        fetchData()
    },[selectedYear])

    useEffect(()=>{
        
        if (!isFetched) {
            fetchData();
        }
        
        const listYears = []
        for(let i=2025 ; i <= today.getFullYear();i++){
          listYears.push(i)
        }
        setYears(listYears)
        setSelectedYear(today.getFullYear())
        
    },[isFetched])

    const handleUpdateTable=(newYear)=>{
        console.log('NEW YEAR',newYear)
        setSelectedYear(newYear)
        

    }

    return {
        data,error,loading,years,handleUpdateTable,selectedYear,dataToExport
    }
}
export default function Examenes(){
    const { data,error,loading,handleUpdateTable,years,selectedYear,dataToExport } = useFetchDataTables({
        collection:'exams',
        server
    }) 
    return (
        <>
        
        <TablaExamenes 
         className='w-100'
                path={'/gestion/forms/examenes/'} 
                pathView={'/gestion/view/examen/'} 
                encabezados={['CURP','Nombre','Nivel Actual','Fecha de examen']}
                data={data}
                title={'Examenes'}
                collection={'exams'}
                years={years}
                handleUpdateTable={handleUpdateTable}
                selectedYear={selectedYear}
        />

        </>
    )
}