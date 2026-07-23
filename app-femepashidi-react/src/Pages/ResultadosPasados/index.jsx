import axios from 'axios'
import { useEffect, useState } from 'react'
import { Row, Col, Card, CardBody, CardFooter, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { server } from '../../db/server'
import './styles.css'

export default function Resultados(){

    const [data,setData] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const { data } =await axios.get(`${server}api/v1/results`)
                if(data.success){
                    setData(data.data)
                }
            } catch (error) {
               console.log(error)
            }
        }
        fetchData()
    },[])

    return (
        <div className="min-h-screen bg-gradient-to-br from-lastresult-50 to-lastresult-300 ">
             <Row className='pt-5' >
                    <Col md={4} className='flex justify-center'>
                    <Link>
                    <img src="https://www.femepashidi.com.mx/inicio/img/images/comite.png" alt="Logo 1" style={{ width: '80px' }} onClick={()=>window.open('http://femepashidi.com.mx/inicio')}/>
                    
                    </Link></Col>
                    <Col md={4} className='flex justify-center'>
                    <Link>
                    <img src="https://www.femepashidi.com.mx/inicio//img/images/logo_fede.png" alt="Logo 1" style={{ width: '100px' }} onClick={()=>window.open('http://femepashidi.com.mx/inicio')}/>
                    </Link>
                    </Col>
                    <Col md={4} className='flex justify-center'>
                    <Link>
                    <img src="https://www.femepashidi.com.mx/inicio/img/images/isu.png" alt="Logo 1" style={{ width: '80px' }} onClick={()=>window.open('http://femepashidi.com.mx/inicio')}/>
                    </Link>
                    </Col>
            </Row>
            <div className="flex items-center justify-center tittle-results">
                <h1 className='text-blue-600 font-bold'>RESULTADOS</h1>
            </div>
            
            <div className={`flex flex-wrap gap-4 p-10 justify-center`}>

                {data?.map((item,index)=>{
                if(item.condicion != 'vigente'){
                    return (
                    <Card className={`hover:scale-105 transform transition-transform duration-300 hover:cursor-pointer 
                                    ${data?.length === 1 ? 'w-full lg:w-1/6' : 'w-full sm:w-1/2 lg:w-1/4'} shadow-md bg-results-200 max-w-40`}
                    key={index}
                    onClick={()=>window.open(`https://femepashidi.com.mx/${item.carpeta}`)}>
                    <CardBody>
                        <img src={`${server}${item.img}`} alt="Logo Evento" className='w-full'/>
                    </CardBody>
                    <CardFooter className='flex items-center justify-center'>
                        {item.titulo}
                    </CardFooter>
                    </Card> 
                )
                }
               })}
                     
                </div>

               

        </div>
    )
}