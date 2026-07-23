import  { useState } from 'react';
import Swal from 'sweetalert2';

const Paso3_FotoContacto = ({ nextStep, prevStep, handleChange, handlePlainChange, handleFileChange, values }) => {
  const [preview, setPreview] = useState(values.foto ? URL.createObjectURL(values.foto) : null);

  const onFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleFileChange(e);
    }
  };

  const continueStep = e => {
    e.preventDefault();
    if (values.password.length < 8) {
      Swal.fire('Contraseña muy corta', 'Debe tener al menos 8 caracteres', 'warning');
      return;
    }
    if (values.password !== values.confirmPassword) {
      Swal.fire('Las contraseñas no coinciden', '', 'warning');
      return;
    }
    nextStep();
  };
  
  const backStep = e => {
    e.preventDefault();
    prevStep();
  };

  return (
    <form onSubmit={continueStep}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Paso 3: Foto y Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="foto">
                Fotografía (tipo credencial)
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="foto"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                required={!values.foto}
            />
            {preview && (
                <div className="mt-4 flex justify-center">
                    <img src={preview} alt="Vista previa" className="w-32 h-32 object-cover rounded-full shadow-lg"/>
                </div>
            )}
        </div>
        <div className="flex flex-col">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                    Teléfono
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="telefono"
                    type="tel"
                    placeholder="Teléfono de contacto"
                    onChange={handleChange('telefono')}
                    defaultValue={values.telefono}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                    Correo Electrónico
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="correo"
                    type="email"
                    placeholder="Correo electrónico"
                    onChange={handleChange('correo')}
                    defaultValue={values.correo}
                    required
                />
            </div>
        </div>
      </div>
      <hr className="my-4" />
      <p className="text-sm text-gray-500 mb-4">Este correo y contraseña serán tu cuenta para iniciar sesión, inscribirte a competencias y solicitar cartas permiso.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Contraseña
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                onChange={handlePlainChange('password')}
                defaultValue={values.password}
                minLength={8}
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirmar contraseña
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                onChange={handlePlainChange('confirmPassword')}
                defaultValue={values.confirmPassword}
                minLength={8}
                required
            />
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

export default Paso3_FotoContacto;