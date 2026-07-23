import { useNavigate, useParams } from "react-router-dom"
import { Card,CardHeader,CardBody,Button, Form, FormGroup,Label,Input,Row,Col, CardFooter } from "reactstrap"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import axios from "axios"


const useFormsFunction = ({id,endpoint,form,location,other})=>{

    const navigator = useNavigate()
    const [isNew,setIsNew] = useState(false)
    const [formData,setFormData] = useState({
       
    })
    const [formError,setFormError] = useState({})

    useEffect(()=>{

        const getResApi = async()=>{
            const resApi = await fetch(`${server}api/v1/${endpoint}/${id}`)
            const res = await resApi.json()

            if(res.success){
                setFormData(res.data)
            }

        }


        if(id === 'new'){
            setIsNew(true)
            setFormData(form)
        }else{
            getResApi()

        }
    },[])
    useEffect(()=>{

        console.log('DATA:',formData)
        console.log('ERROR',formError)

    },[formData])

    const handleChange = (e)=>{
        e.preventDefault()

        const { name, value,files,type } = e.target
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files
            });
        }else{
            if(isNew){
                setFormData({
                    ...formData,
                    ['status']:'Activo',
                    [name]:value
                })
                setFormError(
                    {
                        ...formError,
                        ['status']:'',
                        [name]:''
                    }
                )            
            }else{
                setFormData({
                    ...formData,
                    [name]:value
                })
                setFormError(
                    {
                        ...formError,
                        [name]:''
                    }
                )
            }
        }
        
        
        console.log('ESTEES EL CAMBIO',formData)
    }
    
    const handleSubmit = ()=>{

        const formulario = new FormData();
        let empty={}
       
        for(let input in formData){
            if(!formData[input]){
                empty[input]='empty'
            }else if(formData[input] instanceof FileList){
                for (let i = 0; i < formData[input].length; i++) {
                    formulario.append(`${input}`, formData[input][i]);
                }
            }
            else{
                formulario.append(input,formData[input])               
            }
            //Si esta lleno lo metemos a un elemento FormData.append
        }
        
        if(Object.keys(empty).length > 0){
            setFormError(empty)
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        
        function appendFormData(data, parentKey = '') {
            if (data && typeof data === 'object' && !Array.isArray(data) && !(data instanceof Date)) {
              Object.keys(data).forEach(key => {
                appendFormData(data[key], parentKey ? `${parentKey}[${key}]` : key);
              });
            } else if (Array.isArray(data)) {
              data.forEach((item, index) => {
                appendFormData(item, `${parentKey}[${index}]`);
              });
            } else {
                formulario.append(parentKey, data);
            }
          }
          if(other && Object.keys(other).length > 0){
            appendFormData(other);
          }
          
        if(isNew){
           
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
                    let urlApi =''
                    if(endpoint === 'auth/users'){
                        urlApi=`${server}api/v1/auth/register`
                    }else{
                        urlApi=`${server}api/v1/${endpoint}`
                        console.log(urlApi)
                    }
                    const { data } = await axios.post(urlApi,formulario)
                    
                    if(data.success){
                        Swal.fire(
                            {
                              position: "center",
                              icon: "success",
                              title: "Se creo correctamente",
                              html:`${data.message}`,
                              showConfirmButton: true,
                              // timer: 1500
                            }
                            ).then(result=>{
                                if(result.isConfirmed){
                                    navigator(location)
                                }
                            })
                    }else{
                        Swal.fire(`${res.message}`,'','error')
                    }
                }
            })
           
        }else{
            
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
                    const urlApi=`${server}api/v1/${endpoint}/${id}`
                        console.log(urlApi)
                    
                    const { data } = await axios.patch(urlApi,formulario)
                    
                    if(data.success){
                        Swal.fire(
                            {
                              position: "center",
                              icon: "success",
                              title: "Se creo correctamente",
                              html:`${data.message}`,
                              showConfirmButton: true,
                              // timer: 1500
                            }
                            ).then(result=>{
                                if(result.isConfirmed){
                                    navigator(location)
                                }
                            })
                    }
                }
            })
        }
    }

    return {isNew,formError,handleChange,handleSubmit,formData}
}

export default function FormRegistro(){
    
    const { id } = useParams()
    const location = '/gestion'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'managment/drivers',
        form:{
            nombre:'',
            rfc:'',
            telefono:'',
            correo:'',
            direccion:'',
            numLicencia:'',
            licencia:null,
            imagen:null,
            status:'Activo',
            esDisponible:'Disponible'
        },
        location
    })
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
      }
      handleChange(event)
    };


    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nueva Chofer':'Editar Chofer'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
                   
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="nombre" >Nombe</Label>
                                <Input type="text" name="nombre" id="nombre"  onChange={handleChange} className={`${formError.nombre === 'empty' ? 'border-red-600' : ''}`} value={formData.nombre}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="rfc" >RFC</Label>
                                <Input type="text" name="rfc" id="rfc" placeholder="" onChange={handleChange} className={`${formError.rfc === 'empty' ? 'border-red-600' : ''}`} value={formData.rfc}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="telefono" >Teléfono</Label>
                                <Input type="text" name="telefono" id="telefono" placeholder="" onChange={handleChange} className={`${formError.telefono === 'empty' ? 'border-red-600' : ''}`} value={formData.telefono}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="correo" >Correo</Label>
                                <Input type="text" name="correo" id="correo"  onChange={handleChange} className={`${formError.correo === 'empty' ? 'border-red-600' : ''}`} value={formData.correo}/>
                            </FormGroup>
                        </Col>
                        <Col md={8}>
                            <FormGroup>
                                <Label for="direccion" >Direccion</Label>
                                <Input type="text" name="direccion" id="direccion" placeholder="" onChange={handleChange} className={`${formError.direccion === 'empty' ? 'border-red-600' : ''}`} value={formData.direccion}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5}>
                            <FormGroup>
                                <Label for="numLicencia" >Número deicencia</Label>
                                <Input type="text" name="numLicencia" id="numLicencia"  onChange={handleChange} className={`${formError.numLicencia === 'empty' ? 'border-red-600' : ''}`} value={formData.numLicencia}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <FormGroup>
                            <Label for="licencia">Licencia</Label>
                            <Input type="file" name="licencia" id="licencia" onChange={handleImageChange} className={`${formError.licencia === 'empty' ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                        <FormGroup>
                            <Label for="imagen">Subir Foto</Label>
                            <Input type="file" name="imagen" id="imagen" onChange={handleImageChange} className={`${formError.imagen === 'empty' ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                        <Col md={6} >
                        {selectedImage && (
                            <div className="mt-3 w-40">
                            <h5>Foto del vehiculo</h5>
                            <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        </Col>
                    </Row>
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'Activo'}>ACTIVO</option>
                                    <option value={'Baja'}>BAJA</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        
                    </Row>
                    )}
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit} className='bg-curious-blue-500 hover:bg-curious-blue-600'>Guardar</Button>
            </CardFooter>
        </Card>
    )
}