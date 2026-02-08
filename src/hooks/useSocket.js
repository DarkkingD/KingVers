import { useEffect, useMemo, useState } from 'react';
import { createSocket } from '../socket.js';

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;
    const instance = createSocket(token);
    setSocket(instance);
    return () => instance.disconnect();
  }, [token]);

  return socket;
};
