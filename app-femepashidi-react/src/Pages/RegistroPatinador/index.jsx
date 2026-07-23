import React, { useEffect, useState } from 'react';
import Paso1_DatosPersonales from './Paso1_DatosPersonales';
import './styles.css';
import Paso2_InformacionAdicional from './Paso2_InformacionAdicional';
import Paso3_FotoContacto from './Paso3_FotoContacto';
import Paso4_DatosPatinador from './Paso4_DatosPatinador';
import Paso4b_Documentos from './Paso4b_Documentos';
import Swal from 'sweetalert2';
import axios from 'axios';
import { server } from '../../db/server';
import Paso5_Resumen from './Paso5_Resumen';

const estados = {
    'AS': 'Aguascalientes',
    'BC': 'Baja California',
    'BS': 'Baja California Sur',
    'CC': 'Campeche',
    'CL': 'Coahuila',
    'CM': 'Colima',
    'CS': 'Chiapas',
    'CH': 'Chihuahua',
    'DF': 'Ciudad de México',
    'DG': 'Durango',
    'GT': 'Guanajuato',
    'GR': 'Guerrero',
    'HG': 'Hidalgo',
    'JC': 'Jalisco',
    'MC': 'Estado de México',
    'MN': 'Michoacán',
    'MS': 'Morelos',
    'NT': 'Nayarit',
    'NL': 'Nuevo León',
    'OC': 'Oaxaca',
    'PL': 'Puebla',
    'QT': 'Querétaro',
    'QR': 'Quintana Roo',
    'SP': 'San Luis Potosí',
    'SL': 'Sinaloa',
    'SR': 'Sonora',
    'TC': 'Tabasco',
    'TS': 'Tamaulipas',
    'TL': 'Tlaxcala',
    'VZ': 'Veracruz',
    'YN': 'Yucatán',
    'ZS': 'Zacatecas',
    'NE': 'Extranjero'
};

const obtenerDatosDesdeCurp=(curp)=>{
    if(!curp){
        return
    }
        const fechaNcimiento = curp.substring(4,10)
        const sexo =  curp.substring(10,11)
        const entidad = curp.substring(11,13).toUpperCase()

    console.log('Este es ',{
        fechaNcimiento,
            entidad,
            sexo
                })


        const year = parseInt(fechaNcimiento.substring(0,2),10)
        const month = fechaNcimiento.substring(2,4)
        const day = fechaNcimiento.substring(4,6)

        const siglo = year > 30 ? 1900 :2000

        const fechaFormateada = `${siglo + year}-${month}-${day}`

        return {
            fechaNcimiento:fechaFormateada,
            sexo:sexo === 'H' ? 'MASCULINO':'FEMENINO',
            entidadNacimiento: estados[entidad] || 'Entidad desconocida',
            claveEntidad: entidad
        }


}


