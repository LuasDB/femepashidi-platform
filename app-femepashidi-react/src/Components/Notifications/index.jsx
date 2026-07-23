import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap'
import { FaBell } from 'react-icons/fa'
import { io } from 'socket.io-client'
import axios from 'axios'
import { server } from './../../db/server'

const formatWhen = (isoDate) => {
  const date = new Date(isoDate)
  return date.toLocaleString('es-MX', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
}

// tokenKey deja reutilizar el mismo componente para el NavBar de /gestion
// (token de admin/presidente) y el de /cuenta (skaterToken de patinador) —
// el backend ya sabe distinguir ambos tipos de token (ver
// middlewares/authenticate.js#requireStaffOrAccount).
export default function Notifications({ tokenKey = 'token' }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const token = localStorage.getItem(tokenKey)
  const authHeader = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) return

    const loadNotifications = async () => {
      try {
        const { data } = await axios.get(`${server}api/v1/notifications`, { headers: authHeader })
        if (data.success) {
          setNotifications(data.notifications)
          setUnreadCount(data.unreadCount)
        }
      } catch (error) {
        console.error('No se pudieron cargar las notificaciones', error)
      }
    }
    loadNotifications()

    const socket = io(`${server}`)
    socket.emit('join_notifications', token)
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const toggle = () => setIsOpen((prev) => !prev)

  const handleSelect = async (notification) => {
    if (!notification.read) {
      try {
        await axios.patch(`${server}api/v1/notifications/${notification._id}/read`, {}, { headers: authHeader })
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error('No se pudo marcar la notificación como leída', error)
      }
    }
    setIsOpen(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAllRead = async (e) => {
    e.stopPropagation()
    try {
      await axios.patch(`${server}api/v1/notifications/read-all`, {}, { headers: authHeader })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('No se pudieron marcar todas como leídas', error)
    }
  }

  if (!token) return null

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle tag="a" className="nav-link relative cursor-pointer">
        <FaBell className="flex" />
        {unreadCount > 0 && (
          <Badge color="danger" pill className="absolute -top-1 -right-2 text-[10px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu end className="w-72 sm:w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-semibold">Notificaciones</span>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-curious-blue-600 hover:underline">
              Marcar todas como leídas
            </button>
          )}
        </div>
        {notifications.length === 0 && (
          <DropdownItem disabled className="text-sm text-gray-500">Sin notificaciones</DropdownItem>
        )}
        {notifications.map((notification) => (
          <DropdownItem
            key={notification._id}
            onClick={() => handleSelect(notification)}
            className={`whitespace-normal py-2 ${notification.read ? '' : 'bg-curious-blue-50'}`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{notification.title}</span>
              <span className="text-xs text-gray-600">{notification.message}</span>
              <span className="text-[11px] text-gray-400 mt-1">{formatWhen(notification.createdAt)}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
