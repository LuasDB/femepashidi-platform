import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { AccountAuthContext } from './../../Context/AccountAuthContext'

export default function CuentaLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useContext(AccountAuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const ok = await login(email, password)
        setLoading(false)
        if (ok) {
            navigate('/cuenta')
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
            {/* Panel de marca, oculto en móvil */}
            <div className="hidden md:flex md:w-1/2 relative flex-col justify-between overflow-hidden bg-gradient-to-br from-curious-blue-950 via-curious-blue-800 to-curious-blue-600 p-12 text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.15),transparent_40%)]" />
                <img src="/femepashidi.svg" alt="FEMEPASHIDI" className="relative z-10 w-16" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold leading-tight">
                        Federación Mexicana de Patinaje sobre Hielo y Deportes de Invierno
                    </h1>
                    <p className="mt-4 text-curious-blue-100">
                        Consulta tus inscripciones, resultados y documentos desde tu cuenta de patinador.
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

                    <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
                    <p className="mt-1 mb-8 text-gray-500">Accede a tu cuenta de patinador</p>

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

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
                                <Link to="/cuenta/olvide-password" className="text-xs font-medium text-curious-blue-600 hover:text-curious-blue-700">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative mt-1">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-curious-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-curious-blue-600 py-2.5 font-semibold text-white transition-colors hover:bg-curious-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Ingresando...' : (<>Ingresar <ArrowRight size={18} /></>)}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                        <p className="text-sm text-gray-500">¿Aún no tienes cuenta?</p>
                        <Link
                            to="/registro/"
                            className="mt-2 inline-block font-semibold text-curious-blue-600 hover:text-curious-blue-700"
                        >
                            Regístrate como patinador
                        </Link>
                        <p className="mt-1 text-xs text-gray-400">
                            Tu asociación aprobará tu registro y te enviaremos un correo para activar tu acceso.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
