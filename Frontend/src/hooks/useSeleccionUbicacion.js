import { useState, useCallback } from "react";

export const useSeleccionUbicacion = (mapRef, boundsCorrientes, setModalReseñaAbierto) => {
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState(null);
  const [clickListener, setClickListener] = useState(null);

  const activarSeleccion = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("🎯 Activando modo selección...");
    setModoSeleccion(true);
    setCoordenadasSeleccionadas(null);
    
    // Cambiar cursor del mapa
    mapRef.current.getCanvas().style.cursor = 'crosshair';
    
    // Crear listener para el click
    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;
      
      console.log("📍 Click en mapa:", { lat, lng });
      
      // Verificar que esté dentro de los bounds de Corrientes
      if (
        lng >= boundsCorrientes.west &&
        lng <= boundsCorrientes.east &&
        lat >= boundsCorrientes.south &&
        lat <= boundsCorrientes.north
      ) {
        console.log("✅ Ubicación válida seleccionada");
        setCoordenadasSeleccionadas({ lat, lng });
        desactivarSeleccion();
        
        // 🔧 REABRIR la modal después de seleccionar ubicación
        setTimeout(() => {
          if (setModalReseñaAbierto) {
            setModalReseñaAbierto(true);
          }
        }, 100);
        
      } else {
        console.warn("❌ Ubicación fuera de Corrientes");
        // Opcional: podrías agregar una alerta visual aquí
      }
    };

    // Agregar listener
    mapRef.current.on('click', handleMapClick);
    setClickListener(() => handleMapClick);
  }, [mapRef, boundsCorrientes, setModalReseñaAbierto]);

  const desactivarSeleccion = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("🔄 Desactivando modo selección...");
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
    console.log("🧹 Limpiando selección...");
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
