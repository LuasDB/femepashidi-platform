import { useState } from 'react';

const DocumentField = ({ id, label, file, onChange }) => {
  const [fileName, setFileName] = useState(file?.name || '');

  const onFileChange = e => {
    const selected = e.target.files[0];
    if (selected) {
      setFileName(selected.name);
      onChange(e);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type="file"
        accept="image/*,.pdf"
        onChange={onFileChange}
        required={!file}
      />
      {fileName && <p className="text-xs text-gray-500 mt-1">Archivo seleccionado: {fileName}</p>}
    </div>
  );
};

const Paso4b_Documentos = ({ nextStep, prevStep, handleNamedFileChange, values }) => {
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Paso 5: Documentos</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">Tu asociación revisará estos documentos como parte de la aprobación de tu registro.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <DocumentField
          id="actaNacimiento"
          label="Acta de nacimiento"
          file={values.actaNacimiento}
          onChange={handleNamedFileChange('actaNacimiento')}
        />
        <DocumentField
          id="curpDoc"
          label="CURP (documento)"
          file={values.curpDoc}
          onChange={handleNamedFileChange('curpDoc')}
        />
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

export default Paso4b_Documentos;