const RegistroPatinador = () => {
    const [step, setStep] = useState(1);
    const [associations,setAssociations]= useState(null)
    const [loading,setLoading] = useState(false)
    const [formData, setFormData] = useState({
        curp: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        lugar_nacimiento: '',
        fecha_nacimiento: '',
        sexo: '',
        id_asociacion: '',
        asociacion:'',
        telefono: '',
        correo: '',
        nivel_actual: '',
        categoria: '',
        foto: null,
        password: '',
        confirmPassword: '',
        actaNacimiento: null,
        curpDoc: null,
        createAt:new Date().toISOString()
    });

    useEffect(()=>{
        //A futuro colocar la descarga de los niveles 

        const getAssociations = async()=>{
            try {
                const {data } = await axios.get(`${server}api/v1/associations`)
                setAssociations(data.data)

            } catch (error) {
                Swal.fire('Algo Salio Mal',`No fueposible comunicarse con el servidor,por favor, intenta más tarde: [${error}]`, error)
            }
        }

        getAssociations()
    },[])

    const nextStep = () => {
    if (step === 1) {
        const formatData = obtenerDatosDesdeCurp(formData.curp);
        if (formatData) {
            setFormData({
                ...formData,
                fecha_nacimiento: formatData.fechaNcimiento,
                lugar_nacimiento: formatData.entidadNacimiento,
                sexo: formatData.sexo
            });
        }
    }
    setStep(prev => prev + 1);
    };


    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = input => e => {
        setFormData({ ...formData, [input]: e.target.value.toUpperCase() });


    };

    // Para campos que no deben forzarse a mayúsculas (contraseñas: alterar lo
    // que el usuario tecleó sería confuso y un mal hábito de seguridad).
    const handlePlainChange = input => e => {
        setFormData({ ...formData, [input]: e.target.value });
    };

  const handleFileChange = e => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleNamedFileChange = field => e => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const handleSubmit = async()=>{
    console.log('Datos a enviar', formData)
     try {
        setLoading(true)

        const validate = await axios.get(`${server}api/v1/skaters/by-curp/${formData.curp}`)
        console.log(validate.data)
        if(validate.data.success){
            
            Swal.fire('Error','Este usuario ya se encuentra registrado', 'error')
            return
        }
    const form = new FormData();
    const fileFields = ['foto', 'actaNacimiento', 'curpDoc'];
    // `asociacion` ya no se manda: el backend la resuelve a partir de
    // `id_asociacion` para no confiar en el objeto que trae el cliente.
    const skipFields = ['asociacion'];

        Object.entries(formData).forEach(([key, value]) => {
        if (!fileFields.includes(key) && !skipFields.includes(key)) {
            form.append(key, value);
        }
        });

    fileFields.forEach(field => {
        if (formData[field]) {
            form.append(field, formData[field]);
        }
    });


    // Hacer la petición POST
    const {data} = await axios.post(`${server}api/v1/skaters/register`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Si fue exitoso
    console.log('Registro exitoso:', data);
    Swal.fire('Registro creado',` Tu información se guardo correctamente, te enviamos un correo para confirmar tu registro`,'success').then(res=>{
        if(res.isConfirmed){

            window.location.replace("https://femepashidi.com.mx");
        }else{
             window.location.replace("https://femepashidi.com.mx");
        }
    })
   

  } catch (error) {
    console.error('Error al registrar patinador:', error);
    alert('Ocurrió un error al enviar el formulario.');
  }finally{
        setLoading(false)

  }


  }

  const renderStep = () => {
    switch (step) {
        case 1:
            return (
            <Paso1_DatosPersonales
                nextStep={nextStep}
                handleChange={handleChange}
                values={formData}

            />
            );
        case 2 : return (
            <Paso2_InformacionAdicional 
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={formData}
            />
            )
        case 3 : return (
            <Paso3_FotoContacto
                nextStep={nextStep}
                prevStep={prevStep}
                handleFileChange={handleFileChange}
                handleChange={handleChange}
                handlePlainChange={handlePlainChange}
                values={formData}
            />
        )
        case 4 : return (
            <Paso4_DatosPatinador
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={formData}
                associations={associations}
                setFormData={setFormData}
            />
        )
        case 5 : return (
            <Paso4b_Documentos
                nextStep={nextStep}
                prevStep={prevStep}
                handleNamedFileChange={handleNamedFileChange}
                values={formData}
            />
        )
        case 6 : return (
            <Paso5_Resumen
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={formData}
                associations={associations}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        )

        default:
            return (
                <Paso1_DatosPersonales
                    nextStep={nextStep}
                    handleChange={handleChange}
                    values={formData}
                />
            );
    }
  };
  
  const steps = ['Datos', 'Info.', 'Cuenta', 'Patinador', 'Docs.', 'Resumen'];
  const fullSteps = ['Datos Personales', 'Info. Adicional', 'Foto y Cuenta', 'Datos del Patinador', 'Documentos', 'Resumen'];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-4xl">
            {/* Progress bar for larger screens */}
            <div className="mb-8 hidden md:block">
                <div className="flex items-center justify-center">
                    {fullSteps.map((stepName, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                                        index + 1 <= step ? 'bg-blue-600' : 'bg-gray-400'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <p className={`mt-2 text-xs transition-colors duration-300 ${index + 1 === step ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>{stepName}</p>
                            </div>
                            {index < fullSteps.length - 1 && (
                                <div className={`flex-auto border-t-2 transition-all duration-500 ease-in-out mx-2 md:mx-4 ${
                                    index < step - 1 ? 'border-blue-600' : 'border-gray-300'
                                }`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Progress bar for mobile screens */}
            <div className="mb-8 md:hidden">
                <div className="flex items-center justify-center">
                    {steps.map((stepName, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-colors duration-300 ${
                                        index + 1 <= step ? 'bg-blue-600' : 'bg-gray-400'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <p className={`mt-1 text-xs transition-colors duration-300 ${index + 1 === step ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>{stepName}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto border-t-2 transition-all duration-500 ease-in-out mx-1 ${
                                    index < step - 1 ? 'border-blue-600' : 'border-gray-300'
                                }`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            {renderStep()}
            </div>
        </div>
    </div>
  );
};

export default RegistroPatinador;