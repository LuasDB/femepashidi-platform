
const Paso5_Resumen = ({ prevStep, handleSubmit, values ,associations,loading}) => {
  const backStep = e => {
    e.preventDefault();
    prevStep();
  };

  const {
    curp,
    nombre,
    apellido_paterno,
    apellido_materno,
    lugar_nacimiento,
    fecha_nacimiento,
    telefono,
    correo,
    nivel_actual,
    categoria,
    foto,sexo,
    asociacion
   
    
  } = values;


  const fotoURL = foto ? URL.createObjectURL(foto) : 'https://via.placeholder.com/150';
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Paso 6: Resumen y Confirmación</h2>
      <p className="text-center text-gray-600 mb-6">Por favor, verifica que toda tu información sea correcta antes de finalizar el registro.</p>
      
      <div className="bg-white max-w-lg mx-auto rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 text-white p-4 text-center">
          <h3 className="text-xl font-bold">Credencial de Patinador</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-40 mb-4 md:mb-0 md:mr-6 flex-shrink-0">
              <img src={fotoURL} alt="Foto del patinador" className="w-full h-full object-cover rounded-lg border-2 border-gray-300" />
            </div>
            <div className="w-full">
              <h4 className="text-2xl font-bold text-gray-800">{nombre} {apellido_paterno} {apellido_materno}</h4>
              <p className="text-gray-600">CURP: <span className="font-semibold">{curp}</span></p>
              <p className="text-gray-600">Nacimiento: <span className="font-semibold">{fecha_nacimiento} ({lugar_nacimiento})</span></p>
            </div>
          </div>
          <hr className="my-4"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p className="text-gray-600">Asociación: <span className="font-bold text-gray-800">{asociacion?.nombre || 'No encontrada'}</span></p>
            <p className="text-gray-600">Nivel: <span className="font-bold text-gray-800">{nivel_actual}</span></p>
            <p className="text-gray-600">Categoría: <span className="font-bold text-gray-800">{categoria}</span></p>
            <p className="text-gray-600">Sexo: <span className="font-bold text-gray-800">{sexo}</span></p>
            <p className="text-gray-600 sm:col-span-2">Teléfono: <span className="font-bold text-gray-800">{telefono}</span></p>
            <p className="text-gray-600 sm:col-span-2">Correo: <span className="font-bold text-gray-800">{correo.toLowerCase()}</span></p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 flex-col gap-5 ">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-auto"
          onClick={backStep}
        >
          Anterior
        </button>
        <button
          className={`${loading ?'bg-gray-500 hover:bg-gray-700':'bg-green-500 hover:bg-green-700'} text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-auto text-lg`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading?
          (<p>Enviando...</p> )
          :(<p>Confirmar y Registrar</p>)}
          
        </button>
      </div>
    </div>
  );
};

export default Paso5_Resumen;