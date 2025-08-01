import { useState, useCallback } from "react";

export const useSeleccionUbicacion = (mapRef, boundsCorrientes, setModalReseñaAbierto) => {
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState(null);
  const [clickListener, setClickListener] = useState(null);

  const activarSeleccion = useCallback(() => {
    if (!mapRef.current) return;
    
    setModoSeleccion(true);
    setCoordenadasSeleccionadas(null);
    
    // Cambiar cursor del mapa
    mapRef.current.getCanvas().style.cursor = 'crosshair';
    
    // 🔧 Deshabilitar interacciones con marcadores durante selección
    const map = mapRef.current;
    
    // Crear listener para el click
    const handleMapClick = (e) => {
      // 🔧 Prevenir que el evento llegue a otros elementos
      e.preventDefault();
      e.originalEvent?.stopPropagation();
      
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
        
        // 🔧 REABRIR la modal después de seleccionar ubicación
        setTimeout(() => {
          if (setModalReseñaAbierto) {
            setModalReseñaAbierto(true);
          }
        }, 150); // Aumentar el delay un poco
        
      } else {
        console.warn("❌ Ubicación fuera de Corrientes");
      }
    };

    // 🔧 Agregar listener con alta prioridad
    map.on('click', handleMapClick);
    setClickListener(() => handleMapClick);
    
    // 🔧 Opcional: Deshabilitar interacciones con marcadores
    if (map.getLayer('proveedores-layer')) {
      map.setLayoutProperty('proveedores-layer', 'visibility', 'none');
    }
    
  }, [mapRef, boundsCorrientes, setModalReseñaAbierto]);

  const desactivarSeleccion = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("🔄 Desactivando modo selección...");
    setModoSeleccion(false);
    
    const map = mapRef.current;
    
    // Restaurar cursor
    map.getCanvas().style.cursor = '';
    
    // 🔧 Restaurar visibilidad de marcadores
    if (map.getLayer('proveedores-layer')) {
      map.setLayoutProperty('proveedores-layer', 'visibility', 'visible');
    }
    
    // Remover listener si existe
    if (clickListener) {
      map.off('click', clickListener);
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
    setCoordenadasSeleccionadas, // Agregar esta función para uso externo
  };
};
