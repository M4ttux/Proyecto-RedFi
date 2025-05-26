const CargandoMapa = ({ cargandoMapa }) => {
  if (!cargandoMapa) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-white text-lg font-semibold">
      Cargando mapa...
    </div>
  );
};

export default CargandoMapa;
