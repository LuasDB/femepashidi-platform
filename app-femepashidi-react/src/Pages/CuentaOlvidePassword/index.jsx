import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { server } from '../../db/server';

const CuentaOlvidePassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${server}api/v1/auth/account/forgot-password`, { email });
            if (data.success) {
                setSuccess(data.message || 'Se ha enviado un enlace para restablecer tu contraseña a tu correo.');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo procesar tu solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
            {/* Panel de marca, oculto en móvil */}
            <div className="hidden md:flex md:w-1/2 relative flex-col justify-between overflow-hidden bg-gradient-to-br from-curious-blue-950 via-curious-blue-800 to-curious-blue-600 p-12 text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.15),transparent_40%)]" />
                <img src="/femepashidi.svg" alt="FEMEPASHIDI" className="relative z-10 w-16" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold leading-tight">Recupera el acceso a tu cuenta</h1>
                    <p className="mt-4 text-curious-blue-100">
                        Te enviaremos un enlace a tu correo para que puedas elegir una nueva contraseña.
                    </p>
                </div>
                <p className="relative z-10 text-xs text-curious-blue-200">
                    © {new Date().getFullYear()} FEMEPASHIDI, A.C.
                </p>
            </div>

            {/* Formulario */}
            <div className="flex flex-1 items-center justify-center bg-gray-50 p-6 md:p-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex justify-center md:hidden">
                        <img src="/femepashidi.svg" alt="FEMEPASHIDI" className="w-14" />
                    </div>

                    <Link to="/cuenta/login" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-curious-blue-600">
                        <ArrowLeft size={16} /> Volver a iniciar sesión
                    </Link>

                    <h2 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h2>
                    <p className="mt-1 mb-8 text-gray-500">Ingresa el correo de tu cuenta</p>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700" htmlFor="email">Correo</label>
                                <div className="relative mt-1">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="tu@correo.com"
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-curious-blue-500"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-curious-blue-600 py-2.5 font-semibold text-white transition-colors hover:bg-curious-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Enviando...' : (<>Enviar enlace <ArrowRight size={18} /></>)}
                            </button>
                        </form>
                    ) : (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex gap-3">
                            <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20} />
                            <p className="text-sm text-green-800">{success}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CuentaOlvidePassword;
