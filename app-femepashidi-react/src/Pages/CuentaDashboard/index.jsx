import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, FormGroup, Label, Input, Button } from "reactstrap"
import { Camera } from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import CenteredSpinner from '../../Components/CenteredSpinner'
import { server } from '../../db/server'
import { formatoFecha } from '../../Functions/funciones'
import { AccountAuthContext } from '../../Context/AccountAuthContext'

const defaultSkaterPhoto = `${server}uploads/skaters/user.png`

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('skaterToken')}`
})

export default function CuentaDashboard() {
    const { logout } = useContext(AccountAuthContext)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [skater, setSkater] = useState(null)
    const [editValues, setEditValues] = useState({ telefono: '', correo: '', lugar_nacimiento: '' })
    const [saving, setSaving] = useState(false)
    const [newFoto, setNewFoto] = useState(null)
    const [previewFoto, setPreviewFoto] = useState(defaultSkaterPhoto)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data } = await axios.get(`${server}api/v1/auth/account/me`, { headers: authHeader() })
                if (data.success) {
                    if (data.data.skater) {
                        setSkater(data.data.skater)
                        setEditValues({
                            telefono: data.data.skater.telefono || '',
                            correo: data.data.skater.correo || '',
                            lugar_nacimiento: data.data.skater.lugar_nacimiento || ''
                        })
                        setPreviewFoto(data.data.skater.img?.path ? `${server}${data.data.skater.img.path}` : defaultSkaterPhoto)
                    }
                }
            } catch (error) {
                Swal.fire('Tu sesión expiró', 'Vuelve a iniciar sesión', 'warning').then(() => {
                    logout()
                    navigate('/cuenta/login')
                })
            } finally {
                setLoading(false)
            }
        }
        fetchMe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewFoto(file)
            setPreviewFoto(URL.createObjectURL(file))
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const formPayload = new FormData()
            formPayload.append('correo', editValues.correo)
            formPayload.append('telefono', editValues.telefono)
            formPayload.append('lugar_nacimiento', editValues.lugar_nacimiento)
            if (newFoto) {
                formPayload.append('foto', newFoto)
            }

            const { data } = await axios.patch(
                `${server}api/v1/skaters/me/${skater.curp}`,
                formPayload,
                { headers: authHeader() }
            )
            if (data.success) {
                setSkater(prev => ({ ...prev, ...editValues }))
                setNewFoto(null)
                Swal.fire('Listo', 'Tu información fue actualizada', 'success')
            }
        } catch (error) {
            Swal.fire('Algo salió mal', error.response?.data?.message || 'No se pudo actualizar', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <CenteredSpinner />

    return (
        <div className='max-w-5xl mx-auto'>
            {!skater && (
                <Card className='p-4'>
                    <p className='text-sm text-gray-500'>No encontramos un patinador vinculado a esta cuenta. Contacta a tu asociación.</p>
                </Card>
            )}

            {skater && (
                <div className='rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white'>
                    <div className='bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4'>
                        <h2 className='text-xl font-bold'>Credencial del Participante</h2>
                    </div>
                    <div className='p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='md:col-span-1 flex flex-col items-center justify-center'>
                            <div className='w-40 h-40 md:w-48 md:h-48 rounded-full relative overflow-hidden border-4 border-white shadow-md cursor-pointer'>
                                <img
                                    src={previewFoto}
                                    alt="Foto del patinador"
                                    className='w-full h-full object-cover'
                                />
                                <label htmlFor="dashboard-photo-upload" className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer'>
                                    <Camera className='w-8 h-8 text-white' />
                                    <span className='text-xs mt-1'>Cambiar foto</span>
                                </label>
                                <input id="dashboard-photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                            <div className='text-center mt-4'>
                                <h3 className='text-xl font-bold text-gray-900'>{skater.nombre} {skater.apellido_paterno} {skater.apellido_materno}</h3>
                                <p className='text-sm font-semibold text-blue-700'>No. Competidor: {skater.numero_competidor || 'Pendiente de asignar'}</p>
                                <p className='text-sm text-gray-500'>{skater.curp}</p>
                                <p className='text-sm text-gray-500'>{skater.asociacion?.nombre}</p>
                            </div>
                        </div>

                        <div className='md:col-span-2'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6'>
                                <div>
                                    <Label className='text-gray-500'>Fecha de nacimiento</Label>
                                    <p className='font-medium text-gray-700'>{formatoFecha(skater.fecha_nacimiento)}</p>
                                </div>
                                <div>
                                    <Label className='text-gray-500'>Nivel actual</Label>
                                    <p className='font-medium text-gray-700'>{skater.nivel_actual}</p>
                                </div>
                                <div>
                                    <Label className='text-gray-500'>Categoría</Label>
                                    <p className='font-medium text-gray-700'>{skater.categoria}</p>
                                </div>
                            </div>

                            <h4 className='font-bold text-blue-900 mb-2'>Datos de contacto</h4>
                            <form onSubmit={handleSave} className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
                                <FormGroup>
                                    <Label>Correo</Label>
                                    <Input
                                        type='email'
                                        value={editValues.correo}
                                        onChange={(e) => setEditValues({ ...editValues, correo: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Whatsapp</Label>
                                    <Input
                                        type='text'
                                        value={editValues.telefono}
                                        onChange={(e) => setEditValues({ ...editValues, telefono: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup className='sm:col-span-2'>
                                    <Label>Lugar de nacimiento</Label>
                                    <Input
                                        type='text'
                                        value={editValues.lugar_nacimiento}
                                        onChange={(e) => setEditValues({ ...editValues, lugar_nacimiento: e.target.value })}
                                    />
                                </FormGroup>
                                <div className='sm:col-span-2'>
                                    <Button className='bg-blue-600 w-full sm:w-auto' disabled={saving}>
                                        {saving ? 'Guardando...' : 'Guardar cambios'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
