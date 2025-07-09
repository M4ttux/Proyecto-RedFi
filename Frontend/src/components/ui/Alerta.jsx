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
}) => {
  const [visible, setVisible] = useState(!!mensaje);

  useEffect(() => {
    if (mensaje) {
      setVisible(true);
      if (autoOcultar) {
        const timer = setTimeout(() => {
          setVisible(false);
          onCerrar?.();
        }, duracion);
        return () => clearTimeout(timer);
      }
    }
  }, [mensaje, autoOcultar, duracion, onCerrar]);

  if (!mensaje || !visible) return null;

  return (
    <div
      className={`relative pr-10 text-sm bg-white/5 px-3 py-2 rounded-md border transition-opacity duration-500 opacity-100 ${
        estilos[tipo] || estilos.error
      }`}
    >
      {mensaje}
      {onCerrar && (
        <MainButton
          onClick={() => {
            setVisible(false);
            onCerrar();
          }}
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
