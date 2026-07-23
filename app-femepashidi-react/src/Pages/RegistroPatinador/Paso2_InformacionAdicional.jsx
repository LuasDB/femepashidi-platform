import  { useEffect } from 'react';


const Paso2_InformacionAdicional = ({ nextStep, prevStep, handleChange, values }) => {
    const continueStep = e => {
        e.preventDefault();
        nextStep();
    };

    const backStep = e => {
        e.preventDefault();
        prevStep();
    };

    
   

    return (
        <form onSubmit={continueStep}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Paso 2: Información Adicional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lugar_nacimiento">
                Lugar de Nacimiento
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lugar_nacimiento"
                type="text"
                placeholder="Estado o Ciudad"
                onChange={handleChange('lugar_nacimiento')}
                defaultValue={values.lugar_nacimiento}
                required
            />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_nacimiento">
                Fecha de Nacimiento
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fecha_nacimiento"
                type="date"
                onChange={handleChange('fecha_nacimiento')}
                defaultValue={values.fecha_nacimiento}
                required
            />
            </div>
            <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sexo">
                Sexo
            </label>
            <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sexo"
                onChange={handleChange('sexo')}
                defaultValue={values.sexo}
                required
            >
                <option value="">Selecciona una opción</option>
                <option value="MASCULINO">MASCULINO</option>
                <option value="FEMENINO">FEMENINO</option>
            </select>
            </div>
        </div>
        <div className="flex items-center justify-between mt-6">
            <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-auto"
            onClick={backStep}
            >
            Anterior
            </button>
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-auto"
            type="submit"
            >
            Siguiente
            </button>
        </div>
        </form>
    );
};

export default Paso2_InformacionAdicional;
