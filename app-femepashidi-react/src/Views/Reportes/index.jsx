import { useEffect, useState } from 'react'
import { Card,CardHeader,CardBody,Button, Form, FormGroup,Label,Input,Row,Col, CardFooter,Table, CardTitle, Container } from "reactstrap"
import { FaRegUser,FaMoneyBillWave  } from "react-icons/fa";
import { useParams } from 'react-router-dom'
import CenteredSpinner from './../../Components/CenteredSpinner'
import axios from 'axios'
import Swal from 'sweetalert2'
import html2pdf from 'html2pdf.js';

import { formatoFecha,formatNumberMX } from './../../Functions/funciones'



import { server } from '../../db/server'
import GraficaVentas from '../../Components/GraficaVentas';

export default function Reportes(){
    const [startDate,setStartDate] = useState('')
    const [endDate,setEndDate] = useState('')
    const [granTotal,setGranTotal] = useState(0)
    const [marcaSelected,setMarcaSelected] = useState('todos')
    const [ventas,setVentas] = useState(null)
    const [ventasFiltro,setVentasFiltro] = useState([])
    const [marcasVendidas,setMarcasVendidas] = useState({
        todos:'',
        matt:'',
        dmd:'',
        ariat:'',
        santa:'',
        maguey:'',
    })
    const [ loading,setLoading] = useState(false)
    const [dataGraph,setDataGraph] = useState({})
    const [dataGraphAll,setDataGraphAll] = useState({})

    useEffect(()=>{
        salesByMonth(ventasFiltro,marcaSelected)
    },[ventasFiltro])

    const countProducts = (marca)=>{
        let totalCount = 0

        if(marca === 'todos'){
            totalCount = ventas.reduce((acc, item) => {
                return acc + parseInt(item.producto.amount, 10);
            }, 0);
            setGranTotal(ventas.reduce((acc, item) => {
                return acc + parseInt(item.producto.total, 10);
            }, 0))
            setVentasFiltro(ventas)

        }else{
            const productos = ventas.filter(item=>item.producto.product.toLocaleLowerCase().includes(marca.toLowerCase()))
            totalCount = productos.reduce((acc, item) => {
                return acc + parseInt(item.producto.amount, 10);
            }, 0);
            setGranTotal(productos.reduce((acc, item) => {
                return acc + parseInt(item.producto.total, 10);
            }, 0))

            setVentasFiltro(productos)
        }

            setMarcasVendidas({
                ...marcasVendidas,
                [marca.toLowerCase()]:totalCount
            })
        

       


    }
    const handleBrowser = async()=>{

        if(!startDate || !endDate){
            Swal.fire('Debes escoger un periodo','Selecciona una fecha de inicio y fin para realizar la consulta','error')

            return
        }
        try{
        setLoading(true)
        const { data } = await axios.post(`${server}api/v1/reports-sales/`,{startDate,endDate})
        
        if(data.success){
            console.log(data.data)
            setVentas(data.data)
            setVentasFiltro(data.data)
            countProducts('todos')  
        }}catch(error){
            Swal.fire('Error de comunicación','Algo salio mal con la comunicación intenta en un momento','error')
             
        }finally{setLoading(false)}
    }
    const handleShow = (category)=>{
        setMarcaSelected(category)
        countProducts(category)
        console.log(marcasVendidas)
    }
    const handleGeneratePDF = () => {
        // Aquí puedes hacer la lógica para obtener los datos del estado de cuenta en el rango de fechas
    
        const content = document.getElementById('resumen');
        const opt = {
          margin:       0.5,
          filename:     `Ventas periodo_${formatoFecha(startDate)}_a_${formatoFecha(endDate)}_${marcaSelected}`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 1 },
          jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
        };
    
        html2pdf().from(content).set(opt).save();
    };
    const salesByMonth = (sales,category)=>{
        const salesByMonth = {}
        sales.forEach(({fecha,producto})=>{
            const month = new Date(fecha).toLocaleString('es-MX',{month:'long',year:'numeric'})
            const quantity = parseInt(producto.amount)
            if(!salesByMonth[month]){
                salesByMonth[month] = 0
            }
            salesByMonth[month] += quantity
        })
        const labels = Object.keys(salesByMonth)
        const data = Object.values(salesByMonth)
        setDataGraph({ labels, data,category })
        
    }
    const salesByCategory = (sales)=>{
        const salesByMonth = {}
        sales.forEach(({fecha,producto})=>{
            
            const quantity = parseInt(producto.amount)
            if(!salesByMonth[month]){
                salesByMonth[month] = 0
            }
            salesByMonth[month] += quantity
        })
        const labels = Object.keys(salesByMonth)
        const data = Object.values(salesByMonth)
        setDataGraph({ labels, data,category })
        
    }


    return (
        <Card className='m-2 rounded-xl shadow-2xl mt-1 mb-2'>
        <CardHeader className="text-yellow-500"> 
            <h3 > RESUMEN DE VENTAS POR PERIODO</h3>
        </CardHeader>
        <CardBody>
            <Form className="text-yellow-500" > 
                <Row className='flex items-center'>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="startDate" >Fecha de Inicio</Label>
                            <Input type="date" name="startDate" onChange={(e)=>setStartDate(e.target.value)}/>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="endDate" >Fecha Fin</Label>
                            <Input type="date" name="endDate" onChange={(e)=>setEndDate(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <Button className='w-full' onClick={handleBrowser}>Consultar</Button>
                    </Col>
                </Row>
               
                
            </Form>
            {ventas && (
                <ul className='flex justify-between pl-20 pr-20 '>
                <li className={`border-solid border-1 shadow-sm my-6 p-2 rounded-md cursor-pointer ${marcaSelected === 'todos' ? 'bg-blue-500 text-white' : ''}`}
                 onClick={()=>handleShow('todos')}>Todos</li>
                 <li
                className={`border-solid border-1 shadow-sm my-6 p-2 rounded-md cursor-pointer ${marcaSelected === 'MATT' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleShow('MATT')}
            >
                MATT
            </li>
            <li
                className={`border-solid border-1 shadow-sm my-6 p-2 rounded-md cursor-pointer ${marcaSelected === 'DMD' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleShow('DMD')}
            >
                DMD
            </li>
            <li
                className={`border-solid border-1 shadow-sm my-6 p-2 rounded-md cursor-pointer ${marcaSelected === 'ARIAT' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleShow('ARIAT')}
            >
                ARIAT
            </li>
            <li
                className={`border-solid border-1 shadow-sm my-6 p-2 rounded-md cursor-pointer ${marcaSelected === 'SANTA' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleShow('SANTA')}
            >
                SANTA
            </li>
            <li
                className={`border-solid border-1 shadow-sm my-6 p-2 rounded-md cursor-pointer ${marcaSelected === 'MAGUEY' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleShow('MAGUEY')}
            >
                MAGUEY
            </li>
            </ul>
            )}
            
           {loading && (<CenteredSpinner />)}

            {ventas && ( 

                <div id='resumen' className='mt-10 p-10'>
                    
                    <div>
                        <p>Periodo de consulta {formatoFecha(startDate)} al {formatoFecha(endDate)} </p>
                        <ul>
                            {Object.keys(marcasVendidas).map((marca) => (
                                <li key={marca} className={`${marcaSelected.toLowerCase() === marca ? '':'hidden'} `}>Total vendidos de {marca.toUpperCase()}: {marcasVendidas[marca]}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='pr-24 pl-10'>
                        <GraficaVentas sales={dataGraph}/>
                    </div>
                
                    <Table striped className={`mt-5 p-3 border border-blue`}>
                        <thead>
                            <tr>
                            <th>Fecha</th>
                            <th>Nota</th>
                            <th>Producto</th>
                            <th>Piezas</th>
                            <th>Precio/pieza</th>
                            <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {ventasFiltro?.map((item,index)=>(
                            <tr key={`${index}-venta`}>
                                <td>{formatoFecha(item.fecha)}</td>
                                <td>{item.nota}</td>
                                <td>{item.producto.product}</td>
                                <td>{item.producto.amount}</td>
                                <td>$ {formatNumberMX(item.producto.price)}</td>
                                <td>$ {formatNumberMX(item.producto.total)}</td>

                            </tr>
                        ))}
        
                        <tr className="table-row">
                            <td className="text-right" colSpan="5"> Total $ {formatNumberMX(granTotal.toFixed(2))}</td>
                        </tr>
                        </tbody>
                    </Table>

                </div>
                )}
            

         
            

        </CardBody>
        <CardFooter>
            
           {ventas && ( <Button onClick={handleGeneratePDF}>Generar estado de cuenta PDF</Button>)}
        </CardFooter>


      </Card>
    )
}