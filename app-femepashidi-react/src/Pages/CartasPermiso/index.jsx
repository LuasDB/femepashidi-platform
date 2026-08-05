import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader, Button, Label } from "reactstrap";
import { FaPlus, FaDownload } from "react-icons/fa";
import FormularioCartasPermiso from "../../Components/FormularioCartasPermiso";
import SkaterAccountGate from "../../Components/SkaterAccountGate";
import CenteredSpinner from "../../Components/CenteredSpinner";
import { server } from "../../db/server";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('skaterToken')}`
})

// Mismo criterio que Views/CartasPermiso (panel admin/asociación).
const letterStatus = (letter) => {
  if (letter.aprobado === true) return { label: 'Aprobado', className: 'bg-green-200 border-2 border-green-300 text-green-700' }
  if (letter.aprobado === false) return { label: 'Rechazado', className: 'bg-red-100 border-2 border-red-400 text-red-500' }
  if (letter.verificacionAsociacion === true) return { label: 'Pendiente de aprobación final', className: 'bg-yellow-100 border-2 border-yellow-400 text-yellow-600' }
  if (letter.verificacionAsociacion === false) return { label: 'Rechazado por asociación', className: 'bg-red-100 border-2 border-red-400 text-red-500' }
  return { label: 'Pendiente de asociación', className: 'bg-yellow-100 border-2 border-yellow-400 text-yellow-600' }
}

export default function CartasPermiso() {
  const [skater, setSkater] = useState(null)
  const [letters, setLetters] = useState([])
  const [loadingLetters, setLoadingLetters] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchLetters = async () => {
    try {
      setLoadingLetters(true)
      const { data } = await axios.get(`${server}api/v1/auth/account/me/letters`, { headers: authHeader() })
      if (data.success) {
        setLetters(data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingLetters(false)
    }
  }

  useEffect(() => {
    if (skater) fetchLetters()
  }, [skater])

  return (
    <div className="flex flex-col basis-4">
      {!skater && (<SkaterAccountGate onSkaterSelected={setSkater} />)}

      {skater && showForm && (
        <div>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-sm text-blue-500 hover:underline bg-transparent border-0 cursor-pointer mb-2 px-2"
          >
            ← Volver a mis cartas de permiso
          </button>
          <FormularioCartasPermiso
            data={skater}
            onClose={() => {
              setShowForm(false)
              fetchLetters()
            }}
          />
        </div>
      )}

      {skater && !showForm && (
        <>
          {loadingLetters && (<CenteredSpinner />)}

          {!loadingLetters && (
            <Card className="m-2 rounded-xl shadow mt-0 mb-2">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-3 border-0">
                <Label className="text-curious-blue-950 font-bold text-center sm:text-left m-0">Mis cartas de permiso</Label>
                <Button
                  className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white w-full sm:w-auto"
                  onClick={() => setShowForm(true)}
                >
                  <FaPlus className="inline mr-1" /> Nueva solicitud
                </Button>
              </CardHeader>
              <CardBody>
                {/* Mobile: cards */}
                <div className="md:hidden">
                  {letters.map((letter) => {
                    const { label, className } = letterStatus(letter)
                    const canDownload = letter.aprobado === true && letter.carta_pdf
                    return (
                      <Card key={letter._id} className="p-4 mb-3 shadow-sm border border-stone-200">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-curious-blue-900">{letter.nombreCompetencia}</p>
                            <p className="text-xs text-gray-500">{letter.folio}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${className}`}>{label}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p><span className="text-gray-500">Nivel:</span> {letter.nivelCompeticion}</p>
                          <p><span className="text-gray-500">Fechas:</span> {letter.fechaInicialCompetencia} al {letter.fechaFinalCompetencia}</p>
                        </div>
                        {canDownload ? (
                          <a
                            href={`${server}uploads/lettersA/${letter.carta_pdf}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 flex items-center justify-center gap-2 w-full bg-curious-blue-500 hover:bg-curious-blue-600 text-white rounded px-3 py-2 text-sm"
                          >
                            <FaDownload /> Descargar carta
                          </a>
                        ) : (
                          <p className="mt-3 text-center text-xs text-gray-400">Aún no disponible para descargar</p>
                        )}
                      </Card>
                    )
                  })}
                  {letters.length === 0 && (<p className="text-center text-gray-500 py-4">Aún no tienes solicitudes de carta de permiso</p>)}
                </div>

                {/* Desktop: tabla */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        {['FOLIO', 'COMPETENCIA', 'NIVEL', 'FECHAS', 'ESTATUS', 'DESCARGAR'].map((h) => (
                          <th key={h} className="px-1 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {letters.map((letter) => {
                        const { label, className } = letterStatus(letter)
                        const canDownload = letter.aprobado === true && letter.carta_pdf
                        return (
                          <tr key={letter._id} className="border-b-2 border-stone-200">
                            <td className="px-1 py-2 text-[12px]">{letter.folio}</td>
                            <td className="px-1 py-2 text-[12px]">{letter.nombreCompetencia}</td>
                            <td className="px-1 py-2 text-[12px]">{letter.nivelCompeticion}</td>
                            <td className="px-1 py-2 text-[12px]">{letter.fechaInicialCompetencia} al {letter.fechaFinalCompetencia}</td>
                            <td className="px-1 py-2 text-[12px]"><p className={className}>{label}</p></td>
                            <td className="px-4 py-2">
                              {canDownload ? (
                                <Button
                                  className="bg-curious-blue-500 hover:bg-curious-blue-600 text-white"
                                  size="sm"
                                  tag="a"
                                  href={`${server}uploads/lettersA/${letter.carta_pdf}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FaDownload />
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {letters.length === 0 && (<p className="text-center text-gray-500 py-4">Aún no tienes solicitudes de carta de permiso</p>)}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
