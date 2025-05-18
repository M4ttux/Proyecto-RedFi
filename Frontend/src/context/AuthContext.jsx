import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para consumir el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NUEVO estado de carga
  const navigate = useNavigate();

  // Verificar sesión activa al cargar la app
  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user || null);
      setLoading(false); // ✅ Marcar como completado
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
    navigate("/cuenta"); // O reemplazá por 'navigate(from)' si lo preferís dinámico
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
