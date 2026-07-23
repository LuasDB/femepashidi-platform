import { useState,useEffect } from 'react';
import {
  Card, CardBody, Form, FormGroup, Label, Input, Button, Table, CardFooter
} from 'reactstrap';
import { FaRegTrashAlt } from "react-icons/fa";
import { formatoNumeroMX } from '../../Functions/funciones';


const Cotizador = ({elements}) => {
  const {items,agregarConcepto,handleDelete} = elements
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [total,setTotal]= useState(0)

  const handleAgregarConcepto = () => {
    if (concepto && monto) {
      agregarConcepto(concepto, monto);
      setConcepto('');
      setMonto('');
      const precio = parseFloat(monto)
      setTotal(prevTotal => parseFloat(prevTotal) + parseFloat(precio.toFixed(2)))
    }
  };

  const handleDeleteConcepto = (index,montoDelete)=>{
    const precioDelete = parseFloat(montoDelete)
    setTotal(prevTotal => parseFloat(prevTotal) - parseFloat(precioDelete.toFixed(2)))
    handleDelete(index)
  }

  return (
    <>
    <div className='content'>
    <Card>
        <CardBody>  
          <h3 className="my-4 text-curious-blue-900 font-bold"> Cotizador </h3>
          <Form className='flex flex-row gap-4'>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="concepto" className="mr-sm-2 text-curious-blue-600">Concepto</Label>
              <Input
                type="text"
                name="concepto"
                autocomplete="off"
                id="concepto"
                placeholder="Ingrese concepto"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="monto" className="mr-sm-2 text-curious-blue-600">Monto</Label>
              <Input
                type="number"
                name="monto"
                autocomplete="off"
                id="monto"
                placeholder="Ingrese monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </FormGroup>
            <Button className='bg-curious-blue-500 hover:bg-curious-blue-600 mt-4' onClick={handleAgregarConcepto}>Agregar</Button>
          </Form>
          <Table striped className="my-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
            
              {items.map((item, index) =>{
                
                return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.concepto}</td>
                  <td>${item.monto.toFixed(2)}</td>
                  <td>
                    <Button className="btn-icon" color="danger" size="sm" onClick={()=>handleDeleteConcepto(index,item.monto.toFixed(2))} >
                       <FaRegTrashAlt />
                    </Button></td>
                </tr>
                )}
                )
              }
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Label className='text-curious-blue-900 font-bold text-lg'>Total: ${formatoNumeroMX(total)}</Label>
        </CardFooter>

    </Card>

    </div>
    

    </>
   
   
  );
};

export default Cotizador;
