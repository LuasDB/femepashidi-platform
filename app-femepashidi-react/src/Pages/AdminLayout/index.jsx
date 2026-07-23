import { useEffect,useState} from "react"
import { BrowserRouter as Router, Route, Routes ,Outlet} from "react-router-dom"
import {  Container } from "reactstrap"
import { FaBars } from 'react-icons/fa';



import NavBar from './../../Components/NavBar'
import Sidebar from './../../Components/Sidebar'
import { routes } from './../../routes'



export default function AdminLayout() {  
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = ()=>{
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
  
  }, []);

   

    return (
      <>
      <Container className="w-full mt-12 ">
        <NavBar />
      </Container>
      <div className="flex flex-col md:flex-row h-screen">
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 transition-transform duration-300 ease-in-out z-50   md:shadow-none w-64 md:w-1/5 md:ml-10`}>
          <Sidebar routes={routes} toggleSidebar={toggleSidebar}/>
        </div>
        <div className="flex-grow overflow-x-auto md:overflow-x-hidden overflow-y-auto mt-0" id="contenido">
          <Container className="p-4">
            <Outlet />  
          </Container>
        </div>
      </div>
      <button className="fixed top-4 right-5 z-50 md:hidden" onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>
    </>
    )
}