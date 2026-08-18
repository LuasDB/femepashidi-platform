import { createContext,useState,useEffect } from 'react'
import  {jwtDecode}  from "jwt-decode";
import axios from 'axios'
import Swal from "sweetalert2"
import { server } from './../db/server'



const AuthContext = createContext()

const TOKEN_KEY = 'token'
const LOGIN_PATH = '/login'

// jwtDecode solo decodifica, no valida vigencia: sin este chequeo un token
// vencido se queda "logeado" en el estado hasta que una llamada a la API
// regrese 401.
const isExpired = (decoded) => !decoded?.exp || decoded.exp * 1000 <= Date.now()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Para manejar el estado de carga

    const login = async (email, password) => {
        try {
            console.log(`${server}api/v1/auth/login`)
            const { data } = await axios.post(`${server}api/v1/auth/login`, { email, password });
            console.log(data);
            if (data.success) {
                const token = data.token;
                localStorage.setItem('token', token);
                const decoded = jwtDecode(token);
                console.log(decoded)
                setUser(decoded);
                return true
            } else {
                setUser(null);
                localStorage.removeItem('token');
                Swal.fire('Credenciales Invalidas','Intente de nuevo','error')
            }
        } catch (error) {
           return
          
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    };

    useEffect(() => {
        const initializeUser = () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (isExpired(decoded)) {
                        localStorage.removeItem(TOKEN_KEY);
                        setUser(null);
                    } else {
                        setUser(decoded);
                    }
                } catch (error) {
                    localStorage.removeItem(TOKEN_KEY);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false); // Finaliza el estado de carga
        };

        initializeUser();
    }, []);

    // Si el token vence mientras la app ya está abierta, la siguiente llamada
    // protegida responde 401: se limpia el token y se manda de vuelta a
    // /login en vez de dejarlo vencido en localStorage.
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const storedToken = localStorage.getItem(TOKEN_KEY);
                const authHeader = error.config?.headers?.Authorization;
                if (error.response?.status === 401 && storedToken && authHeader === `Bearer ${storedToken}`) {
                    localStorage.removeItem(TOKEN_KEY);
                    setUser(null);
                    if (window.location.pathname !== LOGIN_PATH) {
                        window.location.href = LOGIN_PATH;
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptorId);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };