import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Row, Col, FormGroup, Input, Label, Button } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { server } from "../../db/server";

export default function CategoriasConfig() {

    const [temporada, setTemporada] = useState('');
    const [vigenteDesde, setVigenteDesde] = useState('');
    const [rangos, setRangos] = useState([]);
    const [nivelesISU, setNivelesISU] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await axios.get(`${server}api/v1/category-config`);
                if (data.success) {
                    setTemporada(data.data.temporada || '');
                    setVigenteDesde(data.data.vigenteDesde || '');
                    setRangos(data.data.rangos || []);
                    setNivelesISU(data.data.nivelesISU || []);
                }
            } catch (error) {
                Swal.fire('Algo salio mal', 'No se pudo cargar la configuración de categorías', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleRangoChange = (categoria, campo, valor) => {
        setRangos(prev => prev.map(r => r.categoria === categoria ? { ...r, [campo]: valor } : r));
    };

    const handleNivelISUChange = (nivel, campo, valor) => {
        setNivelesISU(prev => prev.map(n => n.nivel === nivel ? { ...n, [campo]: valor } : n));
    };

    const mayor = rangos.find(r => r.categoria === 'MAYOR');

    const handleUpdate = async () => {
        try {
            const payload = {
                temporada,
                vigenteDesde,
                rangos,
                nivelesISU: nivelesISU.map(n => ({
                    ...n,
                    minEdad: Number(n.minEdad),
                    maxEdad: n.maxEdad === '' || n.maxEdad === null ? null : Number(n.maxEdad)
                }))
            };

            const { data } = await axios.put(`${server}api/v1/category-config`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (data.success) {
                Swal.fire('Actualizado', data.message, 'success');
            }
        } catch (error) {
            Swal.fire('Algo salio mal', error.response?.data?.message || 'No se pudo guardar la configuración', 'error');
        }
    };

    if (loading) return null;

    return (
        <Card>
            <CardHeader>
                <h2>Configuración de Categorías</h2>
                <p className="text-sm text-gray-600 mb-0">
                    Esta tabla se usa para calcular automáticamente la categoría de un patinador
                    al registrarlo, según su fecha de nacimiento. Se debe actualizar cada temporada
                    (normalmente cada 1 de julio) según la tabla vigente de la federación.
                </p>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label>Temporada</Label>
                            <Input type="text" value={temporada} onChange={(e) => setTemporada(e.target.value)} placeholder="2026/2027" />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label>Vigente desde</Label>
                            <Input type="date" value={vigenteDesde} onChange={(e) => setVigenteDesde(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>

                <h5 className="mt-4">Categorías por fecha de nacimiento</h5>
                {rangos.map(rango => (
                    <Row key={rango.categoria} className="items-end">
                        <Col md={3}>
                            <Label>{rango.categoria}</Label>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label>Nacidos a partir de</Label>
                                <Input type="date" value={rango.inicio} onChange={(e) => handleRangoChange(rango.categoria, 'inicio', e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label>Hasta</Label>
                                <Input type="date" value={rango.fin} onChange={(e) => handleRangoChange(rango.categoria, 'fin', e.target.value)} />
                            </FormGroup>
                        </Col>
                    </Row>
                ))}
                {mayor && (
                    <Row>
                        <Col md={12}>
                            <p className="text-sm text-gray-600">
                                <strong>ADULTO:</strong> nacidos antes del {mayor.inicio} (se calcula automáticamente a partir del inicio de MAYOR)
                            </p>
                        </Col>
                    </Row>
                )}

                <h5 className="mt-4">Niveles ISU (Novicios / Avanzados)</h5>
                <p className="text-sm text-gray-600">
                    Se calculan por edad cumplida a la fecha de "Vigente desde". Deja "Edad máxima" vacía para
                    "sin límite" (caso de Avanzados 2).
                </p>
                {nivelesISU.map(nivel => (
                    <Row key={nivel.nivel} className="items-end">
                        <Col md={3}>
                            <Label>{nivel.nivel}</Label>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label>Edad mínima cumplida</Label>
                                <Input type="number" value={nivel.minEdad} onChange={(e) => handleNivelISUChange(nivel.nivel, 'minEdad', e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label>Edad máxima (sin cumplir)</Label>
                                <Input type="number" value={nivel.maxEdad ?? ''} placeholder="Sin límite" onChange={(e) => handleNivelISUChange(nivel.nivel, 'maxEdad', e.target.value)} />
                            </FormGroup>
                        </Col>
                    </Row>
                ))}

                <Row className="mt-4">
                    <Col md={4}>
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUpdate}>Guardar cambios</Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}
