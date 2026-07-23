import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, Label, Input, Button } from 'reactstrap'
import { FaRegFolderOpen } from 'react-icons/fa'
import axios from 'axios'
import CenteredSpinner from '../../Components/CenteredSpinner'
import { server } from '../../db/server'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

// Estatus derivado de las dos etapas de aprobación (verificacionAsociacion,
// luego aprobado) — mismos valores que el filtro `status` de GET /letters en
// el backend (letters.service.js#getAll).
const letterStatus = (letter) => {
    if (letter.aprobado === true) return { label: 'Aprobado', className: 'bg-green-200 border-2 border-green-300 text-green-700' }
    if (letter.aprobado === false) return { label: 'Rechazado', className: 'bg-red-100 border-2 border-red-400 text-red-500' }
    if (letter.verificacionAsociacion === true) return { label: 'Pendiente de aprobación final', className: 'bg-yellow-100 border-2 border-yellow-400 text-yellow-600' }
    if (letter.verificacionAsociacion === false) return { label: 'Rechazado por asociación', className: 'bg-red-100 border-2 border-red-400 text-red-500' }
    return { label: 'Pendiente de asociación', className: 'bg-yellow-100 border-2 border-yellow-400 text-yellow-600' }
}

export default function CartasPermiso() {
    const [letters, setLetters] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`${server}api/v1/letters`, {
                    params: { status },
                    headers: authHeader()
                })
                if (data.success) {
                    setLetters(data.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [status])

    return (
        <div className='flex flex-col basis-4 scroll-y'>
            {loading && (<CenteredSpinner />)}

            {!loading && (
                <div>
                    <CardFooter className='mb-4 flex flex-col sm:flex-row gap-3'>
                        <Input type="select" onChange={(e) => setStatus(e.target.value)} value={status} className='sm:max-w-xs'>
                            <option value=''>Todos</option>
                            <option value='pendiente_asociacion'>Pendiente de asociación</option>
                            <option value='rechazado_asociacion'>Rechazado por asociación</option>
                            <option value='pendiente_aprobacion'>Pendiente de aprobación final</option>
                            <option value='aprobado'>Aprobado</option>
                            <option value='rechazado'>Rechazado</option>
                        </Input>
                    </CardFooter>

                    <Card className="m-2 rounded-xl shadow mt-0 mb-2">
                        <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
                            <Label className="text-curious-blue-950 font-bold text-center md:text-right">Cartas de Permiso</Label>
                        </CardHeader>
                        <CardBody>
                            {/* Mobile: cards */}
                            <div className="md:hidden">
                                {letters.map((letter) => {
                                    const { label, className } = letterStatus(letter)
                                    return (
                                        <Card key={letter._id} className="p-4 mb-3 shadow-sm border border-stone-200">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <p className="font-bold text-curious-blue-900">{letter.user?.nombre} {letter.user?.apellido_paterno}</p>
                                                    <p className="text-xs text-gray-500">{letter.folio}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${className}`}>{label}</span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-700">
                                                <p><span className="text-gray-500">Competencia:</span> {letter.nombreCompetencia}</p>
                                                <p><span className="text-gray-500">Asociación:</span> {letter.user?.asociacion?.nombre}</p>
                                            </div>
                                            <Button className="mt-3 w-full bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`/gestion/view/cartas-permiso/${letter._id}`}>
                                                <FaRegFolderOpen className="inline mr-1" /> Ver
                                            </Button>
                                        </Card>
                                    )
                                })}
                                {letters.length === 0 && (<p className="text-center text-gray-500 py-4">Sin cartas de permiso</p>)}
                            </div>

                            {/* Desktop: tabla */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr>
                                            {['FOLIO', 'PATINADOR', 'ASOCIACIÓN', 'COMPETENCIA', 'ESTATUS', 'VER'].map((h) => (
                                                <th key={h} className="px-1 py-2">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {letters.map((letter) => {
                                            const { label, className } = letterStatus(letter)
                                            return (
                                                <tr key={letter._id} className="border-b-2 border-stone-200">
                                                    <td className="px-1 py-2 text-[12px]">{letter.folio}</td>
                                                    <td className="px-1 py-2 text-[12px]">{letter.user?.nombre} {letter.user?.apellido_paterno}</td>
                                                    <td className="px-1 py-2 text-[12px]">{letter.user?.asociacion?.nombre}</td>
                                                    <td className="px-1 py-2 text-[12px]">{letter.nombreCompetencia}</td>
                                                    <td className="px-1 py-2 text-[12px]"><p className={className}>{label}</p></td>
                                                    <td className="px-4 py-2">
                                                        <Button className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white" size="sm" tag={Link} to={`/gestion/view/cartas-permiso/${letter._id}`}>
                                                            <FaRegFolderOpen />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {letters.length === 0 && (<p className="text-center text-gray-500 py-4">Sin cartas de permiso</p>)}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    )
}
