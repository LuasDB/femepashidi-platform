import { useNavigate, useParams } from "react-router-dom"
import { Card,CardHeader,CardBody,Button, Form, FormGroup,Label,Input,Row,Col, CardFooter } from "reactstrap"
import CenteredSpinner from './../CenteredSpinner'
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import axios from "axios"

import Cotizador from './../Cotizador'

import { server } from './../../db/server'
import { ordenarPorNombre,formatoFolios,fechaHoraActual } from './../../Functions/funciones'
import { listadoNiveles } from './../../Utils/lists.js'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

const useFormsFunction = ({id,endpoint,form,location,other})=>{

    const navigator = useNavigate()
    const [isNew,setIsNew] = useState(false)
    const [formData,setFormData] = useState({
       
    })
    const [formError,setFormError] = useState({})

    useEffect(()=>{
        console.log('--------effect--------------')
        console.log(id)

        const getResApi = async()=>{

            try {
                const {data} = await axios.get(`${server}api/v1/${endpoint}/${id}`)

            if(data.success){
                setFormData(data.data)
                console.log(data.data)
            }
            } catch (error) {
                console.log('[ERROR]',error)
            }
            

        }

        if(id === 'new'){
            setIsNew(true)
            setFormData(form)
        }else{
            getResApi()
        }
    },[id])
    useEffect(()=>{

        console.log('DATA:',formData)
        console.log('ERROR',formError)

    },[formData])

    const handleChange = (e)=>{
        e.preventDefault()

        const { name, value,files,type } = e.target
        if (type === 'file') {
            console.log(files)
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
        
        
    }
    
    const handleSubmit = ()=>{

        const formulario = new FormData();
        let empty={}
         // Recorre las claves del objeto formulario externo
        const filteredFormData = Object.keys(form).reduce((acc, key) => {
        if (formData[key]) {
            acc[key] = formData[key];
        }
        return acc;
    }, {});

        if(filteredFormData.asociacion){
            delete filteredFormData['asociacion'] 
        }
       
        for(let input in filteredFormData){
            if(!filteredFormData[input]){
                empty[input]='empty'
            }else if(filteredFormData[input] instanceof FileList){
                for (let i = 0; i < filteredFormData[input].length; i++) {

                    formulario.append(`${input}`, filteredFormData[input][i]);
                }
            }
            else{
                formulario.append(input,filteredFormData[input])               
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
                    const { data } = await axios.post(urlApi,formulario,{ headers: authHeader() })

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
                title: "ACTUALIZACIÓN EN BASE DE DATOS",
                html:`¿Revisate que la información sea correcta?`,
                showConfirmButton: true,
                showCancelButton:true,
                confirmButtonText:'Si, claro',
                cancelButtonText:'No, espera'
            }).then(async(result)=>{
                if(result.isConfirmed){
                    const urlApi=`${server}api/v1/${endpoint}/${id}`
                        console.log(urlApi)
                        for (let [clave, valor] of formulario.entries()) {
                            console.log(clave, valor);
                          }

                    const { data } = await axios.patch(urlApi,formulario,{ headers: authHeader() })
                    
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

const useFormsFunctionJson = ({id,endpoint,form,location,other})=>{

    const navigator = useNavigate() 
    const [isNew,setIsNew] = useState(false)
    const [formData,setFormData] = useState({
       
    })
    const [formError,setFormError] = useState({})

    useEffect(()=>{
       
        const getResApi = async()=>{

            try {
                const {data} = await axios.get(`${server}api/v1/${endpoint}/${id}`)

            if(data.success){
                setFormData(data.data)
                console.log(data.data)
            }
            } catch (error) {
                console.log('[ERROR]',error)
            }
            

        }

        if(id === 'new'){
            setIsNew(true)
            setFormData(form)
        }else{
            getResApi()
        }
    },[id])
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
        
        
    }
    
    const handleSubmit = ()=>{
        console.log('EL FORMULARIO', formData)
        
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
                    const { data } = await axios.post(urlApi,formData,{ headers: authHeader() })
                    console.log('[ESTA ES LA RESPUESTA]',data)
                    
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
                title: "ACTUALIZACIÓN EN BASE DE DATOS",
                html:`¿Revisate que la información sea correcta?`,
                showConfirmButton: true,
                showCancelButton:true,
                confirmButtonText:'Si, claro',
                cancelButtonText:'No, espera'
            }).then(async(result)=>{
                if(result.isConfirmed){
                    const urlApi=`${server}api/v1/${endpoint}/${id}`                    
                    const { data } = await axios.patch(urlApi,formData,{ headers: authHeader() })
                    
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

export function FormUsers(){
   
    
    const { curp } = useParams()
    
    const location = '/gestion/patinadores'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunctionJson({
        id:curp,
        endpoint:'skaters',
        form:{
            curp:'',
            nombre:'',
            apellido_paterno:'',
            apellido_materno:'',
            telefono:'',
            correo:'',
            sexo:'',
            lugar_nacimiento:'',
            nivel_actual:'',
            categoria:'',
            id_asociacion:'',
            status:'Activo'
        },
        location
    })
    const [asociaciones,setAsociaciones] = useState([])

    useEffect(()=>{
        const getAsociaciones = async()=>{
            try {
                const { data } = await axios.get(`${server}api/v1/associations`)
                if(data.success){
                    setAsociaciones(data.data)
                }
            } catch (error) {
                Swal.fire('Error al cargar asociaciones',error,'error')
            }
        }

        getAsociaciones()
    },[])
 

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Usuario':'Editar Usuario'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-blue-500" > 
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="curp" >CURP</Label>
                                <Input type="text" name="curp" id="curp"  onChange={handleChange} className={`${formError.curp === 'empty' ? 'border-red-600' : ''}`} value={formData.curp}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="nombre" >Nombre(s) </Label>
                                <Input type="text" name="nombre" id="nombre" placeholder="" onChange={handleChange} className={`${formError.nombre === 'empty' ? 'border-red-600' : ''} `} value={formData.nombre}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="apellido_paterno" >Apellido Paterno </Label>
                                <Input type="text" name="apellido_paterno" id="apellido_paterno" placeholder="" onChange={handleChange} className={`${formError.apellido_paterno === 'empty' ? 'border-red-600' : ''} `} value={formData.apellido_paterno}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="apellido_materno" >Apellido Materno </Label>
                                <Input type="text" name="apellido_materno" id="apellido_materno" placeholder="" onChange={handleChange} className={`${formError.apellido_materno === 'empty' ? 'border-red-600' : ''} `} value={formData.apellido_materno}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="fecha_nacimiento" >Fecha de nacimiento </Label>
                                <Input type="date" name="fecha_nacimiento" id="fecha_nacimiento" placeholder="" onChange={handleChange} className={`${formError.fecha_nacimiento === 'empty' ? 'border-red-600' : ''} `} value={formData.fecha_nacimiento}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="sexo" >Sexo </Label>
                                <Input type="select" name="sexo" id="sexo" placeholder="" onChange={handleChange} className={`${formError.sexo === 'empty' ? 'border-red-600' : ''} `} value={formData.sexo}>
                                    <option value=''>--Selecciona--</option>
                                    <option value='MASCULINO'>MASCULINO</option>
                                    <option value='FEMENINO'>FEMENINO</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="lugar_nacimiento" >Lugar de nacimiento</Label>
                                <Input type="select" name="lugar_nacimiento" id="lugar_nacimiento" placeholder="" onChange={handleChange} className={`${formError.lugar_nacimiento === 'empty' ? 'border-red-600' : ''} `} value={formData.lugar_nacimiento}>
                                <option value=''>--Selecciona--</option>

                                <option value="Aguascalientes">Aguascalientes</option>
                                    <option value="Baja California">Baja California</option>
                                    <option value="Baja California Sur">Baja California Sur</option>
                                    <option value="Campeche">Campeche</option>
                                    <option value="Coahuila">Coahuila</option>
                                    <option value="Colima">Colima</option>
                                    <option value="Chiapas">Chiapas</option>
                                    <option value="Chihuahua">Chihuahua</option>
                                    <option value="Ciudad de México">Ciudad de México</option>
                                    <option value="Durango">Durango</option>
                                    <option value="Guanajuato">Guanajuato</option>
                                    <option value="Guerrero">Guerrero</option>
                                    <option value="Hidalgo">Hidalgo</option>
                                    <option value="Jalisco">Jalisco</option>
                                    <option value="Estado de México">Estado de México</option>
                                    <option value="Michoacán">Michoacán</option>
                                    <option value="Morelos">Morelos</option>
                                    <option value="Nayarit">Nayarit</option>
                                    <option value="Nuevo León">Nuevo León</option>
                                    <option value="Oaxaca">Oaxaca</option>
                                    <option value="Puebla">Puebla</option>
                                    <option value="Querétaro">Querétaro</option>
                                    <option value="Quintana Roo">Quintana Roo</option>
                                    <option value="San Luis Potosí">San Luis Potosí</option>
                                    <option value="Sinaloa">Sinaloa</option>
                                    <option value="Sonora">Sonora</option>
                                    <option value="Tabasco">Tabasco</option>
                                    <option value="Tamaulipas">Tamaulipas</option>
                                    <option value="Tlaxcala">Tlaxcala</option>
                                    <option value="Veracruz">Veracruz</option>
                                    <option value="Yucatán">Yucatán</option>
                                    <option value="Zacatecas">Zacatecas</option>
                                    <option value="Extranjero">Extranjero</option>
                                </Input>

                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="categoria" >Categoria</Label>
                                <Input type="text" name="categoria" id="categoria" placeholder="" onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''} `} value={formData.categoria}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="nivel_actual" >Nivel actual </Label>
                                <Input type="select" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''} `} value={formData.nivel_actual}>
                                    <option value=''>--Selecciona--</option>
                                    {listadoNiveles?.map((nivel,index)=>(
                                        <option value={nivel} key={`${index}--lev`}>{nivel}</option>
                                    ))}
                                    
                                </Input>
                            </FormGroup>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="id_asociacion" >Asociacion</Label>
                                <Input type="select" name="id_asociacion" id="id_asociacion" placeholder="" onChange={handleChange} className={`${formError.id_asociacion === 'empty' ? 'border-red-600' : ''} `} value={formData.id_asociacion}>
                                    <option value={''} >--Selecciona Asociacion--</option>
                                    {asociaciones?.map((item,index)=>(
                                    <option key={`${index}-assoc`} value={item._id}>{item.nombre}</option>

                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                        
                        
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="correo" >Correo</Label>
                                <Input type="text" name="correo" id="correo" placeholder="" onChange={handleChange} className={`${formError.correo === 'empty' ? 'border-red-600' : ''} `} value={formData.correo}/>
                            </FormGroup>
                        </Col>
                       
                        <Col md={4}>
                            <FormGroup>
                                <Label for="telefono" >Telefono</Label>
                                <Input type="text" name="telefono" id="telefono" placeholder="" onChange={handleChange} className={`${formError.telefono === 'empty' ? 'border-red-600' : ''} `} value={formData.telefono}>

                                </Input>
                            </FormGroup>
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
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>


        </Card>
    )
}

// Cuenta única con rol presidente_asociacion, ligada a esta asociación
// (Fase 2 del panel de presidentes). Solo visible al editar una asociación
// ya existente, porque necesita el id de la asociación.
function PresidenteAccountForm({ associationId }){
    const [form,setForm] = useState({ name:'', email:'', password:'' })
    const [existingUser,setExistingUser] = useState(null)
    const [checkingExisting,setCheckingExisting] = useState(true)
    const [newPassword,setNewPassword] = useState('')
    const [saving,setSaving] = useState(false)

    useEffect(()=>{
        const fetchExisting = async()=>{
            try {
                const { data } = await axios.get(
                    `${server}api/v1/auth/users/by-association/${associationId}`,
                    { headers: authHeader() }
                )
                setExistingUser(data.data || null)
            } catch (error) {
                Swal.fire('Algo salió mal', error?.response?.data?.message || error.message, 'error')
            } finally {
                setCheckingExisting(false)
            }
        }
        fetchExisting()
    },[associationId])

    const handleChange = (e)=>{
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async ()=>{
        if(!form.name || !form.email || !form.password){
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        try {
            setSaving(true)
            const { data } = await axios.post(
                `${server}api/v1/auth/register`,
                { ...form, role:'presidente_asociacion', associationId },
                { headers: authHeader() }
            )
            if(data.success){
                Swal.fire('Cuenta creada','El presidente ya puede iniciar sesión con ese correo','success')
                // POST /auth/register solo devuelve {id,email} (id en minúsculas);
                // el modo de actualizar contraseña necesita _id, que es lo que
                // GET /auth/users/by-association sí regresa tras un reload.
                setExistingUser({ _id: data.data.id, name: form.name, email: form.email })
                setForm({ name:'', email:'', password:'' })
            }
        } catch (error) {
            Swal.fire('Algo salió mal', error?.response?.data?.message || error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async ()=>{
        if(!newPassword || newPassword.length < 8){
            Swal.fire('La contraseña debe tener al menos 8 caracteres','','warning')
            return
        }
        try {
            setSaving(true)
            const { data } = await axios.patch(
                `${server}api/v1/auth/users/${existingUser._id}/password`,
                { password:newPassword },
                { headers: authHeader() }
            )
            if(data.success){
                Swal.fire('Contraseña actualizada','El presidente ya puede iniciar sesión con la nueva contraseña','success')
                setNewPassword('')
            }
        } catch (error) {
            Swal.fire('Algo salió mal', error?.response?.data?.message || error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    if(checkingExisting){
        return null
    }

    if(existingUser){
        return (
            <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
                <CardHeader>
                    <h3>Cuenta de presidente de asociación</h3>
                </CardHeader>
                <CardBody>
                    <Form className="text-curious-blue-700">
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>Nombre</Label>
                                    <Input type="text" value={existingUser.name} disabled/>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>Correo</Label>
                                    <Input type="text" value={existingUser.email} disabled/>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="pres-new-password">Nueva contraseña</Label>
                                    <Input type="password" id="pres-new-password" onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
                <CardFooter>
                    <Button disabled={saving} onClick={handleUpdatePassword} className='bg-curious-blue-500 hover:bg-curious-blue-600'>Actualizar contraseña</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>Cuenta de presidente de asociación</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700">
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="pres-name">Nombre</Label>
                                <Input type="text" name="name" id="pres-name" onChange={handleChange} value={form.name}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="pres-email">Correo</Label>
                                <Input type="text" name="email" id="pres-email" onChange={handleChange} value={form.email}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="pres-password">Contraseña</Label>
                                <Input type="password" name="password" id="pres-password" onChange={handleChange} value={form.password}/>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
            <CardFooter>
                <Button disabled={saving} onClick={handleSubmit} className='bg-curious-blue-500 hover:bg-curious-blue-600'>Crear cuenta</Button>
            </CardFooter>
        </Card>
    )
}

//Revisado
export function FormaAssociations(){


    const { id } = useParams()
    const location = '/gestion/asociaciones'


    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunctionJson({
        id,
        endpoint:'associations',
        form:{
            nombre:'',
            representante:'',
            correo:'',
            abreviacion:'',
            status:'Activo'
        },
        location
    })
    

    return (
        <>
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nueva Asociación':'Editar Asociación'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" >

                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nombre" >Nombre</Label>
                                <Input type="text" name="nombre" id="nombre"  onChange={handleChange} className={`${formError.nombre === 'empty' ? 'border-red-600' : ''}`} value={formData.nombre}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="abreviacion" >Abreviación</Label>
                                <Input type="text" name="abreviacion" id="abreviacion" placeholder="" onChange={handleChange} className={`${formError.abreviacion === 'empty' ? 'border-red-600' : ''}`} value={formData.abreviacion}/>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    <Row>
                        
                        <Col md={8}>
                            <FormGroup>
                                <Label for="representante" >Representante</Label>
                                <Input type="text" name="representante" id="representante" placeholder="" onChange={handleChange} className={`${formError.representante === 'empty' ? 'border-red-600' : ''}`} value={formData.representante
                                }/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="correo" >Correo</Label>
                                <Input type="text" name="correo" id="correo"  onChange={handleChange} className={`${formError.correo === 'empty' ? 'border-red-600' : ''}`} value={formData.correo}/>
                            </FormGroup>
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
        {!isNew && <PresidenteAccountForm associationId={id} />}
        </>
    )
}
//Revisado
export function FormEvents(){

    
    const { id } = useParams()
    const location = '/gestion/eventos'
   

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunctionJson({
        id,
        endpoint:'events',
        form:{
            nombre:'',
            lugar:'',
            fecha_inicio:'',
            fecha_fin:'',
            descripcion:'',
            tipo_competencia:'',
            status:'Activo'
        },
        location
    })
    

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Evento':'Editar Evento'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
                   
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nombre" >Nombre</Label>
                                <Input type="text" name="nombre" id="nombre"  onChange={handleChange} className={`${formError.nombre === 'empty' ? 'border-red-600' : ''}`} value={formData.nombre}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="lugar" >Lugar</Label>
                                <Input type="text" name="lugar" id="lugar" placeholder="" onChange={handleChange} className={`${formError.lugar === 'empty' ? 'border-red-600' : ''}`} value={formData.lugar}/>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    <Row>      
                        <Col md={6}>
                            <FormGroup>
                                <Label for="fecha_inicio" >Fecha de inicio</Label>
                                <Input type="date" name="fecha_inicio" id="fecha_inicio" placeholder="" onChange={handleChange} className={`${formError.fecha_inicio === 'empty' ? 'border-red-600' : ''}`} value={formData.fecha_inicio
                                }/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="fecha_fin" >Fecha de finalización</Label>
                                <Input type="date" name="fecha_fin" id="fecha_fin"  onChange={handleChange} className={`${formError.fecha_fin === 'empty' ? 'border-red-600' : ''}`} value={formData.fecha_fin}/>
                            </FormGroup>
                        </Col>
                    </Row> 
                    <Row>      
                        <Col md={6}>
                            <FormGroup>
                                <Label for="descripcion" >Descripcion</Label>
                                <Input type="text" name="descripcion" id="descripcion" placeholder="" onChange={handleChange} className={`${formError.descripcion === 'empty' ? 'border-red-600' : ''}`} value={formData.descripcion
                                }/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="tipo_competencia" >Tipo de competencia</Label>
                                <Input type="select" name="tipo_competencia" id="tipo_competencia"  onChange={handleChange} className={`${formError.tipo_competencia === 'empty' ? 'border-red-600' : ''}`} value={formData.tipo_competencia}>
                                    <option value=''>--Selecciona Tipo--</option>
                                    <option value='Nacional'>Nacional</option>
                                    <option value='Open Internacional'>⁠Open Internacional</option>
                                    <option value='⁠Internacional ISU'>⁠Internacional ISU</option>
                                </Input>
                            </FormGroup>
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


//Revisado
export function FormCommunications(){
    
    const { id } = useParams()
    const location = '/gestion/comunicados'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'announcements',
        form:{
            titulo:'',
            texto1:'',
            texto2:'',
            texto3:'',
            texto4:'',
            texto5:'',
            doc:null,
            img:null,
            status:'Activo'
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
                <h3>{isNew ? 'Nuevo comunicado':'Editar Comunicado'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
                   
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="titulo" >Titulo</Label>
                                <Input type="text" name="titulo" id="titulo"  onChange={handleChange} className={`${formError.titulo === 'empty' ? 'border-red-600' : ''}`} value={formData.titulo}/>
                            </FormGroup>
                        </Col>
                        
                       
                    </Row>
                    <Row>    
                        <Col md={6}>
                            <FormGroup>
                                <Label for="texto1" >Texto 1</Label>
                                <Input type="text" name="texto1" id="texto1" placeholder="" onChange={handleChange} className={`${formError.texto1 === 'empty' ? 'border-red-600' : ''}`} value={formData.texto1}/>
                            </FormGroup>
                        </Col></Row><Row>| 
                        <Col md={6}>
                            <FormGroup>
                                <Label for="texto2" >Texto 2</Label>
                                <Input type="text" name="texto2" id="texto2" placeholder="" onChange={handleChange} className={`${formError.texto2 === 'empty' ? 'border-red-600' : ''}`} value={formData.texto2}/>
                            </FormGroup>
                        </Col></Row><Row>|
                        <Col md={6}>
                            <FormGroup>
                                <Label for="texto3" >Texto 3</Label>
                                <Input type="text" name="texto3" id="texto3" placeholder="" onChange={handleChange} className={`${formError.texto3 === 'empty' ? 'border-red-600' : ''}`} value={formData.texto3}/>
                            </FormGroup>
                        </Col></Row><Row>|
                        <Col md={6}>
                            <FormGroup>
                                <Label for="texto4" >Texto 4</Label>
                                <Input type="text" name="texto4" id="texto4" placeholder="" onChange={handleChange} className={`${formError.texto4 === 'empty' ? 'border-red-600' : ''}`} value={formData.texto4}/>
                            </FormGroup>
                        </Col></Row><Row>|
                        <Col md={6}>
                            <FormGroup>
                                <Label for="texto5" >Texto 5</Label>
                                <Input type="text" name="texto5" id="texto5" placeholder="" onChange={handleChange} className={`${formError.texto5 === 'empty' ? 'border-red-600' : ''}`} value={formData.texto5}/>
                            </FormGroup>
                        </Col>
                       
                    </Row> 
                    <Row>      
                        <Col md={6}>
                            <FormGroup>
                                <Label for="doc" >Documento del comunicado</Label>
                                <Input type="file" name="doc" id="doc" placeholder="" onChange={handleChange} className={`${formError.doc === 'empty' ? 'border-red-600' : ''}`} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="img" >Imagen muestra</Label>
                                <Input type="file" name="img" id="img" placeholder="" onChange={handleImageChange} className={`${formError.img === 'empty' ? 'border-red-600' : ''}`} />
                            </FormGroup>
                        </Col>
                        {selectedImage && (
                            <div className="mt-3 w-40">
                            <h5>Imagen del comunicado</h5>
                            <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        
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

export function FormRegister(){
    
    const { id } = useParams()
    const location = '/gestion/inscripciones'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunctionJson({
        id,
        endpoint:'register',
        form:{
            nivel_actual:'',
            categoria:'',
            status:''
        },
        location
    })
    

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo evento':'Editar inscripcion'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
               
                    <Row>      
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nivel_actual" >Nivel a competir</Label>
                                <Input type="text" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''}`} value={formData.nivel_actual
                                }/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="categoria" >Categoria</Label>
                                <Input type="text" name="categoria" id="categoria"  onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''}`} value={formData.categoria}/>
                            </FormGroup>
                        </Col>
                    </Row> 
                                
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'Preinscrito'}>Preinscrito</option>
                                    <option value={'aprobado'}>Aprobado</option>
                                    <option value={'rechazado'}>Rechazado</option>
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
//Revisado
export function FormResults(){
    
    const { id } = useParams()
    const location = '/gestion/resultados'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'results',
        form:{
            titulo:'',
            img:null,
            carpeta:'',
            condicion:'vigente',
            status:'Activo'
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
                <h3>{isNew ? 'Nuevo resultado':'Editar Resultado'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
                   
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="titulo" >Titulo</Label>
                                <Input type="text" name="titulo" id="titulo"  onChange={handleChange} className={`${formError.titulo === 'empty' ? 'border-red-600' : ''}`} value={formData.titulo}/>
                            </FormGroup>
                        </Col>
                        
                       
                    </Row>
                    <Row>    
                        <Col md={6}>
                            <FormGroup>
                                <Label for="carpeta" >Carpeta</Label>
                                <Input type="text" name="carpeta" id="carpeta" placeholder="" onChange={handleChange} className={`${formError.carpeta === 'empty' ? 'border-red-600' : ''}`} value={formData.carpeta}/>
                            </FormGroup>
                        </Col></Row>
                        
                    <Row>      
                       
                        <Col md={6}>
                            <FormGroup>
                                <Label for="img" >Imagen muestra</Label>
                                <Input type="file" name="img" id="img" placeholder="" onChange={handleImageChange} className={`${formError.img === 'empty' ? 'border-red-600' : ''}`} />
                            </FormGroup>
                        </Col>
                        {selectedImage && (
                            <div className="mt-3 w-40">
                            <h5>Imagen del boton de resultado</h5>
                            <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        
                    </Row>               
                    {!isNew && (
                        <div>
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
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="condicion" >Condicion</Label>
                                <Input type="select" name="condicion" id="condicion" onChange={handleChange} className={`${formError.condicion ? 'border-red-600' : ''}`} value={formData.condicion}>
                                    <option value={'vigente'}>VIGENTE</option>
                                    <option value={'pasado'}>PASADO</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        
                        </Row>
                        </div>
                        
                    )}
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit} className='bg-curious-blue-500 hover:bg-curious-blue-600'>Guardar</Button>
            </CardFooter>


        </Card>
    )
}

export function FormExams(){
    console.log('FORMULARIO EXAMEN NUEVO')
    
    const { id } = useParams()
    const location = '/gestion/examenes'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'exams',
        form:{
            curp:'',
            lugar:'',
            fecha_examen:'',
            fecha_solicitud:'',
            status:'Activo'
        },
        location
    })
    

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Examen':'Editar Examen'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
                   
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="curp" >CURP del pationador</Label>
                                <Input type="text" name="curp" id="curp"  onChange={handleChange} className={`${formError.curp === 'empty' ? 'border-red-600' : ''}`} value={formData.curp}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="lugar" >Lugar</Label>
                                <Input type="text" name="lugar" id="lugar" placeholder="" onChange={handleChange} className={`${formError.lugar === 'empty' ? 'border-red-600' : ''}`} value={formData.lugar}/>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    <Row>      
                        <Col md={6}>
                            <FormGroup>
                                <Label for="fecha_solicitud" >Fecha de Solicitud</Label>
                                <Input type="date" name="fecha_solicitud" id="fecha_solicitud" placeholder="" onChange={handleChange} className={`${formError.fecha_solicitud === 'empty' ? 'border-red-600' : ''}`} value={formData.fecha_solicitud
                                }/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="fecha_examen" >Fecha de Examen</Label>
                                <Input type="date" name="fecha_examen" id="fecha_examen"  onChange={handleChange} className={`${formError.fecha_examen === 'empty' ? 'border-red-600' : ''}`} value={formData.fecha_examen}/>
                            </FormGroup>
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

export function FormExamsEdit(){
    const [isNew,setIsNew] = useState(false)
    const { id,year } = useParams()
    const [formData,setFormData] = useState({
       
    })
    const [formError,setFormError] = useState({})

    const location = '/gestion/examenes'
    useEffect(()=>{

        console.log()
        if(id!== 'new'){
            setIsNew(false)
        }

        const getData = async ()=>{
            try {
                const { data } = await axios.get(`${server}api/v1/exams/get-one/${year}/${id}`)
                console.log('Datos de examen',data)
                setFormData(data.data)
            } catch (error) {
                Swal.fire('Algo salio mal',`No se puedo descargar la informacion ${error.message}`,'error')
            }
        }

        getData()
    },[])
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
         // Recorre las claves del objeto formulario externo
        const filteredFormData = Object.keys(form).reduce((acc, key) => {
        if (formData[key]) {
            acc[key] = formData[key];
        }
        return acc;
        }, {});

        if(filteredFormData.asociacion){
            delete filteredFormData['asociacion'] 
        }
       
        for(let input in filteredFormData){
            if(!filteredFormData[input]){
                empty[input]='empty'
            }else if(filteredFormData[input] instanceof FileList){
                for (let i = 0; i < filteredFormData[input].length; i++) {
                    formulario.append(`${input}`, filteredFormData[input][i]);
                }
            }
            else{
                formulario.append(input,filteredFormData[input])               
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
                        for (let [clave, valor] of formulario.entries()) {
                            console.log(clave, valor);
                          }
                    
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

   
    

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Examen':'Editar Examen'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-curious-blue-700" > 
                   
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="curp" >CURP del pationador</Label>
                                <Input type="text" name="curp" id="curp"  onChange={handleChange} className={`${formError.curp === 'empty' ? 'border-red-600' : ''}`} value={formData.curp}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="lugar" >Lugar</Label>
                                <Input type="text" name="lugar" id="lugar" placeholder="" onChange={handleChange} className={`${formError.lugar === 'empty' ? 'border-red-600' : ''}`} value={formData.lugar}/>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    <Row>      
                        <Col md={6}>
                            <FormGroup>
                                <Label for="fecha_solicitud" >Fecha de Solicitud</Label>
                                <Input type="date" name="fecha_solicitud" id="fecha_solicitud" placeholder="" onChange={handleChange} className={`${formError.fecha_solicitud === 'empty' ? 'border-red-600' : ''}`} value={formData.fecha_solicitud
                                }/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="fecha_examen" >Fecha de Examen</Label>
                                <Input type="date" name="fecha_examen" id="fecha_examen"  onChange={handleChange} className={`${formError.fecha_examen === 'empty' ? 'border-red-600' : ''}`} value={formData.fecha_examen}/>
                            </FormGroup>
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



