import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Input, FormGroup, Label, Button, CardTitle } from "reactstrap"

import axios from 'axios';
import { server } from '../../db/server';

const ActivarCuenta = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('El enlace no es válido, falta el token de activación');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${server}api/v1/auth/account/set-password`, { token, password });
            if (response.data.success) {
                setSuccess(response.data.message || 'Contraseña actualizada, ya puedes iniciar sesión');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo activar la cuenta, el enlace pudo haber expirado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className='flex items-center justify-center min-h-screen'>
            <Card className='w-80 p-10 flex shadow-lg'>
                <CardTitle className="mt-auto self-center p-4 rounded">
                    <h2>Activa tu cuenta</h2>
                </CardTitle>
                {!success && (
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <FormGroup>
                            <Label>Nueva contraseña</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Confirmar contraseña</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <Button className="mt-auto self-center" disabled={loading}>
                            {loading ? 'Activando...' : 'Activar mi cuenta'}
                        </Button>
                    </form>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </Card>
        </Container>
    );
};

export default ActivarCuenta;
