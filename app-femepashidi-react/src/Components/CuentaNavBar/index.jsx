import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { FaUser } from 'react-icons/fa'
import { AccountAuthContext } from './../../Context/AccountAuthContext'
import Notifications from './../Notifications'

export default function CuentaNavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { account, logout } = useContext(AccountAuthContext)
    const navigate = useNavigate()

    const toggleDropdown = () => setDropdownOpen((prev) => !prev)

    const handleLogOut = () => {
        logout()
        navigate('/cuenta/login')
    }

    return (
        <div className=''>
            <Navbar color="light" light expand="md" className='rounded-xl shadow mt-4 mb-2'>
                <NavbarBrand className='flex flex-row text-sm md:text-lg items-center space-x-4'>
                    <img src='https://www.femepashidi.com.mx/inicio/img/images/logo_fede.png' alt='LOGO FEMEPASHIDI' className='w-16' />
                    <h1 className='text-dark'>Mi cuenta FEMEPASHIDI</h1>
                </NavbarBrand>
                <Nav className="ml-auto items-center" navbar>
                    <NavItem>
                        <Notifications tokenKey="skaterToken" />
                    </NavItem>

                    <NavItem>
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle tag="a" className="nav-link">
                                <FaUser className='flex cursor-pointer' />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='hover:bg-slate-400 break-all'>{account?.email}</DropdownItem>
                                <DropdownItem onClick={handleLogOut} className='hover:bg-slate-400'>Cerrar sesión</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}
