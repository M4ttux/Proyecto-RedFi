import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { AlertaProvider } from "./context/AlertaContext";
import { ThemeProvider } from "./context/ThemeContext";

// Error boundary para depurar problemas de producción
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error en la aplicación:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Oops! Algo salió mal</h1>
          <p>Error: {this.state.error?.message}</p>
          <p>Revisa la consola del navegador para más detalles</p>
          <button onClick={() => window.location.reload()}>
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Verificar variables de entorno
console.log('🔍 Variables de entorno:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ Faltante',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Faltante',
  SPEEDTEST_URL: import.meta.env.VITE_SPEEDTEST_API_URL ? '✅ Configurada' : '❌ Faltante'
});

const root = document.getElementById("root");

if (!root) {
  throw new Error('No se encontró el elemento root');
}

try {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <RoleProvider>
            <ThemeProvider>
              <AlertaProvider>
                <App />
              </AlertaProvider>
            </ThemeProvider>
          </RoleProvider>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Error al inicializar la aplicación:', error);
  root.innerHTML = `
    <div style="padding: 20px; text-align: center; color: red;">
      <h1>Error de Inicialización</h1>
      <p>Error: ${error.message}</p>
      <p>Revisa la consola del navegador para más detalles</p>
    </div>
  `;
}
