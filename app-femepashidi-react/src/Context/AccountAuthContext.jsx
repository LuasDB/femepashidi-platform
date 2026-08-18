import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import Swal from "sweetalert2"
import { server } from './../db/server'

const AccountAuthContext = createContext()

const ACCOUNT_TOKEN_KEY = 'skaterToken'
const ACCOUNT_LOGIN_PATH = '/cuenta/login'

// jwtDecode solo decodifica, no valida vigencia: sin este chequeo un token
// vencido se queda "logeado" en el estado hasta que una llamada a la API
// regrese 401.
const isExpired = (decoded) => !decoded?.exp || decoded.exp * 1000 <= Date.now()

const AccountAuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem(ACCOUNT_TOKEN_KEY);
        setAccount(null);
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${server}api/v1/auth/account/login`, { email, password });
            if (data.success) {
                const token = data.token;
                localStorage.setItem(ACCOUNT_TOKEN_KEY, token);
                setAccount(jwtDecode(token));
                return true;
            }
            return false;
        } catch (error) {
            setAccount(null);
            localStorage.removeItem(ACCOUNT_TOKEN_KEY);
            Swal.fire('No se pudo iniciar sesión', error.response?.data?.message || 'Verifica tu correo y contraseña', 'error');
            return false;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem(ACCOUNT_TOKEN_KEY);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (isExpired(decoded)) {
                    localStorage.removeItem(ACCOUNT_TOKEN_KEY);
                    setAccount(null);
                } else {
                    setAccount(decoded);
                }
            } catch (error) {
                localStorage.removeItem(ACCOUNT_TOKEN_KEY);
                setAccount(null);
            }
        }
        setLoading(false);
    }, []);

    // Si el token vence mientras la app ya está abierta, la siguiente llamada
    // protegida responde 401 ("El token ha expirado"): se limpia el token y se
    // manda de vuelta a /cuenta/login en vez de dejarlo vencido en localStorage.
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const storedToken = localStorage.getItem(ACCOUNT_TOKEN_KEY);
                const authHeader = error.config?.headers?.Authorization;
                if (error.response?.status === 401 && storedToken && authHeader === `Bearer ${storedToken}`) {
                    localStorage.removeItem(ACCOUNT_TOKEN_KEY);
                    setAccount(null);
                    if (window.location.pathname !== ACCOUNT_LOGIN_PATH) {
                        window.location.href = ACCOUNT_LOGIN_PATH;
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptorId);
    }, []);

    return (
        <AccountAuthContext.Provider value={{ account, login, logout, loading }}>
            {children}
        </AccountAuthContext.Provider>
    );
};

export { AccountAuthContext, AccountAuthProvider };
