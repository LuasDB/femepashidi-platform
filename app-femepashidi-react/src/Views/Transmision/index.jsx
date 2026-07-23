import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, FormGroup,Input,Label, Row,Button } from "reactstrap";
import { server } from "./../../db/server"
import Swal from "sweetalert2";



export default function Transmision(){

    const [urlStream, setUrl] = useState('')
    const [linkStatus, setLinkStatus] = useState('false')
    const [textoInicio, setTexto] = useState('')
    const [file,setFile] = useState()
    const [img,setImg] = useState()
    
    useEffect(()=>{
        const fetchResult = async()=>{
            try {
                const { data } = await axios.get(`${server}api/v1/streaming/NZ2VilnGRHPWTrPNl9Dt`)
                console.log('DATASTREAM:',data)
                if(data.success){
                    console.log('SE EJECUTA IF',data.data.urlStream)
                    setUrl(data.data.urlStream)
                    setLinkStatus(data.data.linkStatus)
                    setTexto(data.data.textoInicio)
                }
            } catch (error) {
                Swal.fire('Algo salio mal',error,'error')
            }
        }
        fetchResult()
    },[])


    const handleSelectedImage = (e)=>{
        const file = e.target.files[0]
        if(file){
            const imageUrl = URL.createObjectURL(file)
            setImg(imageUrl)
        }
        setFile(file)
        
    }

    const handleUpdate = async()=>{
        const formData = new FormData()
        formData.append("urlStream",urlStream)
        formData.append("textoInicio",textoInicio)
        formData.append("logo",file)
        formData.append("linkStatus",linkStatus)


        try {
            const { data } = await axios.patch(`${server}api/v1/streaming/NZ2VilnGRHPWTrPNl9Dt`,formData)
            if(data.success){
                Swal.fire('Actualizado',data.message,'success')
            }

        } catch (error) {
            Swal.fire('Algo salio mal',error,'error')
        }
    }



    return (
        <Card>
            <CardHeader>
                <h2>Consfiguracion de la transmisión</h2>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md={8}>
                    <FormGroup switch>
                        <Input type="switch" role="switch" onChange={(e)=>setLinkStatus(e.target.checked)} value={linkStatus}/>
                        <Label check>Activar transmisión</Label>
                    </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={8}>
                        <FormGroup>
                            <Label>Url de la transmisión</Label>
                            <Input type="text" name="" onChange={(e)=>setUrl(e.target.value)} value={urlStream}/>                
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={8}>
                        <FormGroup>
                            <Label>Texto de Inicio</Label>
                            <Input type="text" name="" onChange={(e)=>setTexto(e.target.value)} value={textoInicio}/>                
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={8}>
                        <FormGroup>
                            <Label>Logo de la competencia</Label>
                            <Input type="file" onChange={handleSelectedImage}/>                
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <img src={img} className='w-[200px]'/>
                    </Col>
                </Row>
                <Row>
                <Col md={4}><Button className='bg-blue-500 hover:bg-blue-600 ' onClick={handleUpdate}>Actualizar</Button></Col>
                    
                </Row>
               

            </CardBody>
        </Card>

    )

}