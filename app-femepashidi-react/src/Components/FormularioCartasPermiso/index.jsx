import  { useEffect, useState } from 'react';
import './Form.css'
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardHeader,CardImg } from 'reactstrap';
import Swal from 'sweetalert2'
import axios from 'axios'


const FormularioCartasPermiso = ({data,onClose}) => {
    const navigator = useNavigate()
  const [formData, setFormData] = useState({
    nivelCompeticion:'',
    nombreCompetencia:'',
    domicilioCompetencia:'',
    ciudadEstadoCompetencia:'',
    paisCompetencia:'',
    fechaInicialCompetencia:'',
    fechaFinalCompetencia:'',
    
    comentariosCompetencia:''
                                
  });
  
  const [errorInput,setErrorInput] = useState({});
  const [selectedFile,setSelectedFile] = useState(null)

  const [user, setUser] = useState(null)
  const[loading,setLoading] = useState(false)

  useEffect(()=>{
    if(data){
        setUser(data)
    }
  },[data])

  const handleChangeFile = (e)=>{
    e.preventDefault(setSelectedFile(e.target.files[0]))
  }
  const handleChange = (e) => {
    e.preventDefault()
    const { name , value } = e.target
    setFormData({
        ...formData,
        [name]:value
    })

    setErrorInput({
        ...errorInput,
        [name]:''
    })
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(!selectedFile){
        alert('Por favor agregue el archivo de convocatoria');
        return
    }
    let errors={}
    for(let input in formData){
        if(!formData[input]){
            errors[input]='Campo obligatorio'
        }   
    }
    if(Object.keys(errors).length > 0){
        setErrorInput(errors)
        console.log('Ejecucion de error',errors)
        alert('Todos los campos deben ser llenados')
        return
    }
    const formulario = document.getElementById('formulario')
    const sendData = new FormData(formulario);
    const date = new Date();
    sendData.append('date',date.toISOString().split('T')[0])
    sendData.append('user',JSON.stringify(user))

   console.log("Contenido antes de enviar:", Object.fromEntries(sendData.entries()));



    Swal.fire({
        position: "center",
        icon: "question",
        title: "ALTA EN BASE DE DATOS",
        html:`¿Revisate que la información sea correcta?`,
        showConfirmButton: true,
        showCancelButton:true,
        confirmButtonText:'Si, claro',
        cancelButtonText:'No, espera'
        })
        .then(async(result)=>{
            if(result.isConfirmed){
                try {
                    setLoading(true)
                    const { data } = await axios.post(`${import.meta.env.VITE_SERVER}api/v1/letters`,sendData)
                    if(data.success){
                        Swal.fire({
                            title: 'Se envio tu solicitud',
                            text: 'Te enviamos un correo con los pasos a seguir',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                            }).then((result)=>{
                            console.log(result)
                            if(result.isConfirmed){
                                onClose()
                            }
                        })
                    }
                    
                } catch (error) {
                    Swal.fire(`${error}`,'','error')          
                }  finally {
                    setLoading(false)
                }
            }
        })
    }


  return (
    <>
        {
            user && (
                <Row >
        <Col md="12">
            <Card>
                <CardHeader>
                    
                    <h2 className="title"> Solicitud de carta permiso para competencia - F E M E P A S H I D I </h2>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit} id='formulario'>
                    <Row>
                        <Col md='5'>
                            <Label for="">{(<div className=''><span className='span'>Nombre:</span>{`${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`}</div>)}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='5'>
                            <Label for="">{<div className=''><span className='span'>CURP:</span>{user.curp}</div>}</Label>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md='5'>
                            <Label for="">{<div className=''><span className='span'>Asociacion:</span> {`${user.asociacion.nombre}`}</div>}</Label>
                        </Col>                      
                    </Row>
                    <Row>
                        <Col md='5'>
                            <Label for="">{<div className=''><span className='span'>Ultimo nivel aprobado:</span>{user && user.nivel_actual}</div>}</Label>
                        </Col>                      
                    </Row>
                    <FormGroup>
                        <Label for="nivelCompeticion"><span className='span'>Nivel a competir:</span>
                            <Input type="select" name="nivelCompeticion" id="nivelCompeticion"  onChange={handleChange} className={ errorInput.nivelCompeticion ==='Campo obligatorio' ? 'input-error' : 'nada'}>
                                <option value="">Nivel a COMPETIR</option>
                                <option value="Coach">Coach</option>	
                                <option value="Aspire 1">Aspire 1</option>
                                <option value="Aspire 2">Aspire 2</option>
                                <option value="Aspire 3">Aspire 3</option>
                                <option value="Aspire 4">Aspire 4</option>
                                <option value="Adult - Pairs">Adult - Pairs</option>	
                                <option value="Adult - Elite Master">Adult - Elite Master</option>	
                                <option value="Adult - Master">Adult - Master</option>	
                                <option value="Adult - Gold">Adult - Gold</option>	
                                <option value="Adult - Silver">Adult - Silver</option>	
                                <option value="Adult - Bronze">Adult - Bronze</option>	
                                <option value="Senior">Senior</option>	
                                <option value="Junior">Junior</option>	
                                <option value="Advanced Novice">Advanced Novice</option>	
                                <option value="Novice">Novice</option>	
                                <option value="Basic Novice B">Basic Novice B</option>	
                                <option value="Basic Novice A">Basic Novice A</option>	
                                <option value="Intermediate Novice">Intermediate Novice</option>	
                                <option value="Basic Novice">Basic Novice</option>	
                                <option value="Intermediate">Intermediate</option>	
                                <option value="Juvenile">Juvenile</option>	
                                <option value="Pre-Juvenile">Pre-Juvenile</option>	
                                <option value="Cubs">Cubs</option>	
                                <option value="Preliminary">Preliminary</option>	
                                <option value="Chicks">Chicks</option>	
                                <option value="Preliminary">Preliminary</option>	
                                <option value="Pre-Preliminary">Pre-Preliminary</option>	
                                <option value="Pre-Preliminary">Pre-Preliminary</option>	
                                <option value="Basic">Basic</option>	
                                <option value="Basic 6">Basic 6</option>	
                                <option value="Basic 2">Basic 2</option>	
                                <option value="Pre-Basic">Pre-Basic</option>	
                                <option value="Debutant II">Debutant II</option>	
                                <option value="Debutant I">Debutant I</option>	
                                <option value="Freestyle I">Freestyle I</option>	
                                <option value="Pre-Freestyle">Pre-Freestyle</option>	
                                <option value="No Test">No Test</option>
                            </Input>
                        </Label>
                    </FormGroup>
                    <h2 className="title"> Competencia a la que deseas asistir </h2>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="nombreCompetencia"><span className='span'>Nombre de la competencia:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="text" name="nombreCompetencia" id="nombreCompetencia"  onChange={handleChange}
                                className={ errorInput.nombreCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} />
                            </Col>
                        </Row>
                       
                        
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="domicilioCompetencia"><span className='span'>Domicilio:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="text" name="domicilioCompetencia" id="domicilioCompetencia"  onChange={handleChange}
                                className={ errorInput.domicilioCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} />
                            </Col>
                        </Row>         
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="ciudadEstadoCompetencia"><span className='span'>Ciudad y estado:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="text" name="ciudadEstadoCompetencia" id="ciudadEstadoCompetencia"  onChange={handleChange}
                                className={ errorInput.ciudadEstadoCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} />
                            </Col>
                        </Row>         
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="paisCompetencia"><span className='span'>País:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="select" name="paisCompetencia" id="paisCompetencia"  onChange={handleChange}
                                className={ errorInput.paisCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} >
                                    <option value="">Pais de la Competencia:</option>
                                    <option value="Germany">Alemania</option>	
                                    <option value="Andorra">Andorra</option>	
                                    <option value="Argentina">Argentina</option>	
                                    <option value="Armenia">Armenia</option>	
                                    <option value="Australia">Australia</option>	
                                    <option value="Austria">Austria</option>	
                                    <option value="Azerbaijan">Azerbaiyán</option>	
                                    <option value="Belgium">Bélgica</option>	
                                    <option value="Belarus">Bielorrusia</option>	
                                    <option value="Bosnia and Herzegovina">Bosnia-Herzegovina</option>	
                                    <option value="Brazil">Brasil</option>	
                                    <option value="Bulgaria">Bulgaria</option>	
                                    <option value="Canada">Canadá</option>	
                                    <option value="Czechia">Chequia</option>	
                                    <option value="China">China</option>	
                                    <option value="Korea (North)">Corea del Norte</option>	
                                    <option value="Korea (South)">Corea del Sur</option>	
                                    <option value="Croatia">Croacia</option>	
                                    <option value="Denmark">Dinamarca</option>	
                                    <option value="Ecuador">Ecuador</option>	
                                    <option value="Slovakia">Eslovaquia</option>	
                                    <option value="Slovenia">Eslovenia</option>	
                                    <option value="Spain">España</option>	
                                    <option value="United States">Estados Unidos</option>	
                                    <option value="Estonia">Estonia</option>	
                                    <option value="Philippines">Filipinas</option>	
                                    <option value="Finland">Finlandia</option>	
                                    <option value="France">Francia</option>	
                                    <option value="Georgia">Georgia</option>	
                                    <option value="United Kingdom">Gran Bretaña</option>	
                                    <option value="Greece">Grecia</option>	
                                    <option value="Hong Kong">Hong Kong</option>	
                                    <option value="Hungary">Hungría</option>	
                                    <option value="India">India</option>	
                                    <option value="Ireland">Irlanda</option>	
                                    <option value="Iceland">Islandia</option>	
                                    <option value="Israel">Israel</option>	
                                    <option value="Italy">Italia</option>	
                                    <option value="Japan">Japón</option>	
                                    <option value="Kazakhstan">Kazajistán</option>	
                                    <option value="Latvia">Letonia</option>	
                                    <option value="Lithuania">Lituania</option>	
                                    <option value="Luxembourg">Luxemburgo</option>	
                                    <option value="Malaysia">Malasia</option>	
                                    <option value="Mexico">México</option>	
                                    <option value="Monaco">Mónaco</option>	
                                    <option value="Mongolia">Mongolia</option>	
                                    <option value="Montenegro">Montenegro</option>	
                                    <option value="Norway">Noruega</option>	
                                    <option value="New Zealand">Nueva Zelanda</option>	
                                    <option value="Netherlands">Países Bajos</option>	
                                    <option value="Poland">Polonia</option>	
                                    <option value="Puerto Rico">Puerto Rico</option>	
                                    <option value="Romania">Rumanía</option>	
                                    <option value="Russia">Rusia</option>	
                                    <option value="Serbia">Serbia</option>	
                                    <option value="Singapore">Singapur</option>	
                                    <option value="South Africa">Sudáfrica</option>	
                                    <option value="Sweden">Suecia</option>	
                                    <option value="Switzerland">Suiza</option>	
                                    <option value="Thailand">Tailandia</option>	
                                    <option value="Turkey">Turquía</option>	
                                    <option value="Ukraine">Ucrania</option>	
                                    <option value="Uzbekistan">Uzbekistán</option>	
                                </Input>
                            </Col>
                        </Row>         
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="fechaInicialCompetencia"><span className='span'>Fecha inicial de competencia:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="date" name="fechaInicialCompetencia" id="fechaInicialCompetencia"  onChange={handleChange}
                                className={ errorInput.fechaInicialCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} />
                            </Col>
                        </Row>         
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="fechaFinalCompetencia"><span className='span'>Fecha Final de competencia:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="date" name="fechaFinalCompetencia" id="fechaFinalCompetencia"  onChange={handleChange}
                                className={ errorInput.fechaFinalCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} />
                            </Col>
                        </Row>         
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="archivo"><span className='span'>Archivo de la convocatoria:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="file" name="archivo" id="archivo"  onChange={handleChangeFile}
                                className={ selectedFile ? '' : 'input-error'} />
                            </Col>
                        </Row>         
                    </FormGroup>
                    <FormGroup>
                        <Row >
                            <Col md="4">
                                <Label for="comentariosCompetencia"><span className='span'>Comentarios adicionales:</span></Label>
                            </Col>
                            <Col md="7">
                                <Input type="text" name="comentariosCompetencia" id="comentariosCompetencia"  onChange={handleChange}
                                className={ errorInput.comentariosCompetencia ==='Campo obligatorio' ? 'input-error' : 'nada'} />
                            </Col>
                        </Row>         
                    </FormGroup>
                    <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</Button>
                    </Form>
                </CardBody>
            </Card>
        </Col>
    </Row>

            )
        }
    </>
   
    
  )

  
};

export default FormularioCartasPermiso;