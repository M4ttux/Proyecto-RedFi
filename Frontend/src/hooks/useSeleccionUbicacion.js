import { useState, useCallback } from "react";

export const useSeleccionUbicacion = (mapRef, boundsCorrientes) => {
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState(null);
  const [clickListener, setClickListener] = useState(null);

  const activarSeleccion = useCallback(() => {
    if (!mapRef.current) return;

    setModoSeleccion(true);
    setCoordenadasSeleccionadas(null);

    // Cambiar cursor del mapa
    mapRef.current.getCanvas().style.cursor = 'crosshair';

    // Crear listener para el click
    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;

      // Verificar que esté dentro de los bounds de Corrientes
      if (
        lng >= boundsCorrientes.west &&
        lng <= boundsCorrientes.east &&
        lat >= boundsCorrientes.south &&
        lat <= boundsCorrientes.north
      ) {
        setCoordenadasSeleccionadas({ lat, lng });
        desactivarSeleccion();
      } else {
        console.warn("Ubicación fuera de Corrientes");
      }
    };

    // Agregar listener
    mapRef.current.on('click', handleMapClick);
    setClickListener(() => handleMapClick);

  }, [mapRef, boundsCorrientes]);

  const desactivarSeleccion = useCallback(() => {
    if (!mapRef.current) return;

    setModoSeleccion(false);
    
    // Restaurar cursor
    mapRef.current.getCanvas().style.cursor = '';

    // Remover listener si existe
    if (clickListener) {
      mapRef.current.off('click', clickListener);
      setClickListener(null);
    }
  }, [mapRef, clickListener]);

  const limpiarSeleccion = useCallback(() => {
    setCoordenadasSeleccionadas(null);
    desactivarSeleccion();
  }, [desactivarSeleccion]);

  return {
    modoSeleccion,
    coordenadasSeleccionadas,
    activarSeleccion,
    desactivarSeleccion,
    limpiarSeleccion,
  };
};
