import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import MainButton from "./MainButton";
import { DURACION_ALERTA } from "../../constants/constantes";

const estilos = {
  error: "text-red-400 border-red-500/30",
  exito: "text-green-400 border-green-500/30",
  info: "text-blue-400 border-blue-500/30",
  advertencia: "text-yellow-400 border-yellow-500/30",
};

const Alerta = ({
  mensaje,
  tipo = "error",
  onCerrar,
  autoOcultar = true,
  duracion = DURACION_ALERTA,
  flotante = false,
}) => {
  const [visible, setVisible] = useState(false); // controla la clase de animación
  const [renderizar, setRenderizar] = useState(false); // controla si se renderiza el componente

  useEffect(() => {
    if (mensaje) {
      setRenderizar(true);
      setTimeout(() => setVisible(true), 100); // permite animación de entrada
      if (autoOcultar) {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            setRenderizar(false);
            onCerrar?.();
          }, 300); // delay para animación de salida
        }, duracion);
        return () => clearTimeout(timer);
      }
    }
  }, [mensaje, autoOcultar, duracion, onCerrar]);

  const cerrarAlerta = () => {
    setVisible(false);
    setTimeout(() => {
      setRenderizar(false);
      onCerrar?.();
    }, 300);
  };

  if (!renderizar) return null;

  return (
    <div
      className={`${
        flotante ? "absolute w-full left-0 z-50" : ""
      } relative pr-10 bg-[#222222] px-3 py-2 rounded-lg border transition-all duration-300 transform ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      } ${estilos[tipo] || estilos.error}`}
    >
      {mensaje}
      {onCerrar && (
        <MainButton
          onClick={cerrarAlerta}
          type="button"
          variant="cross"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0"
        >
          <IconX size={18} />
        </MainButton>
      )}
    </div>
  );
};

export default Alerta;
