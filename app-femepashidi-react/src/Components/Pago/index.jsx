import { useEffect, useState } from 'react';
import {Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Table, Row, Col } from 'reactstrap';
import axios from 'axios';
import {server} from './../../db/server'


import Swal from 'sweetalert2';
import { formatoNumeroMX } from '../../Functions/funciones';

export default function Pago({pays,totalSale,adeudo,idService}){

   

    const [newPay, setNewPay] = useState(false)
    const [fechaPago,setFechaPago] = useState('')
    const [montoPago,setMontoPago] = useState('')
    const [referenciaPago,setReferenciaPago] = useState('')
    const [newAdeudo,setNewAdeudo] = useState(0)
    
    const [paysList, setPaysList] = useState([])

    useEffect(()=>{
        setPaysList(pays)
        setNewAdeudo(adeudo)
    },[])




    const handleNewPay = ()=>{
        setNewPay(true)
    }
    const handleAddPay = ()=>{
        console.log(paysList)
        if(fechaPago && montoPago && referenciaPago){
            if(parseFloat(adeudo) < parseFloat(montoPago) ){
                Swal.fire('El monto ingresado es mayor al adeudo, por favor verifica y vuelve a intentarlo',`El adeudo actual es de $ ${adeudo}`,'error')
            return 
            }
            const newPays =[...paysList,{fechaPago,montoPago,referenciaPago}]
            const lastAdeudo = parseFloat(newAdeudo) - parseFloat(montoPago)
            let dataToUpdate ={}
            if(lastAdeudo === 0){
                dataToUpdate = {
                    pays:newPays,
                    adeudo:lastAdeudo,
                    estadoPagos:'Pagado'
                }
            }else{
                dataToUpdate = {
                    pays:newPays,
                    adeudo:lastAdeudo
                }
            }
            

            Swal.fire({
                position: "center",
                icon: "question",
                title: "ALTA EN BASE DE DATOS",
                html:`¿Revisate que la información sea correcta? <br> Fecha: ${fechaPago}  <br> Monto: $${montoPago} <br> Referencia ${referenciaPago}`,
                showConfirmButton: true,
                showCancelButton:true,
                confirmButtonText:'Si, claro',
                cancelButtonText:'No, espera'
            }).then(async(result)=>{
                if(result.isConfirmed){                                   
                    try {
                        const { data } = await axios.patch(`${server}api/v1/services/${idService}`,dataToUpdate)

                        if(data.success){
                            setPaysList(newPays)
                            setNewAdeudo(lastAdeudo)
                            setFechaPago('')
                            setMontoPago('')
                            setReferenciaPago('')
                            setNewPay(false)
                        }                
                    } catch (error) {
                    Swal.fire('Algo salio mal!',error,'error')   
                    }
                }
            })
                  

        }else{
            Swal.fire('Todos los campos deben ser llenados','','warning')
        }

    }


    return (
        <Card className='mt-4 p-6'>
            {!newPay &&(<Row>
                <Col md={4}>
                    <Button type='button' className='bg-green-600 hover:bg-green-800' onClick={handleNewPay}>Nuevo Pago</Button>
                </Col>
            </Row>)}
            

          <CardBody>          
            {newPay &&
            (<Form  className='text-sm'>
              <Row>
                <Col md={3}>
                  <FormGroup>
                      <Label for='fecha_pago'>Fecha del pago</Label>
                      <Input 
                      type='date' 
                      name='fechaPago'
                      onChange={(e)=>setFechaPago(e.target.value)}
                       />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                      <Label for='montoPago'>Monto del pago</Label>
                      <Input 
                      type='number' 
                      name='monto_pago'
                      onChange={(e)=>setMontoPago(e.target.value)} 

                      />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                      <Label for='montoPago' className='text-[13px]'>Factura / Referencia de Pago</Label>
                      <Input 
                      type='text' 
                      name='referenciaPago'
                      onChange={(e)=>setReferenciaPago(e.target.value)} 

                      />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  
                     <Button 
                     type='button' 
                     className='bg-blue-400 hover:bg-blue-700'
                     onClick={handleAddPay}>Agregar Pago</Button>
                  
                </Col>        
              </Row>
            </Form>)}
            <Row>
                <Col md={12}>
                    <CardTitle>REGISTRO DE PAGOS</CardTitle>
                    <Table>
                        <thead>
                            <tr>
                                <th>Fecha de Pago</th>
                                <th>Monto</th>
                                <th>Referencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paysList?.map((item, index)=>(
                                <tr key={index}>
                                    <td>{item.fechaPago}</td>
                                    <td>$ {formatoNumeroMX(item.montoPago)}</td>
                                    <td>{item.referenciaPago}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Col>
            </Row>
            <Row className='border text-center rounded-lg bg-red-300'>
                    <Col md={3}>
                    
                    </Col>
                    <Col md={3}>
                    
                    </Col>
                    <Col md={3} className='text-blue-950'>
                    ADEUDO
                    </Col>
                    <Col md={3} className='text-blue-950'>
                    $ {formatoNumeroMX(newAdeudo)}
                    </Col>
            </Row>
          </CardBody>
        </Card>
      );
}

