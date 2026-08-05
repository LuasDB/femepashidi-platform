import { Button, Card, CardBody, CardFooter, CardHeader, Label, Table,Input, FormGroup } from "reactstrap";
import { FaPlusCircle, FaEdit, FaRegTrashAlt ,FaRegFolderOpen,FaEye, FaTrash  } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import './styles.css'
import { useEffect, useState } from "react";
import axios from "axios";
import {server} from './../../db/server.js'
import Swal from "sweetalert2";
import Paginacion from '../Paginacion'


export function Tabla(props) {
    
    const { path,data,encabezados,title,collection } = props

    const handleDelete = async(id)=>{
      Swal.fire(
        {
          position: "center",
          icon: "question",
          title: "¿DESEAS ELIMINAR ESTE REGISTRO DE LA BASE DE DATOS?",
          html:`Esto no podra revertirse`,
          showConfirmButton: true,
          showCancelButton:true,
          confirmButtonText:'Si, claro',
          cancelButtonText:'No, espera'
        }
      )
      .then(async(result)=>{
        if(result.isConfirmed){
          try {
            const { data } = await axios.delete(`${server}api/v1/${collection}/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            console.log(data)
            
            if(data.success){
            Swal.fire('Elemento Eliminado',`Este registro fue eliminado de la base de datos`,'success')
            }
            return
          } catch (error) {
            Swal.fire('Algo salio mal',`No se pudo eliminar el registro. Código de error: ${error.message}`,'error')
          }
        }
      })
    
    }

    return (
      <>
        <Card className="m-1 rounded-xl shadow mt-0 mb-2  ">
          <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
          <Button className="flex place-items-center w-full max-w-xs md:w-[150px] md:text-sm justify-around mb-2 md:mb-0 bg-curious-blue-500 hover:bg-curious-blue-600" tag={Link} to={`${path}new`}>
          <FaPlusCircle />
          <p>Nuevo</p>
        </Button>

            <Label className="text-curious-blue-950 font-bold text-center md:text-right ">{title}</Label>
          </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-curious-blue-800 text-center">
                <tr >
                  {encabezados?.map((encabezado, index) => (
                    <th key={`${index}-e`} className="px-4 py-2 ">{encabezado}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr key={item.id} className="border-b-2 border-stone-200 hover:bg-gray-100">
                    {item.data?.map((data2, index) => {
                    return (
                      <td 
                      key={index} 
                      className={`px-4 py-2 `} 
                      >
                      <p className={`text-center ${index === item.data.length  -1 ? `${data2 === 'Disponible' ? 'bg-green-200 rounded-3 text-green-700 border-2 border-green-300':''} ${data2 === 'En servicio' ? 'bg-red-200 rounded-3 text-red-600 border-2 border-red-300':''}`:''}`}>{data2}</p>
                      </td>
                    )}
                    )}
                    <td className=" w-32 px-4 py-2 space-x-2">
                      <Button className="bg-blue-400 text-white" size="sm" tag={Link} to={`${path}${item.id}`}>
                        <FaEdit />
                      </Button>
                      <Button className="bg-red-400 text-white" size="sm" onClick={()=>handleDelete(item.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      </>
    );
}

export function TablaServicios(props) {
    
    const { path,data,encabezados,title,changeSearch} = props

    const [filtered, setFiltered] = useState(data || []);
    const [searchValue, setSearchValue] = useState('');
    const [isFirst, setIsFirst] = useState(true);

    useEffect(() => {
        if (isFirst && data) {
            setFiltered(data);
            setIsFirst(false);
            console.log('F', data);
        }
    }, [isFirst, data]);

    useEffect(() => {
        if (data) {
            setFiltered(data);
        }
    }, [data]);


    const handleChangeSearch = (e)=>{
        const world = e.target.value
        changeSearch(world)
    }

    const stylesStatusBg = (status)=>{
      if(status === 'Servicio solicitado'){
        return 'bg-orange-200 border-2 border-red-300 text-center rounded-2 text-red-600'
      }
      if(status === 'En curso'){
        return 'bg-yellow-100 border-2 border-yellow-400 text-center rounded-2 text-yellow-500'
      }
      if(status === 'Finalizado'){
        return 'bg-green-200 border-2 border-green-300 text-center rounded-2 text-green-700'
      }

    }
 

    return (
        <>
          <Card className="m-2 rounded-xl shadow mt-0 mb-2 ">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
        {/* <Button className="flex place-items-center w-full max-w-xs md:w-[150px] md:text-sm justify-around mb-2 md:mb-0 bg-curious-blue-500 hover:bg-curious-blue-600" tag={Link} to={`/forms/usuarios/new`}>
          <FaPlusCircle />
          <p>Nuevo</p>
        </Button> */}
        <Label className="text-curious-blue-950 font-bold text-center md:text-right">{title}</Label>
      </CardHeader>
      <CardFooter>
        <Input type="text" placeholder="Buscar por..." onChange={handleChangeSearch} value={searchValue} />
      </CardFooter>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {encabezados?.map((encabezado, index) => (
                  <th key={`${index}-e`} className="px-1 py-2">{encabezado}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered?.map((item) => (
                <tr key={item.id} className="border-b-2 border-stone-200">
                  {item.data?.map((data2, index) => (
                    <td key={index} className="px-1 py-2 text-[12px]">
                      <p className={`${(index === item.data.length -1) ? `${stylesStatusBg(data2)}`:''}`}>
                      {data2}
                      </p>
                    </td>
                  ))}
                  <td className="px-4 py-2 space-x-3">
                    <Button className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.id}`}>
                    <FaRegFolderOpen  />
                    </Button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
          </Card>
        </>
    );
}

export function TablaPatinadores(props) {
  const {
    path,
    data,
    encabezados,
    title,
    page = 1,
    limit = 20,
    total = 0,
    onPageChange = () => {}
  } = props

  const [filtered, setFiltered] = useState(data || [])
  const [isFirst, setIsFirst] = useState(true)

  useEffect(() => {
    if (isFirst && data) {
      setFiltered(data)
      setIsFirst(false)
    }
  }, [isFirst, data])

  useEffect(() => {
    if (data) {
      setFiltered(data)
    }
  }, [data])

   const stylesStatusBg = (status)=>{
    if(status === 'Preinscrito'){
      return 'bg-yellow-100 border-2 border-yellow-400 text-center rounded-2 text-yellow-500'
    }
    if(status === 'rechazado'){
      return 'bg-red-100 border-2 border-red-400 text-center rounded-2 text-red-500'
    }
    if(status === 'aprobado' || status === 'Aprobado'){
      return 'bg-green-200 border-2 border-green-300 text-center rounded-2 text-green-700'
    }
    if(status === 'Pendiente'){
      return 'bg-yellow-100 border-2 border-yellow-400 text-center rounded-2 text-yellow-500'
    }}

  const totalPages = Math.ceil(total / limit)

  const Paginacion = () => (
    <div className="flex justify-between items-center mt-4 text-sm">
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </Button>

      <span className="text-center">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente
      </Button>
    </div>
  )

  // Índice del estatus dentro de item.data: siempre el último elemento
  // (ver Views/Patinadores, que arma data como [...campos, estatus]).
  const estatusIndex = (item) => item.data.length - 1

  return (
    <>
      <Card className="m-2 rounded-xl shadow mt-0 mb-2 ">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
          <Label className="text-curious-blue-950 font-bold text-center md:text-right">{title}</Label>
        </CardHeader>
        <CardBody>
          {/* Mobile: cards en vez de tabla */}
          <div className="md:hidden">
            {filtered?.map((item) => (
              <Card key={item._id} className="p-4 mb-3 shadow-sm border border-stone-200">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-curious-blue-900">{item.data[1]}</p>
                    <p className="text-xs text-gray-500">{item.data[0]}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${stylesStatusBg(item.data[estatusIndex(item)])}`}>
                    {item.data[estatusIndex(item)]}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-700 grid grid-cols-2 gap-x-2 gap-y-1">
                  <p><span className="text-gray-500">Nivel:</span> {item.data[2]}</p>
                  <p><span className="text-gray-500">Nac.:</span> {item.data[3]}</p>
                  <p className="col-span-2"><span className="text-gray-500">Asociación:</span> {item.data[4]}</p>
                </div>
                <Button className="mt-3 w-full bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.curp}`}>
                  <FaRegFolderOpen className="inline mr-1" /> Ver
                </Button>
              </Card>
            ))}
            <Paginacion />
          </div>

          {/* Desktop: tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {encabezados?.map((encabezado, index) => (
                    <th key={`${index}-e`} className="px-1 py-2">{encabezado}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered?.map((item) => (
                  <tr key={item._id} className="border-b-2 border-stone-200">
                    {item.data?.map((data2, index) => (
                      <td key={index} className="px-1 py-2 text-[12px]">
                        <p className={`${(index === estatusIndex(item)) ? `${stylesStatusBg(data2)}` : ''}`}>
                          {data2}
                        </p>
                      </td>
                    ))}
                    <td className="px-4 py-2 space-x-3">
                      <Button className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.curp}`}>
                        <FaRegFolderOpen />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Paginacion />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export function TablaInscripciones(props) {

  const {
    path,data,encabezados,title,collection,server,
    handleSelectedEvent,selectedEvent,isSelected,
    status,handleChangeStatus,
    search,onSearchChange,
    page,limit,total,onPageChange,
  } = props

  const [filtered, setFiltered] = useState(data || []);
  const [isFirst, setIsFirst] = useState(true);
  const [eventsList,setEventsList] = useState([])

  useEffect(() => {
    const fetchEvents = async()=>{
      try {
        const { data } =await axios.get(`${server}api/v1/events`)
        if(data.success){
          setEventsList(data.data)
        }else{
          setEventsList([])
        }
      } catch (error) {
        Swal.fire('Error al cargar competencias',error,'error')
      }
    }
    if (isFirst && data) {
        setFiltered(data);
        setIsFirst(false);
        fetchEvents()
        console.log('F', data);
    }
  }, [isFirst]);

  useEffect(() => {
      if (data) {
          setFiltered(data);
      }
  }, [data]);

  const stylesStatusBg = (status)=>{
    if(status === 'Preinscrito'){
      return 'bg-yellow-100 border-2 border-yellow-400 text-center rounded-2 text-yellow-500'
    }
    if(status === 'rechazado'){
      return 'bg-red-100 border-2 border-red-400 text-center rounded-2 text-red-500'
    }
    if(status === 'aprobado'){
      return 'bg-green-200 border-2 border-green-300 text-center rounded-2 text-green-700'
    }

  }
  const handleDelete = async(id)=>{
    Swal.fire({
      position: "center",
      icon: "question",
      title: "ALTA EN BASE DE DATOS",
      html:`¿Revisate que la información sea correcta?`,
      showConfirmButton: true,
      showCancelButton:true,
      confirmButtonText:'Si, claro',
      cancelButtonText:'No, espera'
    }).then(async(result)=>{
      if(result.isConfirmed){
        try {
          const { data } = await axios.delete(`${server}api/v1/register/${id}`)
          if(data.success){
            Swal.fire('Actualzación',data.message,'success')
          }
        } catch (error) {
          Swal.fire('Error al eliminar',error,'error')
        }
      }
      })


    
  }

  


  return (
      <>
        <Card className="m-2 rounded-xl shadow mt-0 mb-2 ">
    <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
      {/* <Button className="flex place-items-center w-full max-w-xs md:w-[150px] md:text-sm justify-around mb-2 md:mb-0 bg-curious-blue-500 hover:bg-curious-blue-600" tag={Link} to={`/forms/usuarios/new`}>
        <FaPlusCircle />
        <p>Nuevo</p>
      </Button> */}
      <Label className="text-curious-blue-950 font-bold text-center md:text-right">{title}</Label>
    </CardHeader>
    <CardHeader>
      <FormGroup>
        <Label>Selecciona la competencia de consulta</Label>
        <Input type="select" onChange={handleSelectedEvent} value={selectedEvent}>
        <option value={''}>--Selecciona competencia--</option>
        {eventsList?.map((item,index)=>(
        <option value={item.nombre} key={`${index}-eventos`}>{item.nombre}</option>

        ))}
        </Input>
      </FormGroup>
    </CardHeader>
    {isSelected && (
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Input type="text" placeholder="Buscar por..." onChange={onSearchChange} value={search} />
        <Input type="select" onChange={handleChangeStatus} value={status} className="sm:max-w-xs">
          <option value=''>Todos</option>
          <option value='Preinscrito'>En espera de aprobación</option>
          <option value='aprobado'>Aprobados</option>
          <option value='rechazado'>Rechazados</option>
        </Input>
    </CardFooter>
    )}

    <CardBody>

      {/* Mobile: cards en vez de tabla */}
      <div className="md:hidden">
        {filtered?.map((item) => (
          <Card key={item.id} className="p-4 mb-3 shadow-sm border border-stone-200">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-bold text-curious-blue-900">{item.data[1]}</p>
                <p className="text-xs text-gray-500">{item.data[0]}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${stylesStatusBg(item.data[item.data.length - 1])}`}>
                {item.data[item.data.length - 1]}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-700 grid grid-cols-1 gap-y-1">
              <p><span className="text-gray-500">No. Competidor:</span> {item.data[2]}</p>
              <p><span className="text-gray-500">Fecha de inscripción:</span> {item.data[3]}</p>
              <p><span className="text-gray-500">Asociación:</span> {item.data[4]}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button className="flex-1 bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.id}`}>
                <FaRegFolderOpen className="inline mr-1" /> Ver
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm" onClick={()=>handleDelete(item.id)}>
                <MdDeleteForever />
              </Button>
            </div>
          </Card>
        ))}
        {isSelected && (<Paginacion page={page} limit={limit} total={total} onPageChange={onPageChange} />)}
      </div>

      {/* Desktop: tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {encabezados?.map((encabezado, index) => (
                <th key={`${index}-e`} className="px-1 py-2">{encabezado}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered?.map((item) => (
              <tr key={item.id} className="border-b-2 border-stone-200">
                {item.data?.map((data2, index) => (
                  <td key={index} className="px-2 py-1 text-[12px]">
                    <p className={`${(index === item.data.length -1) ? `${stylesStatusBg(data2)}`:''}`}>
                    {data2}
                    </p>
                  </td>
                ))}
                <td className="px-1 py-1 space-x-3">
                  <Button className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.id}`}>
                  <FaRegFolderOpen  />
                  </Button></td>
                  <td className="px-1 py-1 space-x-3">

                  <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm" onClick={()=>handleDelete(item.id)}>
                  <MdDeleteForever  />
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isSelected && (<Paginacion page={page} limit={limit} total={total} onPageChange={onPageChange} />)}
      </div>
    </CardBody>
        </Card>
      </>
  );
}

export function TablaPagos(props) {
    
  const { path,data,encabezados,title,collection } = props

  const [filtered, setFiltered] = useState(data || []);
  const [searchValue, setSearchValue] = useState('');
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
      if (isFirst && data) {
          setFiltered(data);
          setIsFirst(false);
          console.log('F', data);
      }
  }, [isFirst, data]);

  useEffect(() => {
      if (data) {
          setFiltered(data);
      }
  }, [data]);


  const handleChangeSearch = (e)=>{
      const world = e.target.value
      setSearchValue(world)
    
      setFiltered(data.filter(item=>
              item.data[0].toLowerCase().includes(world.toLowerCase()) || 
              item.data[1].toLowerCase().includes(world.toLowerCase()) ))   
  }
  const stylesStatusBg = (status)=>{
    if(status === 'Pendiente'){
      return 'bg-orange-200 border-2 border-red-300 text-center rounded-2 text-red-600'
    }
    if(status === 'En curso'){
      return 'bg-yellow-100 border-2 border-yellow-400 text-center rounded-2 text-yellow-500'
    }
    if(status === 'Finalizado'){
      return 'bg-green-200 border-2 border-green-300 text-center rounded-2 text-green-700'
    }

  }


  return (
      <>
        <Card className="m-2 rounded-xl shadow mt-0 mb-2 ">
    <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
      
      <Label className="text-curious-blue-950 font-bold text-center md:text-right">{title}</Label>
    </CardHeader>
    <CardFooter>
      <Input type="text" placeholder="Buscar por..." onChange={handleChangeSearch} value={searchValue} />
    </CardFooter>
    <CardBody>
      <div className="overflow-x-auto">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr>
              {encabezados?.map((encabezado, index) => (
                <th key={`${index}-e`} className="px-0 py-2">{encabezado}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered?.map((item) => (
              <tr key={item.id} className="border-b-2 border-stone-200">
                {item.data?.map((data2, index) => (
                  <td key={index} className="px-0 py-2 text-[12px]">
                    <p className={`${(index === item.data.length -1) ? `${stylesStatusBg(data2)}`:''}`}>
                    {data2}
                    </p>
                  </td>
                ))}
                <td className="px-1 py-2 space-x-3">
                  <Button className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.id}`}>
                  <FaRegFolderOpen  />
                  </Button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardBody>
        </Card>
      </>
  );
}

export function TablaBitacora(props) {
    
  const { path,data,encabezados,title,collection } = props

  const [filtered, setFiltered] = useState(data || []);
  const [searchValue, setSearchValue] = useState('');
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
      if (isFirst && data) {
          setFiltered(data);
          setIsFirst(false);
          console.log('F', data);
      }
  }, [isFirst, data]);

  useEffect(() => {
      if (data) {
          setFiltered(data);
      }
  }, [data]);


  const handleChangeSearch = (e)=>{
      const world = e.target.value
      setSearchValue(world)
    
      setFiltered(data.filter(item=>
              item.data[0].toLowerCase().includes(world.toLowerCase()) || 
              item.data[1].toLowerCase().includes(world.toLowerCase()) ))   
  }
  const stylesStatusBg = (status)=>{
    if(status === 'Pendiente'){
      return 'bg-orange-200 border-2 border-red-300 text-center rounded-2 text-red-600'
    }
    if(status === 'En curso'){
      return 'bg-yellow-100 border-2 border-yellow-400 text-center rounded-2 text-yellow-500'
    }
    if(status === 'Pagado'){
      return 'bg-green-200 border-2 border-green-300 text-center rounded-2 text-green-700'
    }

  }


  return (
      <>
        <Card className="m-2 rounded-xl shadow mt-0 mb-2 ">
    <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
      
      <Label className="text-curious-blue-950 font-bold text-center md:text-right">{title}</Label>
    </CardHeader>
    <CardFooter>
      <Input type="text" placeholder="Buscar por..." onChange={handleChangeSearch} value={searchValue} />
    </CardFooter>
    <CardBody>
      <div className="overflow-x-auto">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr>
              {encabezados?.map((encabezado, index) => (
                <th key={`${index}-e`} className="px-0 py-2">{encabezado}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered?.map((item) => (
              <tr key={item.id} className="border-b-2 border-stone-200">
                {item.data?.map((data2, index) => (
                  <td key={index} className="px-0 py-2 text-[12px]">
                    <p className={`${(index === item.data.length -1) ? `${stylesStatusBg(data2)}`:''}`}>
                    {data2}
                    </p>
                  </td>
                ))}
                <td className="px-2 py-2 space-x-3">
                  <Button className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`${path}${item.id}`}>
                  <FaRegFolderOpen  />
                  </Button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardBody>
        </Card>
      </>
  );
}

export function TablaExamenes(props) {
    
  const { path,pathView,data,encabezados,title,collection,years,handleUpdateTable,selectedYear} = props

  const [filtered, setFiltered] = useState(data || []);
 
  const [searchValue, setSearchValue] = useState('');
  const [isFirst, setIsFirst] = useState(true);
  const today = new Date();
  console.log('Desde Table',data)

 


  useEffect(() => {
      if (isFirst && data) {
          setFiltered(data);
          setIsFirst(false);

        }
  }, [isFirst, data]);

  useEffect(() => {
      if (data) {
          setFiltered(data);
      }
  }, [data]);


  const handleChangeSearch = (e)=>{
      const world = e.target.value
      setSearchValue(world)
    
      setFiltered(data.filter(item=>
              item.data[0].toLowerCase().includes(world.toLowerCase()) || 
              item.data[1].toLowerCase().includes(world.toLowerCase()) ||
              item.data[2].toLowerCase().includes(world.toLowerCase())))


              
      
  }
  const statusMessage=(fecha)=>{
    const diffDays = differenceInDays(new Date(fecha), today);
    if (diffDays >= 15 && diffDays <= 30) {
      return 'success';
    } else if (diffDays >= 31 && diffDays <= 60) {
      return 'warning';
    } else if (diffDays > 60) {
      return 'danger';
    } else {
      return 'primary'; 
    }
  }

  const handleDeleteElement = (id)=>{
      alert(`Se elimina:${id}`)

  }
  

  return (
    <>
      <Card className="m-2 rounded-xl shadow mt-4 mb-2 ">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
          <Button className="flex place-items-center w-full max-w-xs md:w-[150px] md:text-sm justify-around mb-2 md:mb-0" tag={Link} to={`${path}new`}>
            <FaPlusCircle />
            <p>Nuevo</p>
          </Button>
          <Label className="text-yellow-500 font-bold text-center md:text-right">{title}</Label>
        </CardHeader>
        <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
          <Input type="select" onChange={(e)=>handleUpdateTable(e.target.value)}>
            <option value={''}>--Seleccion un año--</option>
            {years?.map((item,index)=>(
              <option key={`${index}-y`} value={item}>{item}</option>
              ))}
          </Input>
        </CardHeader>
        <CardFooter>
          <Input type="text" placeholder="Buscar por..." onChange={handleChangeSearch} value={searchValue} />
        </CardFooter>
        <CardBody className="text-[12px]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {encabezados?.map((encabezado, index) => (
                    <th key={`${index}-e`} className="px-0 py-2">{encabezado}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered?.map((item) => (
                  <tr key={item.id} className="border-b-2 border-stone-200 hover:bg-gray-100">
                    {item.data?.map((data2, index) => (
                      <td key={index} className={`px-0 py-2 `}><p className={`${data2==='Aprobado'?'bg-green-400 p-1 text-center rounded-xl text-white':''} ${data2==='Reprobado'?'bg-red-400 p-1 text-center rounded-xl text-white':''} ${data2==='Por realizar'?'bg-blue-400 p-1 text-center rounded-xl text-white':''}`}>{data2}</p></td>
                    ))}
                    
                    <td className="px-4 py-2 space-x-3">
                      <Button className="bg-cyan-950 text-white" size="sm" tag={Link} to={`${path}${selectedYear}/${item.id}`}>
                        <FaEdit />
                      </Button>
                      <Button className="bg-cyan-950 text-white" size="sm" tag={Link} to={`${pathView}/${selectedYear}/${item.id}`}>
                        <FaEye  />
                      </Button>
                      <Button className="bg-red-400 text-white" size="sm" onClick={() => handleDeleteElement(item.id)}>
                        <FaRegTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
