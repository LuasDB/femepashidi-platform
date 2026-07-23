import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { server } from './../../db/server'

const SocketComponent = () => {
  // Estado para manejar los datos recibidos
  const [message, setMessage] = useState('');

  // Conectar al servidor Socket.IO al montar el componente
  useEffect(() => {
    // Configura la conexión con el servidor
    const socket = io(`${server}`); 

    // Escuchar eventos desde el servidor
    socket.on('judges', (data) => {
      console.log('Datos recibidos desde el servidor:', data);
      setMessage('nuevo')
    });
    socket.on('new-exam', (data) => {
      console.log('Datos recibidos desde el servidor:', data);
      
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket.IO React Example</h1>
      <p>{message ? `Mensaje del servidor: ${message}` : 'Esperando mensaje del servidor...'}</p>
    </div>
  );
};

export default SocketComponent;
