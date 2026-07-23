import { createContext,useState,useEffect } from 'react'
import  {jwtDecode}  from "jwt-decode";
import axios from 'axios'
import Swal from "sweetalert2"
import { server } from './../db/server'



const AuthContext = createContext()

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
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        const initializeUser = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log('Funciona!', decoded);
                    setUser(decoded);
                } catch (error) {
                    console.error('Error decoding token', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false); // Finaliza el estado de carga
        };

        initializeUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };