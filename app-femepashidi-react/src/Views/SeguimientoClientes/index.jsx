import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, FormGroup, Input, Label,Row,Col,Button } from "reactstrap";
import {FaEdit  } from 'react-icons/fa'
import {useNavigate, Link} from 'react-router-dom'

import axios from "axios";
import {server} from './../../db/server'
import { ordenarPorNombre } from './../../Functions/funciones'
import Swal from "sweetalert2";





export default function SeguimientoClientes(){

    const [customers,setCustomers] = useState([])
    const [notas,setNotas] = useState()
    const [customerSelected,setCustomerSelected] = useState('')
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchClientes = async()=>{
            try {
                const data = await axios.get(`${server}api/v1/customers`)
                console.log(data)

                if(data.data.success){
                    setCustomers(ordenarPorNombre(data.data.data))
                }
            } catch (error) {
                alert(`Un error ocurrio: ${error}`)
            }
            
        }

        fetchClientes()

    },[])

    const handleSelected = async(idCliente)=>{
        setCustomerSelected(idCliente)
        await axios.get(`${server}api/v1/payments/${idCliente}`)
        .then(response=>{   
            setNotas(response.data.data)
            console.log(response.data.data)
        }).catch(error => alert(error))
    }

    const handleEstadoCuenta = ()=>{
        if(customerSelected !== ''){

            const customer = customers.find(item => (item.id === customerSelected))

            navigate(`/estado-cuenta/${customerSelected}/${customer.nombre}`)
        }else{
            Swal.fire('No seleccionaste un cliente','Debes seleccionar un cliente para poder generar su estado de cuenta','error')
        }
    }

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2 p-6 overflow-x-auto'>
            <CardTitle>Seguimiento a pedidos de clientes</CardTitle>
            <CardBody>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                        <Label>Cliente</Label>
                        <Input type="select" name="cliente" onChange={(e)=>handleSelected(e.target.value)}>
                            <option value={''}>--Selecciona un cliente--</option>
                            {customers?.map(item=>(
                            <option value={item.id} key={item.id}>{item.nombre}</option>

                            ))}
                      </Input>
                    </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Button onClick={handleEstadoCuenta}>Crear estado de cuenta</Button>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-2 py-2 text-center text-xs font-bolder text-black uppercase tracking-wider">
                            Folio de Nota
                        </th>
                        <th scope="col" className="px-2 py-2 text-center text-xs font-bolder text-black uppercase tracking-wider">
                            Fecha
                        </th>
                        <th scope="col" className="px-2 py-2 text-center text-xs font-bolder text-black uppercase tracking-wider">
                            Total
                        </th>
                        <th scope="col" className="px-2 py-2 text-center text-xs font-bolder text-black uppercase tracking-wider">
                            Estatus
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {notas?.map((item, index) => (
                        <tr key={index}>
                            <td className="px-2 py-2  text-center whitespace-nowrap">{item.folio}</td>
                            <td className="px-2 py-2  text-center whitespace-nowrap">{item.fecha}</td>
                            <td className="px-2 py-2  text-center whitespace-nowrap">$ {item.total}</td>
                            <td className={`px-6 py-2  text-center whitespace-nowrap  text-white`}>
                            <p className={`${item.status === 'Activo' ? 'bg-red-500' : 'bg-green-500'} rounded-lg text-center text-white px-1 py-1`}>{item.status === 'Activo' ? 'Pendiente' : item.status}</p>
                            </td>
                            <td>
                            <Button className="bg-cyan-950" size="sm" tag={Link} to={`/view/ventas/${item.id}`} >
                                            <FaEdit />
                                        </Button>

                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </Row>
                
                
            </CardBody>

        </Card>
    )

}