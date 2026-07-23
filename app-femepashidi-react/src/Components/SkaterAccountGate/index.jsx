import { useContext, useEffect, useState } from 'react'
import { Card, Container, CardTitle } from 'reactstrap'
import axios from 'axios'
import { server } from '../../db/server'
import { AccountAuthContext } from '../../Context/AccountAuthContext'
import CenteredSpinner from '../CenteredSpinner'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('skaterToken')}`
})

// Reemplaza el viejo "escribe tu CURP" de Inscripción/RegistroInscripción/CartasPermiso:
// exige sesión de cuenta de patinador y solo deja continuar con el patinador
// realmente vinculado a esa cuenta (via /skaters/me/:curp), en vez de aceptar
// cualquier CURP que alguien escriba. Relación 1:1: cada cuenta tiene a lo
// más un patinador, así que no hace falta selector.
export default function SkaterAccountGate({ onSkaterSelected }) {
    const { account, loading: authLoading } = useContext(AccountAuthContext)
    const [loadingSkater, setLoadingSkater] = useState(true)
    const [hasSkater, setHasSkater] = useState(true)

    useEffect(() => {
        if (!account) {
            setLoadingSkater(false)
            return
        }

        const fetchMe = async () => {
            try {
                const { data } = await axios.get(`${server}api/v1/auth/account/me`, { headers: authHeader() })
                if (data.success && data.data.skater) {
                    onSkaterSelected(data.data.skater)
                } else {
                    setHasSkater(false)
                }
            } catch (error) {
                console.log(error)
                setHasSkater(false)
            } finally {
                setLoadingSkater(false)
            }
        }
        fetchMe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    if (authLoading || loadingSkater) return <CenteredSpinner />

    if (!account) {
        return (
            <Container className='flex items-center justify-center min-h-screen bg-[#ecf0f1] w-full p-4'>
                <Card className='w-full md:w-[50%] p-6 md:p-10 flex flex-col shadow-lg text-center'>
                    <CardTitle className="text-blue-900 mb-4">
                        <h1 className='text-blue-600 font-bold text-lg md:text-xl mb-2'>Inicia sesión para continuar</h1>
                    </CardTitle>
                    <p className='text-gray-500 mb-4'>Necesitas iniciar sesión con tu cuenta de patinador para continuar.</p>
                    <a href="/cuenta/login" className='bg-[#3498db] text-white py-2 px-4 rounded-lg inline-block'>Iniciar sesión</a>
                </Card>
            </Container>
        )
    }

    if (!hasSkater) {
        return (
            <Container className='flex items-center justify-center min-h-screen bg-[#ecf0f1] w-full p-4'>
                <Card className='w-full md:w-[50%] p-6 md:p-10 flex flex-col shadow-lg text-center'>
                    <p className='text-gray-500'>No encontramos un patinador vinculado a tu cuenta. Contacta a tu asociación.</p>
                </Card>
            </Container>
        )
    }

    return null
}
