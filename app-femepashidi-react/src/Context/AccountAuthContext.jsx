import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import Swal from "sweetalert2"
import { server } from './../db/server'

const AccountAuthContext = createContext()

const ACCOUNT_TOKEN_KEY = 'skaterToken'

const AccountAuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const logout = () => {
        localStorage.removeItem(ACCOUNT_TOKEN_KEY);
        setAccount(null);
    };

    useEffect(() => {
        const token = localStorage.getItem(ACCOUNT_TOKEN_KEY);
        if (token) {
            try {
                setAccount(jwtDecode(token));
            } catch (error) {
                setAccount(null);
            }
        }
        setLoading(false);
    }, []);

    return (
        <AccountAuthContext.Provider value={{ account, login, logout, loading }}>
            {children}
        </AccountAuthContext.Provider>
    );
};

export { AccountAuthContext, AccountAuthProvider };
