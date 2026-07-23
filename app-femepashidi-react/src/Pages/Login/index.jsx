import { useState,useContext} from "react"
import { useNavigate } from "react-router-dom"
import { Row, Col, Container,Card, Input,FormGroup,Label, Button, CardText, CardTitle} from "reactstrap"
import { AuthContext } from './../../Context/AuthContext'

export default function Login(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()



    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(await login(email,password)){
            navigate('/gestion')
        }
        

    }
    return (
        <Container className='flex items-center justify-center min-h-screen bg-[#ecf0f1]'>
            <Card className='w-80 p-10 flex shadow-lg'>
                <CardTitle className="mt-auto self-center text-center p-4 rounded text-blue-900">
                <h1 className='text-blue-600 font-bold'>Gestion Femepashidi</h1>
                <h2>Bienvenido</h2>
                </CardTitle>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <FormGroup>
                        <Label className='text-yellow-600'>Correo</Label>
                        <Input 
                            type="text" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            
                            required
                            />
                    </FormGroup>
                    <FormGroup>
                        <Label className='text-yellow-600'>Contraseña</Label>
                        <Input 
                            type="password" 
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            
                            required
                            />
                    </FormGroup>
                    <Button className="mt-auto self-center bg-[#3498db]">Ingresar</Button>
                    <a href="/inicio/femepashidi/sol-password" className='w-full text-center mb-4 text-sm text-gray-400 pt-6'>Olvide mi contraseña</a>



                </form>
            </Card>
        </Container>

    )
}