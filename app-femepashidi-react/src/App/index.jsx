import { useContext } from 'react'
import { Spinner } from 'reactstrap'
import { BrowserRouter as Router , Routes,Route,Navigate } from "react-router-dom"
import { AuthContext,AuthProvider } from "../Context/AuthContext"
import { AccountAuthContext,AccountAuthProvider } from "../Context/AccountAuthContext"
import AdminLayout from "../Pages/AdminLayout"
import CuentaLayout from "../Pages/CuentaLayout"
import ExamenAdmin from "../Pages/ExamenAdmin"
import ExamenJueces from "../Pages/ExamenJueces"

import Login from "../Pages/Login"
import ResetPassword from '../Pages/RestablecerPassword'
import SolicitudPassword from '../Pages/SolicitudPassword'
import ActivarCuenta from '../Pages/ActivarCuenta'
import CuentaLogin from '../Pages/CuentaLogin'
import CuentaDashboard from '../Pages/CuentaDashboard'
import CuentaCompetencias from '../Pages/CuentaCompetencias'
import CuentaOlvidePassword from '../Pages/CuentaOlvidePassword'
import RegistroInscripcion from '../Pages/RegistroInscripcion'
import Streaming from '../Pages/Streaming'
import { routes } from './../routes'
import Resultados from '../Pages/Resultados'
import ResultadosPasados from '../Pages/ResultadosPasados'
import CartasPermiso from '../Pages/CartasPermiso'
import ExceltToXml from '../Components/ExcelToXml'
import RegistroPatinador from '../Pages/RegistroPatinador'
import Inscripcion from '../Pages/Inscripcion'
import FileUploader from '../Pages/FileUploader'






function App() {
  const getRoutes = (routes) => {
    return routes.map((route, index) => {
      console.log(`${route.path}`)
        
        return (
        <Route path={`${route.path}`} element={route.component} key={index} exact />
    )})
}

  return (
    <AuthProvider >
    <AccountAuthProvider>
      <Router basename='/'>
        <Routes>
          <Route path="/gestion"
          element={
            <RequireAuth>
                <AdminLayout />
              </RequireAuth>} >
              {getRoutes(routes)}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/prueba" element={<ExceltToXml />} />
          <Route path="/register" element={<h2>HOLA MUNDO</h2>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/sol-password" element={<SolicitudPassword />} />
          <Route path="/activar-cuenta" element={<ActivarCuenta />} />
          <Route path="/cuenta/login" element={<CuentaLogin />} />
          <Route path="/cuenta/olvide-password" element={<CuentaOlvidePassword />} />
          <Route path="/cuenta"
          element={
            <RequireAccountAuth>
                <CuentaLayout />
              </RequireAccountAuth>} >
              <Route index element={<CuentaDashboard />} />
              <Route path="inscripcion" element={<Inscripcion />} />
              <Route path="competencias" element={<CuentaCompetencias />} />
              <Route path="cartas-permiso" element={<CartasPermiso />} />
          </Route>
          <Route path="/streaming" element={<Streaming />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/resultados-anteriores" element={<ResultadosPasados />} />
          <Route path="/examen-admin/:year/:id/" element={<ExamenAdmin />} />
          <Route path="/examen-judge/:year/:id/" element={<ExamenJueces />} />
          <Route path="/registro/" element={<RegistroPatinador />} />
          {/* Rutas planas heredadas, se mantienen por compatibilidad con enlaces
              antiguos; el flujo nuevo vive dentro de /cuenta con sidebar+navbar. */}
          <Route path="/inscripcion/" element={<Inscripcion />} />
          <Route path="/uploadfiles/" element={<FileUploader />} />
          <Route path="/cartas-permiso/" element={<CartasPermiso />} />
        </Routes>
      </Router>
    </AccountAuthProvider>
    </AuthProvider>

  )
}

const RequireAuth = ({ children }) => {

  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <Spinner
        color="primary"
        style={{
          height: '10rem',
          width: '10rem'
        }}
      >
        Loading...
      </Spinner>
    </div>);
  }

  if (!user) {

    return <Navigate to="/login" />;
  }
  return children;
};

const RequireAccountAuth = ({ children }) => {

  const { account, loading } = useContext(AccountAuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <Spinner
        color="primary"
        style={{
          height: '10rem',
          width: '10rem'
        }}
      >
        Loading...
      </Spinner>
    </div>);
  }

  if (!account) {

    return <Navigate to="/cuenta/login" />;
  }
  return children;
};


export default App
