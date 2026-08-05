import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { FaUser } from 'react-icons/fa'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AccountAuthContext } from './../../Context/AccountAuthContext'
import { server } from './../../db/server'
import Notifications from './../Notifications'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('skaterToken')}`
})

function ChangePasswordModal({ isOpen, toggle }){
    const [form, setForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleClosed = () => {
        setForm({ currentPassword:'', newPassword:'', confirmPassword:'' })
    }

    const handleSubmit = async () => {
        if(!form.currentPassword || !form.newPassword || !form.confirmPassword){
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
                `${server}api/v1/auth/account/me/password`,
                { currentPassword: form.currentPassword, newPassword: form.newPassword },
                { headers: authHeader() }
            )
            if(data.success){
                Swal.fire('Contraseña actualizada','','success')
                toggle()
            }
        } catch (error) {
            Swal.fire('Algo salió mal', error?.response?.data?.message || error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} onClosed={handleClosed}>
            <ModalHeader toggle={toggle}>Cambiar contraseña</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="current-password">Contraseña actual</Label>
                        <Input type="password" name="currentPassword" id="current-password" onChange={handleChange} value={form.currentPassword}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="new-password">Nueva contraseña</Label>
                        <Input type="password" name="newPassword" id="new-password" onChange={handleChange} value={form.newPassword}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirm-password">Confirmar nueva contraseña</Label>
                        <Input type="password" name="confirmPassword" id="confirm-password" onChange={handleChange} value={form.confirmPassword}/>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button disabled={saving} onClick={handleSubmit} className='bg-curious-blue-500 hover:bg-curious-blue-600'>Guardar</Button>
            </ModalFooter>
        </Modal>
    )
}

export default function CuentaNavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [passwordModalOpen, setPasswordModalOpen] = useState(false)
    const { account, logout } = useContext(AccountAuthContext)
    const navigate = useNavigate()

    const toggleDropdown = () => setDropdownOpen((prev) => !prev)
    const togglePasswordModal = () => setPasswordModalOpen((prev) => !prev)

    const handleLogOut = () => {
        logout()
        navigate('/cuenta/login')
    }

    return (
        <div className=''>
            <Navbar color="light" light expand="md" className='rounded-xl shadow mt-4 mb-2'>
                <NavbarBrand className='flex flex-row text-sm md:text-lg items-center space-x-4'>
                    <img src='/femepashidi.svg' alt='LOGO FEMEPASHIDI' className='w-16' />
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
                                <DropdownItem onClick={togglePasswordModal} className='hover:bg-slate-400'>Cambiar contraseña</DropdownItem>
                                <DropdownItem onClick={handleLogOut} className='hover:bg-slate-400'>Cerrar sesión</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavItem>
                </Nav>
            </Navbar>
            <ChangePasswordModal isOpen={passwordModalOpen} toggle={togglePasswordModal} />
        </div>
    )
}
