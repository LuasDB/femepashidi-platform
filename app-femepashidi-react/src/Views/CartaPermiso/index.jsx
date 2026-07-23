import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, Button, FormGroup } from 'reactstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import CenteredSpinner from '../../Components/CenteredSpinner'
import { AuthContext } from '../../Context/AuthContext'
import { server } from '../../db/server'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

export default function CartaPermiso() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const [letter, setLetter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deciding, setDeciding] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${server}api/v1/letters/${id}`, { headers: authHeader() })
            if (data.success) {
                setLetter(data.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleVerification = (approved) => {
        Swal.fire({
            position: 'center',
            icon: 'question',
            title: approved ? '¿Dar visto bueno a esta solicitud?' : '¿Rechazar esta solicitud?',
            html: 'Esto notificará a la federación.',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, claro',
            cancelButtonText: 'No, espera'
        }).then(async (result) => {
            if (!result.isConfirmed) return
            try {
                setDeciding(true)
                const { data } = await axios.patch(
                    `${server}api/v1/letters/${id}/verification`,
                    { approved },
                    { headers: authHeader() }
                )
                if (data.success) {
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

    const handleApproval = (approved) => {
        Swal.fire({
            position: 'center',
            icon: 'question',
            title: approved ? '¿Aprobar esta carta de permiso?' : '¿Rechazar esta carta de permiso?',
            html: 'Se notificará al patinador por correo.',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, claro',
            cancelButtonText: 'No, espera'
        }).then(async (result) => {
            if (!result.isConfirmed) return
            try {
                setDeciding(true)
                const { data } = await axios.patch(
                    `${server}api/v1/letters/${id}/approve`,
                    { approved },
                    { headers: authHeader() }
                )
                if (data.success) {
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

    if (loading) return <CenteredSpinner />
    if (!letter) return null

    const pendingVerification = letter.verificacionAsociacion === undefined
    const pendingApproval = letter.verificacionAsociacion === true && letter.aprobado === undefined
    const canVerify = user?.role === 'admin' || user?.role === 'presidente_asociacion'
    const canApprove = user?.role === 'admin'

    return (
        <Card className='m-1 rounded-xl shadow mt-0 p-8 overflow-x-auto bg-white'>
            <CardTitle className="flex font-bold">{letter.folio}</CardTitle>

            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Patinador</CardTitle>
                <FormGroup className='flex flex-col sm:flex-row gap-10'>
                    <div className='sm:w-1/2'>
                        <span className='text-curious-blue-700'>Nombre</span>
                        <h2 className='font-medium text-gray-600'>{letter.user?.nombre} {letter.user?.apellido_paterno} {letter.user?.apellido_materno}</h2>
                    </div>
                    <div className='sm:w-1/2'>
                        <span className='text-curious-blue-700'>Asociación</span>
                        <h2 className='font-medium text-gray-600'>{letter.user?.asociacion?.nombre}</h2>
                    </div>
                </FormGroup>
            </CardHeader>

            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Competencia</CardTitle>
                <FormGroup className='flex flex-col sm:flex-row gap-10'>
                    <div className='sm:w-1/2'>
                        <span className='text-curious-blue-700'>Nombre</span>
                        <h2 className='font-medium text-gray-600'>{letter.nombreCompetencia}</h2>
                    </div>
                    <div className='sm:w-1/2'>
                        <span className='text-curious-blue-700'>Nivel</span>
                        <h2 className='font-medium text-gray-600'>{letter.nivelCompeticion}</h2>
                    </div>
                </FormGroup>
                <FormGroup className='flex flex-col sm:flex-row gap-10'>
                    <div className='sm:w-1/2'>
                        <span className='text-curious-blue-700'>Domicilio</span>
                        <h2 className='font-medium text-gray-600'>{letter.domicilioCompetencia}</h2>
                    </div>
                    <div className='sm:w-1/2'>
                        <span className='text-curious-blue-700'>Fechas</span>
                        <h2 className='font-medium text-gray-600'>{letter.fechaInicialCompetencia} al {letter.fechaFinalCompetencia}</h2>
                    </div>
                </FormGroup>
                {letter.comentariosCompetencia && (
                    <FormGroup>
                        <span className='text-curious-blue-700'>Comentarios</span>
                        <h2 className='font-medium text-gray-600'>{letter.comentariosCompetencia}</h2>
                    </FormGroup>
                )}
                {letter.convocatoria?.path && (
                    <a href={`${server}${letter.convocatoria.path}`} target="_blank" rel="noreferrer" className='text-curious-blue-600 hover:underline'>
                        Ver convocatoria
                    </a>
                )}
            </CardHeader>

            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Visto bueno de la asociación</CardTitle>
                <FormGroup className='flex flex-row items-center gap-4'>
                    <h2 className='font-medium text-gray-600'>
                        {letter.verificacionAsociacion === true && 'Aprobado por la asociación'}
                        {letter.verificacionAsociacion === false && 'Rechazado por la asociación'}
                        {pendingVerification && 'Pendiente'}
                    </h2>
                    {pendingVerification && canVerify && (
                        <>
                            <Button color='success' disabled={deciding} onClick={() => handleVerification(true)}>Aprobar</Button>
                            <Button color='danger' disabled={deciding} onClick={() => handleVerification(false)}>Rechazar</Button>
                        </>
                    )}
                </FormGroup>
            </CardHeader>

            <CardHeader className="flex flex-col justify-between bg-white">
                <CardTitle className='font-bold text-curious-blue-900'>Aprobación final (federación)</CardTitle>
                <FormGroup className='flex flex-row items-center gap-4'>
                    <h2 className='font-medium text-gray-600'>
                        {letter.aprobado === true && 'Aprobada'}
                        {letter.aprobado === false && 'Rechazada'}
                        {letter.aprobado === undefined && (letter.verificacionAsociacion === true ? 'Pendiente' : 'Esperando visto bueno de la asociación')}
                    </h2>
                    {pendingApproval && canApprove && (
                        <>
                            <Button color='success' disabled={deciding} onClick={() => handleApproval(true)}>Aprobar</Button>
                            <Button color='danger' disabled={deciding} onClick={() => handleApproval(false)}>Rechazar</Button>
                        </>
                    )}
                </FormGroup>
                {letter.carta_pdf && (
                    <a href={`${server}uploads/lettersA/${letter.carta_pdf}`} target="_blank" rel="noreferrer" className='text-curious-blue-600 hover:underline mt-2'>
                        Ver carta permiso (PDF)
                    </a>
                )}
            </CardHeader>
        </Card>
    )
}
