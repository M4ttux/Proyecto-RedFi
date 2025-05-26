import { useState, useEffect } from "react";
import { manejarUbicacionActual } from "../services/mapa";

export const useUbicacionActual = (boundsCorrientes, setAlerta, mapRef) => {
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const handleUbicacionActual = () => {
    setCargandoUbicacion(true);
    const evento = new CustomEvent("solicitarUbicacion");
    window.dispatchEvent(evento);
    setTimeout(() => setCargandoUbicacion(false), 4000);
  };

  useEffect(() => {
    const manejarEvento = () => {
      if (mapRef.current) {
        setAlerta("");
        setTimeout(() => {
          manejarUbicacionActual(boundsCorrientes, setAlerta, mapRef.current);
        }, 50);
      }
    };

    window.addEventListener("solicitarUbicacion", manejarEvento);
    return () => {
      window.removeEventListener("solicitarUbicacion", manejarEvento);
    };
  }, [boundsCorrientes, setAlerta, mapRef]);

  return {
    cargandoUbicacion,
    handleUbicacionActual,
  };
};
