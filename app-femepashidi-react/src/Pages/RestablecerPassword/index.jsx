import { useState} from 'react';
import { useParams,useNavigate,useSearchParams } from 'react-router-dom';
import { Row, Col, Container,Card, Input,FormGroup,Label, Button, CardText, CardTitle, CardBody} from "reactstrap"

import axios from 'axios';
import { server } from '../../db/server';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      // Obtén el valor del token
      const token = searchParams.get('token');
  
      try {
        const response = await axios.post(`${server}api/v1/auth/reset-password`, { token, newPassword });
        if (response.data.success) {
          setSuccess('Contraseña restablecida correctamente');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Error al restablecer la contraseña');
      }
    };
  
    return (

      <Container className='flex items-center justify-center min-h-screen'>
            <Card className='w-80 p-10 flex shadow-lg'>
                <CardTitle className="mt-auto self-center  p-4 rounded">
                    <h2>Crear nueva contraseña</h2>
                </CardTitle>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <FormGroup>
                        <Label>Nueva Contraseña</Label>
                        <Input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            />
                    </FormGroup>
                    <FormGroup>
                        <Label>Confirmar nueva contraseña</Label>
                        <Input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            />
                    </FormGroup>
                    <Button className="mt-auto self-center">Enviar nueva contraseña</Button>


                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </Card>
        </Container>
     
    );
  };
  
  export default ResetPassword;