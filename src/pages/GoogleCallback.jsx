import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const GoogleCallback = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      navigate('/feed');
    } else {
      navigate('/login');
    }
  }, [search, navigate, setToken]);

  return <div className="p-8">Connexion Google en cours...</div>;
};

export default GoogleCallback;
