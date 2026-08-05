import { Button } from 'reactstrap'

// Mismo patrón que Components/Tabla#TablaPatinadores (Views/Patinadores), pero
// extraído para reusarse en Inscripciones y Cartas de Permiso.
export default function Paginacion({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1)

  return (
    <div className="flex justify-between items-center mt-4 text-sm">
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </Button>

      <span className="text-center">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente
      </Button>
    </div>
  )
}
