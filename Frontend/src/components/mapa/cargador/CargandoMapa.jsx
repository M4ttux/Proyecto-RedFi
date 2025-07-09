import { useEffect, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

const CargandoMapa = ({ cargandoMapa }) => {
  const [visible, setVisible] = useState(cargandoMapa);

  useEffect(() => {
    if (cargandoMapa) {
      setVisible(true); // volver a mostrarlo cuando vuelve a cargar
    } else {
      const timeout = setTimeout(() => {
        setVisible(false); // ocultarlo después del fade-out
      }, 500); // duración del fade-out

      return () => clearTimeout(timeout);
    }
  }, [cargandoMapa]);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center text-white text-lg font-semibold gap-2 transition-opacity duration-500 ${
        cargandoMapa ? "opacity-100 bg-black/60" : "opacity-0 bg-black/0"
      }`}
    >
      <IconLoader2 size={32} className="animate-spin" />
      Cargando mapa...
    </div>
  );
};

export default CargandoMapa;
