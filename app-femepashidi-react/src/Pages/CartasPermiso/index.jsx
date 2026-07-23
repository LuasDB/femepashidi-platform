import { useState } from "react";
import FormularioCartasPermiso from "../../Components/FormularioCartasPermiso";
import SkaterAccountGate from "../../Components/SkaterAccountGate";

export default function RegistroCURP() {
  const [data, setData] = useState(null);

  const handleSkaterSelected = (skaterData) => {
    setData(skaterData);
  };

  return (
    <div className="flex items-center justify-center p-4">
      {!data && (
        <SkaterAccountGate onSkaterSelected={handleSkaterSelected} />
      )}

      {data && (
        <div className="bg-white rounded-2xl shadow-2xl w-full p-6 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            ✅ ¡Registro encontrado!
          </h1>
          <p className="text-gray-600 mb-4">
            Completa la siguiente información para continuar con tu solicitud.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">
              <FormularioCartasPermiso data={data} onClose={() => {
                setData(null);
              }
              } />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
