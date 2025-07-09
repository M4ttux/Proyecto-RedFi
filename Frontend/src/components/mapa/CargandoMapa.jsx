import { IconLoader2 } from "@tabler/icons-react";

const CargandoMapa = ({ cargandoMapa }) => {
  if (!cargandoMapa) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 text-white text-lg font-semibold gap-2">
      <IconLoader2 size={32} className="animate-spin" />
      Cargando mapa...
    </div>
  );
};

export default CargandoMapa;
