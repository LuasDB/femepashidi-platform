import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { server } from '../../db/server'

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

// Botón + modal para ver un documento de identidad (acta de nacimiento, CURP)
// sin exponer un link de descarga: se trae como blob autenticado y se
// muestra inline. No hay garantía real contra una captura de pantalla, pero
// sí se evita un link reutilizable/descargable y el menú contextual normal.
export default function DocumentViewer({ curp, tipo, label }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [blobUrl, setBlobUrl] = useState(null)
    const [contentType, setContentType] = useState(null)

    const cleanup = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
        setContentType(null)
        setOpen(false)
    }

    const handleOpen = async () => {
        setLoading(true)
        try {
            const res = await axios.get(
                `${server}api/v1/skaters/${curp}/documentos/${tipo}`,
                { headers: authHeader(), responseType: 'blob' }
            )
            setContentType(res.data.type)
            setBlobUrl(URL.createObjectURL(res.data))
            setOpen(true)
        } catch (error) {
            Swal.fire('No se pudo cargar el documento', error.response?.data?.message || 'Intenta de nuevo', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button className='bg-blue-500 w-full sm:w-auto' disabled={loading} onClick={handleOpen}>
                {loading ? 'Cargando...' : label}
            </Button>
            <Modal isOpen={open} toggle={cleanup} onClosed={cleanup} size='lg'>
                <ModalHeader toggle={cleanup}>{label}</ModalHeader>
                <ModalBody className='flex justify-center' onContextMenu={e => e.preventDefault()}>
                    {contentType?.startsWith('image/') && (
                        <img
                            src={blobUrl}
                            alt={label}
                            draggable={false}
                            onDragStart={e => e.preventDefault()}
                            className='max-w-full max-h-[75vh] object-contain select-none'
                        />
                    )}
                    {contentType === 'application/pdf' && (
                        <embed
                            src={`${blobUrl}#toolbar=0&navpanes=0`}
                            type='application/pdf'
                            className='w-full h-[75vh]'
                        />
                    )}
                    {contentType && !contentType.startsWith('image/') && contentType !== 'application/pdf' && (
                        <p className='text-gray-500 py-8 text-center'>No hay vista previa disponible para este tipo de archivo.</p>
                    )}
                </ModalBody>
            </Modal>
        </>
    )
}
