import {useEffect, useState, useContext } from 'react'
import { Card,CardHeader,Button,Label, CardTitle, CardBody, Table, CardText,Row,Col, FormGroup, Input} from "reactstrap";
import { useParams,useNavigate,Link} from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CenteredSpinner from '../../Components/CenteredSpinner';
import DocumentViewer from '../../Components/DocumentViewer';
import axios from 'axios';
import Swal from 'sweetalert2';
import {server} from '../../db/server'
import { formatoFecha} from '../../Functions/funciones'
import { AuthContext } from '../../Context/AuthContext'
const imgUser = `${server}uploads/skaters/user.png`
console.log(imgUser)

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

// Solo admin (no presidente_asociacion) puede resetear la contraseña de la
// cuenta de un patinador directamente, sin pasar por el flujo de correo.
function ResetAccountPassword({ accountId }){
    const [form, setForm] = useState({ newPassword:'', confirmPassword:'' })
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if(!form.newPassword || !form.confirmPassword){
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        if(form.newPassword.length < 8){
            Swal.fire('La nueva contraseña debe tener al menos 8 caracteres','','warning')
            return
        }
        if(form.newPassword !== form.confirmPassword){
            Swal.fire('Las contraseñas no coinciden','','warning')
            return
        }
        try {
            setSaving(true)
            const { data } = await axios.patch(
                `${server}api/v1/auth/account/${accountId}/password`,
                { password: form.newPassword },
                { headers: authHeader() }
            )
            if(data.success){
                Swal.fire('Contraseña actualizada','','success')
                setForm({ newPassword:'', confirmPassword:'' })
            }
        } catch (error) {
            Swal.fire('Algo salió mal', error?.response?.data?.message || error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <FormGroup className='flex flex-col md:flex-row gap-4 md:items-end'>
            <div className='w-full md:w-1/3'>
                <Label>Nueva contraseña</Label>
                <Input type="password" name="newPassword" onChange={handleChange} value={form.newPassword}/>
            </div>
            <div className='w-full md:w-1/3'>
                <Label>Confirmar contraseña</Label>
                <Input type="password" name="confirmPassword" onChange={handleChange} value={form.confirmPassword}/>
            </div>
            <Button disabled={saving} onClick={handleSubmit} className='bg-curious-blue-500 hover:bg-curious-blue-600'>Restablecer contraseña</Button>
        </FormGroup>
    )
}

export default function Servicio(){
    const { curp } = useParams()
    const [loading,setLoading] = useState(true)
    const [isFetched, setIsFetched] = useState(false);
    const [user,setUser] = useState({})
    const [deciding,setDeciding] = useState(false)
    const navigate = useNavigate()
    const { user: loggedUser } = useContext(AuthContext)
    const isAdmin = loggedUser?.role === 'admin'

    const fetchData = async()=>{
        try {
            setLoading(true)
            const {data} = await axios.get(`${server}api/v1/skaters/${curp}`)
            if(data.success){
                console.log(data.data)
                setUser(data.data)

            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (!isFetched) {
            fetchData();
            setIsFetched(true)
        }
    },[isFetched])

    const handleDecision = (approved)=>{
        Swal.fire({
            position: "center",
            icon: "question",
            title: approved ? '¿Aprobar a este patinador?' : '¿Rechazar a este patinador?',
            html: 'Se notificará al patinador por correo.',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, claro',
            cancelButtonText: 'No, espera'
        }).then(async(result)=>{
            if(!result.isConfirmed) return
            try {
                setDeciding(true)
                const { data } = await axios.patch(
                    `${server}api/v1/skaters/${curp}/approve`,
                    { approved },
                    { headers: authHeader() }
                )
                if(data.success){
                    Swal.fire('Listo', data.message, 'success')
                    fetchData()
                }
            } catch (error) {
                Swal.fire('Algo salió mal', error?.response?.data?.message || error.message, 'error')
            } finally {
                setDeciding(false)
            }
        })
    }

    const handleDelete = async()=>{

        Swal.fire({
            position: "center",
            icon: "question",
            title: "¿Deseas eliminar este registro?",
            html:`Esta acción no podra revertirse`,
            showConfirmButton: true,
            showCancelButton:true,
            confirmButtonText:'Si, claro',
            cancelButtonText:'No, espera'
        }).then(async(result)=>{
            if(result.isConfirmed){
                try {
                    const { data } = await axios.delete(`${server}api/v1/skaters/${curp}`)
                    if(data.success){
                        Swal.fire('Elemento eliminado',data.message,'success').then(response=>{
                            if(response.isConfirmed){
                                navigate('/gestion/patinadores')
                            }
                        })
                    }
                } catch (error) {
                    Swal.fire('Algo salio mal', `No se puede eliminar el usuario ${user.curp}. Error:${error.message}`,'error')
                }
            }
                        })
    }
    
    return (
        <>
            {loading && (<CenteredSpinner />)}
            {!loading && (<div>
            <Card className='m-1 rounded-xl shadow mt-0  p-8 overflow-x-auto bg-white' >
            <div className='w-full flex justify-end text-[25px] text-curious-blue-500 cursor-pointer hover:text-curious-blue-600' >
            <Link to={`/gestion/forms/usuarios/${curp}`}>
                <FaEdit />
            </Link>
            <MdDelete className='text-red-500 hover:text-red-700' onClick={handleDelete}/>
            
            </div>
            {/* https://femepashidi.siradiacion.com.mx/images/users/ */}
                <CardTitle className="flex font-bold"> {user.curp} </CardTitle>
                <p className="text-sm text-curious-blue-700 font-semibold mb-2">No. Competidor: {user.numero_competidor || 'Pendiente de asignar'}</p>
                 <div className="w-40 h-40 md:w-48 md:h-48 rounded-full relative overflow-hidden border-4 border-white shadow-md cursor-pointer">
                    <img src={user?.img ? `${server}${user?.img?.path}`: imgUser} alt="Foto del patinador" className="w-full h-full object-cover" />
                </div>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-curious-blue-900'> </CardTitle>
                        
                </CardHeader> 
                <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-curious-blue-900'>Datos del patindor </CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Nombre</span> 
                            <h2 className='font-medium text-gray-600'>{user.nombre} {user.apellido_paterno} {user.apellido_materno}</h2>
                        </div>
                        <div className='w-1/2'>
                            <span className='text-curious-blue-700'>Fecha de nacimiento</span> 
                            <h2 className='font-medium text-gray-600'>{formatoFecha(user.fecha_nacimiento)}</h2>
                        </div>              
                    </FormGroup>    
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>SEXO</span> 
                            <h2 className='font-medium text-gray-600'>{user.sexo} </h2>
                        </div>
                        <div className='w-1/2'>
                            <span className='text-curious-blue-700'>Lugar de nacimiento</span> 
                            <h2 className='font-medium text-gray-600'>{user.lugar_nacimiento}</h2>
                        </div>              
                    </FormGroup>
                                    
                </CardHeader>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-curious-blue-900'>Datos de contacto </CardTitle>
                    
                    
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Correo</span> 
                            <h2 className='font-medium text-gray-600'>{user.correo}</h2>
                        </div>
                        <div className='w-1/2'>
                            <span className='text-curious-blue-700'>Whatsapp</span> 
                            <h2 className='font-medium text-gray-600'>{user.telefono}</h2>
                        </div>
                        
                    </FormGroup>    
                        
                </CardHeader>
                <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-curious-blue-900'>Nivel de competencia </CardTitle>
                    
                    
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Nivel actual</span> 
                            <h2 className='font-medium text-gray-600'>{user.nivel_actual}</h2>
                        </div>
                        <div className='w-1/2'>
                            <span className='text-curious-blue-700'>Categoria</span> 
                            <h2 className='font-medium text-gray-600'>{user.categoria}</h2>
                        </div>
                        
                    </FormGroup>  
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-curious-blue-700'>Asociación</span> 
                            <h2 className='font-medium text-gray-600'>{user.asociacion.nombre}</h2>
                        </div>
                        <div className='w-1/2'>
                            <span className='text-curious-blue-700'></span> 
                            <h2 className='font-medium text-gray-600'></h2>
                        </div>
                        
                    </FormGroup>

                </CardHeader>

                {user.documentos && (user.documentos.actaNacimiento || user.documentos.curpDoc) && (
                    <CardHeader className="flex flex-col justify-between bg-white">
                        <CardTitle className='font-bold text-curious-blue-900'>Documentos</CardTitle>
                        <p className='text-sm text-gray-500 mb-2'>Solo se pueden ver, no descargar.</p>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            {user.documentos.actaNacimiento && (
                                <DocumentViewer curp={user.curp} tipo='actaNacimiento' label='Ver acta de nacimiento' />
                            )}
                            {user.documentos.curpDoc && (
                                <DocumentViewer curp={user.curp} tipo='curpDoc' label='Ver CURP' />
                            )}
                        </div>
                    </CardHeader>
                )}

                <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-curious-blue-900'>Estado del registro</CardTitle>
                    <FormGroup className='flex flex-row items-center gap-4'>
                        <h2 className='font-medium text-gray-600'>{user.verificacion ? 'Aprobado' : 'Pendiente de aprobación'}</h2>
                        {!user.verificacion && (
                            <>
                                <Button color='success' disabled={deciding} onClick={()=>handleDecision(true)}>Aprobar</Button>
                                <Button color='danger' disabled={deciding} onClick={()=>handleDecision(false)}>Rechazar</Button>
                            </>
                        )}
                    </FormGroup>
                </CardHeader>

                {isAdmin && (
                    <CardHeader className="flex flex-col justify-between bg-white">
                        <CardTitle className='font-bold text-curious-blue-900'>Cuenta y contraseña</CardTitle>
                        {user.accountId ? (
                            <ResetAccountPassword accountId={user.accountId} />
                        ) : (
                            <p className='text-sm text-gray-500'>Este patinador aún no tiene una cuenta de acceso.</p>
                        )}
                    </CardHeader>
                )}

            </Card>
            </div>)}
        </>
    )
}