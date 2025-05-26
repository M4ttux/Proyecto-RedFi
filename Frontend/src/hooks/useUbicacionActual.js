import { useEffect } from "react";
import { manejarUbicacionActual } from "../services/mapa";

const useUbicacionActual = (mapRef, setAlerta, boundsCorrientes) => {
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
  }, [mapRef, setAlerta, boundsCorrientes]);
};

export default useUbicacionActual;
