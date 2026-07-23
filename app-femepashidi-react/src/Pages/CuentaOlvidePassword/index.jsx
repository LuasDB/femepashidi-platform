import { useState } from 'react';
import { Container, Card, Input, FormGroup, Label, Button, CardTitle } from "reactstrap"
import axios from 'axios';
import { server } from '../../db/server';

const CuentaOlvidePassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${server}api/v1/auth/account/forgot-password`, { email });
            if (data.success) {
                setSuccess(data.message || 'Se ha enviado un enlace para restablecer tu contraseña a tu correo.');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo procesar tu solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className='flex items-center justify-center min-h-screen'>
            <Card className='w-80 p-10 flex shadow-lg'>
                <CardTitle className="mt-auto self-center p-4 rounded">
                    <h2>Recuperar contraseña</h2>
                </CardTitle>
                {!success && (
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <FormGroup>
                            <Label>Ingresa el correo de tu cuenta</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <Button className="mt-auto self-center" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar solicitud'}
                        </Button>
                    </form>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </Card>
        </Container>
    );
};

export default CuentaOlvidePassword;
