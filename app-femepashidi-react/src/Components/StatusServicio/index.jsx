import { useEffect, useState } from "react";
import { FaTruck ,FaTruckLoading } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { Button } from "reactstrap";

export default function StatusServicio({estado,handleChangeStatus,buttonActive}){

    const [estilo,setEstilo] = useState([])
    

   

    useEffect(()=>{
        setEstilo(Number(estado))


    },[estado])




    return (

        <>
        <div className='flex flex-row justify-around p-4'>
            <div className='flex flex-col '>
                <div className={`w-16 h-16  rounded-full flex items-center justify-center shadow-lg ${(estilo >= 0) ? 'bg-blue-300 ':''}`}>
                    <FaTruck className={`text-2xl ${(estilo >= 0) ? 'text-blue-500 ':''}`} />
                </div>
                <p className={`${(estilo >= 0) ? 'text-blue-500 ':''}`}>Por Iniciar</p>
            </div>
            <div className='flex flex-col'>
                <div className={`w-16 h-16  rounded-full flex items-center justify-center shadow-lg ${(estilo >= 1) ? 'bg-blue-300 ':'bg-blue-100 '}`}>
                    <FaTruckFast className={`text-2xl ${(estilo >= 1) ? 'text-blue-500 ':'text-blue-300 '}`} />
                </div>
                <p className={`${(estilo >= 1) ? 'text-blue-500 ':'text-blue-300'}`}>En curso</p>

            </div>
            <div className='flex flex-col'>
                <div className={`w-16 h-16  rounded-full flex items-center justify-center shadow-lg ${(estilo >= 2) ? 'bg-blue-300 ':'bg-blue-100 '}`}>
                    <FaTruckLoading className={`text-2xl ${(estilo >= 2) ? 'text-blue-500 ':'text-blue-300 '}`}  />
                </div>
                <p className={`${(estilo >= 2) ? 'text-blue-500 ':'text-blue-300'}`}>Entregado</p>

            </div>
        </div>
        {buttonActive && (
            <div>
            {!(estilo >=2 ) && (<Button className="bg-curious-blue-400 hover:bg-curious-blue-600" onClick={handleChangeStatus}>Cambiar estado</Button>)}

            </div>
        )}

        </>
       
    );
}