import { NavLink } from 'react-router-dom'
import { Card, CardBody, CardHeader } from 'reactstrap'
import { FaIdCard, FaTrophy, FaListAlt, FaFileSignature } from 'react-icons/fa'

const items = [
    { to: '/cuenta', label: 'Mi cuenta', icon: <FaIdCard />, end: true },
    { to: '/cuenta/inscripcion', label: 'Inscripción a competencias', icon: <FaTrophy /> },
    { to: '/cuenta/competencias', label: 'Mis competencias', icon: <FaListAlt /> },
    { to: '/cuenta/cartas-permiso', label: 'Cartas de permiso', icon: <FaFileSignature /> },
]

export default function CuentaSidebar({ toggleSidebar }) {
    return (
        <Card className='h-auto rounded-xl shadow mt-4 mb-4'>
            <CardHeader>Mi cuenta</CardHeader>
            <CardBody>
                <ul className='list-none'>
                    {items.map((item) => (
                        <li key={item.to} className='shadow-sm my-6 p-2 rounded-md'>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                onClick={toggleSidebar}
                                className={({ isActive }) =>
                                    `flex items-center space-x-4 no-underline p-1 rounded-md ${isActive ? 'bg-curious-blue-500 text-white' : 'text-gray-950'}`
                                }
                            >
                                <div>{item.icon}</div>
                                <div>{item.label}</div>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    )
}
