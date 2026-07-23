import { useState } from "react";
import { obtenerCategoria } from "../../Functions/funciones";
import {listadoNiveles } from './../../Utils/lists.js'



const Paso4_DatosPatinador = ({ nextStep, prevStep, handleChange, values ,associations,setFormData}) => {


    const continueStep = e => {
        e.preventDefault();
        nextStep();
    };

    const backStep = e => {
        e.preventDefault();
        prevStep();
    };

   const handleNivelCategoria = (level) => {
  const fechaNacimiento = values.fecha_nacimiento;
  const nuevaCategoria = fechaNacimiento ? obtenerCategoria(fechaNacimiento, level) : '';

      // Si puedes acceder directamente a setFormData
      setFormData(prev => ({
        ...prev,
        nivel_actual: level,
        categoria: nuevaCategoria
      }));
    };



  return (
    <form onSubmit={continueStep}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Paso 4: Datos del Patinador</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_asociacion">
                Asociación
            </label>
           <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="id_asociacion"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  console.log(selectedId)
                  const selected = associations.find(a => a._id === selectedId);
                  console.log(selected)
                 setFormData(prev => ({
                  ...prev,
                  id_asociacion: selectedId,
                  asociacion: selected
                }));
                }}
                required
              >
                <option value="">--Selecciona una opción--</option>
                {associations?.map((item, index) => (
                  <option value={item._id} key={`ASOC-${index}`}>{item.nombre}</option>
                ))}
              </select> 

        
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nivelActual">
                Nivel Actual
            </label>
            <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nivelActual"
                type="text"
                placeholder="Nivel actual"
                onChange={(e)=>{handleNivelCategoria(e.target.value);}
                }
                
                required
            >
            <option value="">--Selecciona una opcion --</option>
              {listadoNiveles?.map((item,index)=>(
                <option value={item} key={`ASOC-${index}`}>{item}</option>
              ))}

            </select>
        </div>
        {/* <div className="mb-4 md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
            Categoría
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="categoria"
            type="text"
            placeholder="Categoría"
            onChange={handleChange('categoria')}
            
            required
            value={category}

          />
        </div> */}
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

export default Paso4_DatosPatinador;