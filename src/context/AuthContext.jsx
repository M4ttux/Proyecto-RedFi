import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

// Crear contexto
const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Observar sesión activa al cargar
  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUsuario(user);
    };
    obtenerUsuario();

    // Escuchar cambios de sesión (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    navigate("/cuenta");
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
