import { useState} from 'react';
import { useParams,useNavigate,useSearchParams } from 'react-router-dom';
import { Row, Col, Container,Card, Input,FormGroup,Label, Button, CardText, CardTitle, CardBody} from "reactstrap"

import axios from 'axios';
import Swal from 'sweetalert2';
import { server } from '../../db/server';

const SolicitudPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) {
        setError('Por favor proporciona un correo');
        return;
      }
      
  
      try {
        const response = await axios.post(`${server}api/v1/auth/sol-password`,{email:email});
        console.log('RESPUESTA',response.data)
        if (response.data.success) {
          setSuccess(`${response.data.message}`);
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
                    <h2>Para solicitar el restableciemiento de tu contraseña</h2>
                </CardTitle>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <FormGroup>
                        <Label>Ingresa el correo con el que estas registrado</Label>
                        <Input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                    </FormGroup>
                  
                    <Button className="mt-auto self-center">Enviar solicitud</Button>


                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </Card>
        </Container>
     
    );
  };
  
  export default SolicitudPassword;