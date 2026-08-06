import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CalendarX2 } from 'lucide-react';
import { Row, Col, Input,FormGroup,Label} from "reactstrap"
import './styles.css';
import axios from "axios"
import { server,urlApp } from "../../db/server"
import Swal from "sweetalert2"
import {obtenerCategoria} from "../../Functions/funciones.js"
import { fetchCategoryConfig } from "../../Functions/categoryConfig.js"
import { competitionLevels,categoriesByCompetition } from "./../../Utils/lists.js"
import SkaterAccountGate from "../../Components/SkaterAccountGate"
import CenteredSpinner from "../../Components/CenteredSpinner"


const InscripcionCompetencia = () => {
    const [formData,setFormData] = useState({})
    const [dataToSend,setDataToSend] = useState({
        id_events:'',

    })
    const [originalLevel,setOriginalLevel]=useState(null)
    const [firstLevel,setFirstLevel] = useState(null)
    const [events,setEvents] = useState({})
    const [formError,setFormError] = useState({

    })
    const [loading,setLoading] = useState(false)
    const [isRegister,setIsRegister] = useState(false)
    const [isAdult,setisAdult] = useState(false)
    const [selectedCompetitionType,setSelectedCompetitionType] = useState('')
    const [isConfirmed,setIsConfirmed] = useState(false)
    const [isCategory,setIsCategory] = useState(false)

    const [newFoto, setNewFoto] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);
    const [noEvents, setNoEvents] = useState(false)
    const [checkingEvents, setCheckingEvents] = useState(true)
    const [categoryConfig, setCategoryConfig] = useState(null)
    const navigator = useNavigate()

    const fetchEvents = async()=>{
            try {
                const { data } = await axios.get(`${server}api/v1/events`)

                if(data.success){
                    const activeEvents = data.data.filter(item=>item.status === 'Activo')
                    console.log(activeEvents)

                    if(activeEvents.length === 0){
                        setNoEvents(true)
                    }else{
                    setEvents(activeEvents)

                    }

                }
            } catch (error) {
                console.log(error)
            } finally {
                setCheckingEvents(false)
            }

    }
    const handleSkaterSelected = (skaterData)=>{
        const verificacion = skaterData?.verificacion;
        if(verificacion !== true && verificacion !== 'true'){
            Swal.fire('No puedes inscribirte aun!','Tu registro aun no ha sido autorizado, espera a que tu asociación verifique tu registro a nuestrta plataforma y una vez autorizado vuelve a intentarlo','warning').then(response=>{
                if(response.isConfirmed){
                    window.location.reload()
                }
            })

        }
        if(skaterData.nivel_actual.toLowerCase().includes('adulto')){
            setisAdult(true)
        }
        setFirstLevel(skaterData.nivel_actual.toLowerCase())


        setIsRegister(true)
        const user = {
            ...skaterData,
            categoria: obtenerCategoria(skaterData.fecha_nacimiento, skaterData.nivel_actual,skaterData.nivel_actual.toLowerCase().includes('adulto'), categoryConfig)
        }

        setFormData(user)
        setPreviewFoto(user?.img?`${server}${user?.img?.path}`:`${server}uploads/skaters/user.png`)
        setOriginalLevel({
            nivel_actual:user.nivel_actual,
            categoria:user.categoria
        })

        setDataToSend({...dataToSend,
            id_user:skaterData.id,
            id_association:skaterData.id_asociacion,
            categoria:user.categoria,
            nivel_actual:skaterData.nivel_actual
        })
    }
    useEffect(() => {
        fetchEvents()
        fetchCategoryConfig().then(setCategoryConfig)
    }, []);

    const handleChange = (e)=>{
        e.preventDefault()
        const { name, value} = e.target
        setFormData({...formData,[name]:value})
    }
    const handleChangeCompetation = (e)=>{
        e.preventDefault()
        const { name, value} = e.target

        const [id,tipo] = value.split(',')
        console.log(id)
        console.log(tipo)
        setSelectedCompetitionType(tipo.trim())

        if(tipo === '⁠Internacional ISU'){
            setIsCategory(false)
        }else{ setIsCategory(true)}
        if(tipo === 'Nacional'){
            setFormData({...formData,categoria:originalLevel.categoria,nivel_actual:originalLevel.nivel_actual})
        }

        setDataToSend({...dataToSend,[name]:id})

    }
    const handleCheckboxChange = (event) => {
        setIsConfirmed(event.target.checked);
    };
    const getFilteredLevels = ()=>{
        if(!selectedCompetitionType) return []
        const levels = competitionLevels[selectedCompetitionType]
        if (selectedCompetitionType === "⁠Internacional ISU"){
            return levels
        }
        const adultLevels = levels.findIndex(level => level === 'Bronze')
        if(adultLevels === -1) return levels
        return isAdult ? levels.slice(adultLevels) : levels.slice(0, adultLevels)
    }
    const getFilteredCategories = ()=>{
        if (!selectedCompetitionType) return [];
    
        return categoriesByCompetition[selectedCompetitionType] || [];
    };
    



    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
        setNewFoto(file);
        setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const dataForm = new FormData();
        console.log(formData)
        dataForm.append('association',JSON.stringify(formData.asociacion))
        dataForm.append('user',JSON.stringify(formData))
        dataForm.append('status','Preinscrito')
        dataForm.append('firstLevel',firstLevel)
        dataForm.append('fecha_solicitud',new Date().toISOString().split('T')[0])
        dataForm.append('categoria',formData.categoria)
        if(selectedCompetitionType === '⁠Internacional ISU'){
            dataForm.append('categoria','NA')
        }
        dataForm.append('nivel_actual',formData.nivel_actual)
        dataForm.append('event',JSON.stringify(events.find(item => item._id === dataToSend.id_events)))
        if (newFoto) {
        dataForm.append('foto', newFoto);
        dataForm.append('lastFoto',formData.img?.path)
        }
        
        console.log('Datos a enviar:', Object.fromEntries(dataForm));

        Swal.fire({
            position: "center",
            icon: "question",
            title: "ESTAS A PUNTO DE INSCRIBIRTE",
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
                    const { data } = await axios.post(`${server}api/v1/register`,dataForm)
                    if(data.success){
                        setFormData({})
                        setDataToSend({})
                        setIsRegister(false)
                        setIsConfirmed(false)
                        setNewFoto(null)
                        setPreviewFoto(null)
                        setSelectedCompetitionType('')
                        setOriginalLevel(null)
                        setisAdult(false)
                        setIsCategory(false)
                        setFormError({})
                        setFirstLevel(null)
                        Swal.fire('Tu solicitud fue enviada 🎉','Te haremos llegar un correo cuando se acepte tu inscripción, te sugerimos estar pendiente.','success').then(()=>{
                            navigator('/cuenta')
                        })
                    }
                } catch (error) {
                    console.error(error)
                   Swal.fire('Algo paso!',error.response.data.message,'warning').then((result)=>{
                            if(result.isConfirmed){
                                window.location.href = `${urlApp}inscripcion`;
                            }
                        })
                }finally{setLoading(false)}
            }})
        
    };

 
  return (
    <>
        <div className='w-full flex justify-start p-2'>
            <button type="button" onClick={() => navigator('/cuenta')} className='text-sm text-blue-500 hover:underline bg-transparent border-0 cursor-pointer'>
                ← Volver a mi cuenta
            </button>
        </div>
        {checkingEvents && (<CenteredSpinner />)}

        {!checkingEvents && noEvents && (
            <div className='flex flex-col items-center justify-center text-center py-16 px-4'>
                <CalendarX2 className='w-16 h-16 text-amber-500 mb-4' strokeWidth={1.5} />
                <h2 className='text-xl font-bold text-gray-800 mb-2'>¡Aún no hay competencias!</h2>
                <p className='text-gray-500 max-w-sm'>Revisa nuestras fechas más adelante para poder inscribirte a una competencia.</p>
            </div>
        )}

        {!checkingEvents && !noEvents && !isRegister&&(<div>
            <SkaterAccountGate onSkaterSelected={handleSkaterSelected} />
        </div>)}
        {isRegister && (
            <div className="inscripcion-container">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Inscripción a Competencia</h1>
                    <p className="text-center text-gray-500 mb-2">Confirma tus datos y Selecciona la competencia a la que deseas Inscribirte.</p>
                    <p className="text-center text-gray-500 mb-2">Se te enviara un correo de notificación cuando tu solicitud haya sido aprobada.</p>
                    <p className="text-center text-gray-500 mb-2">Si deseas actualizar tu fotografía haz click en tu foto actual y selecciona una nueva.</p>

                    <div className="credential-card">
                    {/* Encabezado de la credencial */}
                    <div className="credential-header">
                        <h2 className="text-xl font-bold">Credencial del Participante</h2>
                    </div>
                    
                    <div className="credential-body">
                        {/* Sección de la Foto */}
                        <div className="credential-photo-section">
                        <div className="photo-container">
                            <img src={previewFoto || `${server}uploads/skaters/user.png`} alt="Foto del patinador" className="participant-photo" />
                            <label htmlFor="file-upload" className="photo-upload-overlay">
                            <Camera className="w-8 h-8 text-white" />
                            <span className="text-xs mt-1">Cambiar foto</span>
                            </label>
                            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="text-xl font-bold text-gray-900">{`${formData.nombre} ${formData.apellido_paterno} ${formData.apellido_materno}`}</h3>
                            <p className="text-sm font-semibold text-blue-700">No. Competidor: {formData.numero_competidor || 'Pendiente de asignar'}</p>
                            <p className="text-sm text-gray-500">{formData.curp}</p>
                            <p className="text-sm text-gray-500">{formData.asociacion.nombre}</p>
                        </div>
                        </div>
                        
                        {/* Sección de Datos */}
                        <div className="credential-info-section">
                            <div className="info-grid">
                                <div>
                                    <label>Correo</label>
                                    <input type="text" value={formData.correo}  />
                                </div>
                                <div>
                                    <label>Telefono de contacto</label>
                                    <input type="text" value={formData.telefono}  />
                                </div>
                            </div>
                            <Row>
                                <Col md={8}>
                                    <FormGroup>
                                        <Label for="id_events" className='text-gray-600 mt-8'>Competencia a la que deseas inscribirte</Label>
                                        <Input type="select" required name="id_events" id="id_events" placeholder="" onChange={handleChangeCompetation} className={`${formError.id_events === 'empty' ? 'border-red-600' : ''} `} >
                                            <option value=''>--Selecciona un competencia--</option>
                                            {events?.map((item,index)=>(
                                            <option value={`${item._id},${item.tipo_competencia}`} key={`${index}-evento`}>{item.nombre}</option>

                                            ))}
                                            
                                        </Input>
                                    </FormGroup>
                                </Col>
                                    
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="nivel_actual" >Nivel actual </Label>
                                        <Input type="select" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''} `}  >
                                            {selectedCompetitionType === 'Nacional' ? 
                                                ( <>
                                                    {isAdult ? 
                                                    (<>
                                                        <option value="">--Selecciona el nivel--</option>
                                                    {getFilteredLevels().map((level)=>(
                                                        <option key={`${level}-levels`} value={level}>
                                                        {level}
                                                        </option>
                                                    ))}
                                                    </>) 
                                                    : (<option value={formData.nivel_actual}>{formData.nivel_actual}</option>)}
                                                    </>
                                                    
                                                )
                                                :(<>
                                                    <option value="">--Selecciona el nivel--</option>
                                                    {getFilteredLevels().map((level)=>(
                                                        <option key={`${level}-levels`} value={level}>
                                                        {level}
                                                        </option>
                                                    ))}
                                                </>
                                                )
                                            }
                                            
                                        </Input>
                                        
                                    </FormGroup>
                                </Col>

                                {isCategory && (<Col md={4}>
                                    <FormGroup>
                                        <Label for="categoria" >Categoria </Label>
                                        <Input type="select" required name="categoria" id="categoria" placeholder="" onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''} `} >
                                        {selectedCompetitionType === 'Nacional' ? 
                                        ( <option value={formData.categoria}>{formData.categoria}</option>)  
                                        :(<>
                                                    <option value="">--Selecciona una categoria--</option>
                                                    {getFilteredCategories().map((category)=>(
                                                        <option key={`${category}-category`} value={category}>
                                                        {category}
                                                        </option>
                                                    ))}
                                                </>
                                                )
                                            }
                                        
                                        </Input>
                                    </FormGroup>
                                </Col>)}
                            </Row>
                            
                        

            <Row className="form-check form-switch ">
            <Input
                type="checkbox"
                className="form-check-input custom-switch hover:cursor-pointer"
                id="pagoSwitch"
                checked={isConfirmed}
                onChange={handleCheckboxChange}
                required
            />
            <Label className="form-check-label hover:cursor-pointer" htmlFor="pagoSwitch">
                Me comprometo a realizar el pago de la competencia en tiempo y forma
            </Label>
            </Row>



                            
                        </div>
                    </div>
                    </div>


                    {isConfirmed && (<div className="flex justify-end mt-8">
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ?'Enviando Información...': 'Confirmar Inscripción'}
                        </button>
                    </div>)}
                </form>
            </div>
        )}
    </>
    
  );
};

export default InscripcionCompetencia;