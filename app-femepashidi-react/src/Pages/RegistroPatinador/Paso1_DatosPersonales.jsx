

const Paso1_DatosPersonales = ({ nextStep, handleChange, values }) => {
    const continueStep = e => {
        e.preventDefault();
        // Aquí puedes agregar validaciones antes de continuar
        nextStep();
    };

    return (
        <form onSubmit={continueStep}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Paso 1: Datos Personales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="curp">
                CURP
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="curp"
            type="text"
            placeholder="CURP"
            onChange={handleChange('curp')}
            defaultValue={values.curp.toUpperCase()}
            value={values.curp}
            required
            maxLength="18"
            pattern="^[A-Z][AEIOU][A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM](AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z-LT]{3}[A-Z0-9][0-9]$"
            title="Ingresa un CURP válido."
            />


            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                Nombre(s)
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Nombre(s)"
                onChange={handleChange('nombre')}
                defaultValue={values.nombre}
                value={values.nombre}
                required
            />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido_paterno">
                Apellido Paterno
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apellido_paterno"
                type="text"
                placeholder="Apellido Paterno"
                onChange={handleChange('apellido_paterno')}
                defaultValue={values.apellido_paterno}
                value={values.apellido_paterno}
                required
            />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido_materno">
                Apellido Materno
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apellido_materno"
                type="text"
                placeholder="Apellido Materno"
                onChange={handleChange('apellido_materno')}
                defaultValue={values.apellido_materno}
                value={values.apellido_materno}
                required
            />
            </div>
        </div>
        <div className="flex items-center justify-end mt-6">
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto"
            type="submit"
            >
            Siguiente
            </button>
        </div>
        </form>
    );
};

export default Paso1_DatosPersonales;