import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  const [schoolName, setSchoolName] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSchoolData = useCallback(async (userId) => {
    if (!userId) {
      setSchoolId(null);
      setSchoolName(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('user_id', userId)
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      } else if (data && data.length > 0) {
        setSchoolId(data[0].id);
        setSchoolName(data[0].name);
      } else {
        setSchoolId(null);
        setSchoolName(null);
      }
    } catch (error) {
      console.error('Error fetching school data:', error);
      setSchoolId(null);
      setSchoolName(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (isMounted) {
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        if (session) {
          setUser(session.user);
          await fetchSchoolData(session.user.id);
        }
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setLoading(true);
          if (event === 'SIGNED_IN' && session) {
            setUser(session.user);
            await fetchSchoolData(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSchoolId(null);
            setSchoolName(null);
            navigate('/login');
          }
          setLoading(false);
        }
      }
    );
    
    return () => {
      isMounted = false;
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      } else if (authListener && authListener.subscription && typeof authListener.subscription.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, fetchSchoolData]);
  
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    if (data.user) {
      setUser(data.user);
      await fetchSchoolData(data.user.id);
      setLoading(false);
      return data.user;
    }
    setLoading(false);
    return null;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(null);
    setSchoolId(null);
    setSchoolName(null);
    setLoading(false);
    navigate('/login');
  };

  const value = React.useMemo(() => ({
    user,
    schoolId,
    schoolName,
    login,
    logout,
    loading,
    setSchoolId,
    setSchoolName,
    fetchSchoolData,
  }), [user, schoolId, schoolName, loading, fetchSchoolData]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};