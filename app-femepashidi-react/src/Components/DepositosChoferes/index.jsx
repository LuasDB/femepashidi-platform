import { useEffect, useState } from "react"
import {CardFooter,Form,FormGroup,Input,Button,
    Table,
    Label} from 'reactstrap'
import CenteredSpinner  from './../CenteredSpinner'
import axios from 'axios';
import Swal from "sweetalert2";
import { server } from '../../db/server'
import { formatoNumeroMX,formatoFecha} from '../../Functions/funciones';



export default function DepositosChoferes({deposits,idService}){

    const [loading,setLoading] = useState(false)
    const [isFetched,setIsFetched] = useState(false)
    const [data,setData] = useState([])

    const [concepto, setConcepto] = useState('');
    const [monto, setMonto] = useState('');
    const [fechaDeposito, setFechaDeposito] = useState('');
    const [referencia, setReferencia] = useState('');
    const [total,setTotal]= useState(0)
    const [items,setItems] = useState([])

    const handleAgregarConcepto = ()=>{
        if(fechaDeposito && concepto && monto && referencia ){

            Swal.fire({
                position: "center",
                icon: "question",
                title: "ALTA EN BASE DE DATOS",
                html:`¿Revisate que la información sea correcta? <br> Fecha: ${fechaDeposito} <br> Concepto: ${concepto} <br> Monto: $${monto} <br> Referencia ${referencia}`,
                showConfirmButton: true,
                showCancelButton:true,
                confirmButtonText:'Si, claro',
                cancelButtonText:'No, espera'
            }).then(async(result)=>{
                if(result.isConfirmed){
                    const newItem = { fechaDeposito ,concepto , monto ,referencia }
                    try {
                        const { data } =await axios.patch(`${server}api/v1/services/add/new/deposits/${idService}`,newItem)
                        
                        if(data.success){
                            Swal.fire(`Actualizado`,`${data.message}`,'success')
                            setItems([...items,newItem])
                            setTotal(prev=> parseFloat(prev) + parseFloat(monto) )
                            setConcepto('')
                            setMonto('')
                            setFechaDeposito('')
                            setReferencia('')
                        }
                    } catch (error) {
                        Swal.fire('Algo Salio mal',error,'error')
                    }
                    
                   
                }
            })
            



        }else{
            Swal.fire('Error en regtro','Para registrar un deposito todos los campos deben ser llenados','error')
        }
    }
    



    useEffect(()=>{
        const fetchData = ()=>{
            try {
                setLoading(true)
                
                setItems(deposits)
                let sumTotal = deposits.reduce((sum,current)=> sum + parseFloat(current.monto),0)
                setTotal(sumTotal)
            } catch (error) {
                Swal.fire('Algo salio mal con la consulta',error,'error')
            }finally{
                setLoading(false)
            }
        }
        if(!isFetched){
            fetchData()
        }
    },[isFetched])

    return (
        <>  
        {loading && (<CenteredSpinner />)}
        {!loading && (
        <>
            
            <div className='flex flex-row gap-4'>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="fechaDeposito" className="mr-sm-2 text-curious-blue-600">Fecha</Label>
                <Input
                type="date"
                name="fechaDeposito"
                autocomplete="off"
                id="fechaDeposito"
                placeholder="Ingrese fechaDeposito"
                value={fechaDeposito}
                onChange={(e) => setFechaDeposito(e.target.value)}
                />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="concepto" className="mr-sm-2 text-curious-blue-600">Concepto</Label>
                <Input
                type="text"
                name="concepto"
                autocomplete="off"
                id="concepto"
                placeholder="Ingrese concepto"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="monto" className="mr-sm-2 text-curious-blue-600">Monto</Label>
                <Input
                type="number"
                name="monto"
                autocomplete="off"
                id="monto"
                placeholder="Ingrese monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="referencia" className="mr-sm-2 text-curious-blue-600">Refereia</Label>
                <Input
                type="text"
                name="referencia"
                autocomplete="off"
                id="referencia"
                placeholder="Ingrese referencia"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                />
            </FormGroup>
            
            <Button type='button' className='bg-curious-blue-500 hover:bg-curious-blue-600 mt-4' onClick={handleAgregarConcepto}>Agregar</Button>
            </div>
            <Table striped className="my-4">
            <thead>
                <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Referencia</th>
                </tr>
            </thead>
            <tbody>
            
                {items?.map((item, index) =>{
                
                return (
                <tr key={index}>
                    <td>{formatoFecha(item.fechaDeposito)}</td>
                    <td>{item.concepto}</td>
                    <td>${formatoNumeroMX(item.monto)}</td>
                    <td>{item.referencia}</td>
                    
                </tr>
                )}
                )
                }
            </tbody>
            </Table>

            <CardFooter>
                <Label className='text-curious-blue-900 font-bold text-lg'>Total: ${formatoNumeroMX(total)}</Label>
            </CardFooter>

        </>)}
            
        </>
    )
}