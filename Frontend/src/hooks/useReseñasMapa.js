import { useRef, useCallback } from "react";
import { cargarReseñasEnMapa, limpiarMarcadoresReseñas } from "../services/mapa";

const useReseñasMapa = (mapRef, setReseñaActiva) => {
  const marcadoresReseñasRef = useRef([]);

  const recargarReseñas = useCallback((filtros) => {
    if (mapRef.current) {
      cargarReseñasEnMapa(mapRef.current, setReseñaActiva, filtros, marcadoresReseñasRef);
    }
  }, [mapRef, setReseñaActiva]);

  const limpiarReseñas = () => {
    limpiarMarcadoresReseñas(marcadoresReseñasRef);
  };

  return {
    marcadoresReseñasRef,
    recargarReseñas,
    limpiarReseñas,
  };
};

export default useReseñasMapa;
