// src/components/RootRedirect.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Index from '@/pages/Index';


const RootRedirect = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if(user?.role == 'participant' || user?.role == "supporter") {
        navigate("/my-analytics", {replace:true});
      }else{ navigate('/dashboard', { replace: true });}

    }
  }, [isAuthenticated, loading, navigate]);

  // While checking auth, or if not authenticated, show public landing
  if (loading) {
    return <div>Loading...</div>;
  }

  return <Index />;
};

export default RootRedirect;