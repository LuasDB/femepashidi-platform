import { useEffect, useState } from 'react'
import { TablaPatinadores } from '../../Components/Tabla'
import CenteredSpinner  from '../../Components/CenteredSpinner'
import { Button, Card, CardBody, CardFooter, CardHeader, Label, Table,Input, FormGroup } from "reactstrap";

import { server } from '../../db/server'
import { ordenarPorNombre,ordenarPorItem, formatoFecha } from '../../Functions/funciones'

import axios from 'axios';

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

export default function Patinadores(){
    const [data,setData]=useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState(null)
    const [isFetched, setIsFetched] = useState(false);
    //Para la paginación
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total,setTotal] = useState(0)
    const [search,setSearch] = useState('')
    const [status,setStatus] = useState('')



    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const { data:dataOrder } = await axios.get(`${server}api/v1/skaters`,{
                    params:{
                        page,
                        limit,
                        search,
                        status
                    },
                    headers: authHeader()
                })

                if(dataOrder.success){
                    console.log(dataOrder)
                    const orderArray = dataOrder.data.map(item=>({
                        id:item._id,
                        data:[item.curp, `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,item.nivel_actual,formatoFecha(item.fecha_nacimiento),item.asociacion?.nombre || 'Sin asociación', item.verificacion ? 'Aprobado' : 'Pendiente'],
                        content:item,
                        curp:item.curp
                    }))
                    setData(orderArray)
                    setIsFetched(true);
                    setTotal(dataOrder.total)

                }else{
                    setData([])
                    setTotal(0)
                }
                }catch (error) {
                setError(error)
                }finally{
                setLoading(false)
                }
        }



        fetchData();


    },[page,limit,search,status])

    const handleChangeSearch = (e) => {
    const word = e.target.value
    setSearch(word)
    setPage(1)
  }

    const handleChangeStatus = (e) => {
    setStatus(e.target.value)
    setPage(1)
  }

    return (
    <>
        <div className='flex flex-col basis-4 scroll-y' >
        {loading && (<CenteredSpinner />)}

        {!loading && (<div>
         <CardFooter className='mb-4 flex flex-col sm:flex-row gap-3'>
          <Input type="text" placeholder="Buscar por..." onChange={handleChangeSearch} value={search} />
          <Input type="select" onChange={handleChangeStatus} value={status} className='sm:max-w-xs'>
            <option value=''>Todos</option>
            <option value='aprobado'>Aprobados</option>
            <option value='pendiente'>En espera de aprobación</option>
          </Input>
        </CardFooter>
            <TablaPatinadores
                path="/gestion/view/patinadores/"
                encabezados={['CURP', 'NOMBRE', 'NIVEL', 'FECHA DE NACIMIENTO', 'ASOCIACIÓN', 'ESTATUS', 'VER']}
                data={data}
                title="Patinadores"
                collection="skaters"
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
            />
        </div>)}

        </div>
    </>

    )

}