import { useEffect, useState } from 'react'
import axios from 'axios'
import CenteredSpinner from '../../Components/CenteredSpinner'
import { server } from '../../db/server'
import { formatoFecha } from '../../Functions/funciones'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('skaterToken')}`
})

// Mismos colores que Components/Tabla usa para el resto del panel, para que
// el estatus se lea igual en la cuenta del patinador que en el admin.
const statusStyles = (status) => {
    if (status === 'aprobado' || status === 'Aprobado') {
        return 'bg-green-200 border-2 border-green-300 text-green-700'
    }
    if (status === 'rechazado') {
        return 'bg-red-100 border-2 border-red-400 text-red-500'
    }
    return 'bg-yellow-100 border-2 border-yellow-400 text-yellow-500'
}

const statusLabel = (status) => {
    if (status === 'aprobado' || status === 'Aprobado') return 'Aprobado'
    if (status === 'rechazado') return 'Rechazado'
    return 'En espera de aprobación'
}

export default function CuentaCompetencias() {
    const [loading, setLoading] = useState(true)
    const [registrations, setRegistrations] = useState([])

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await axios.get(`${server}api/v1/register/mine`, { headers: authHeader() })
                if (data.success) {
                    setRegistrations(data.data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchRegistrations()
    }, [])

    if (loading) return <CenteredSpinner />

    return (
        <div className='max-w-5xl mx-auto'>
            <div className='rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white'>
                <div className='bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4'>
                    <h2 className='text-xl font-bold'>Mis competencias</h2>
                </div>

                <div className='p-4 sm:p-6'>
                    {registrations.length === 0 && (
                        <p className='text-sm text-gray-500'>Aún no te has inscrito a ninguna competencia.</p>
                    )}

                    {registrations.length > 0 && (
                        <>
                            {/* Tarjetas para mobile */}
                            <div className='flex flex-col gap-3 md:hidden'>
                                {registrations.map((item) => (
                                    <div key={item._id} className='border border-gray-200 rounded-lg p-4 shadow-sm'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <h3 className='font-bold text-gray-900'>{item.event?.nombre}</h3>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-2 whitespace-nowrap ${statusStyles(item.status)}`}>
                                                {statusLabel(item.status)}
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-500 mt-1'>
                                            {formatoFecha(item.event?.fecha_inicio)} - {formatoFecha(item.event?.fecha_fin)}
                                        </p>
                                        <p className='text-sm text-gray-700 mt-2'>Nivel: <span className='font-medium'>{item.nivel_actual}</span></p>
                                        <p className='text-sm text-gray-700'>Categoría: <span className='font-medium'>{item.categoria}</span></p>
                                    </div>
                                ))}
                            </div>

                            {/* Tabla para desktop */}
                            <div className='hidden md:block overflow-x-auto'>
                                <table className='w-full text-left text-sm'>
                                    <thead>
                                        <tr className='border-b border-gray-200 text-gray-500'>
                                            <th className='py-2 pr-4'>Competencia</th>
                                            <th className='py-2 pr-4'>Fechas</th>
                                            <th className='py-2 pr-4'>Nivel</th>
                                            <th className='py-2 pr-4'>Categoría</th>
                                            <th className='py-2 pr-4'>Estatus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.map((item) => (
                                            <tr key={item._id} className='border-b border-gray-100'>
                                                <td className='py-2 pr-4 font-medium text-gray-900'>{item.event?.nombre}</td>
                                                <td className='py-2 pr-4 text-gray-500'>{formatoFecha(item.event?.fecha_inicio)} - {formatoFecha(item.event?.fecha_fin)}</td>
                                                <td className='py-2 pr-4 text-gray-700'>{item.nivel_actual}</td>
                                                <td className='py-2 pr-4 text-gray-700'>{item.categoria}</td>
                                                <td className='py-2 pr-4'>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-2 whitespace-nowrap ${statusStyles(item.status)}`}>
                                                        {statusLabel(item.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
