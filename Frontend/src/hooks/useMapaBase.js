import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { crearMapaBase, cargarProveedoresEnMapa } from "../services/mapa";

const useMapaBase = (
  mapRef,
  mapContainer,
  filtros,
  setProveedorActivo,
  setReseñaActiva,
  recargarReseñas,
  limpiarReseñas,
  boundsCorrientes
) => {
  const navControlRef = useRef(null);
  const isMapLoaded = useRef(false);
  const [cargandoMapa, setCargandoMapa] = useState(true);
  const proveedoresRef = useRef([]);

  useEffect(() => {
    if (!mapContainer || !mapContainer.current) {
      console.error("❌ El mapContainer no está disponible.");
      return;
    }

    const map = crearMapaBase(mapContainer.current, [
      [boundsCorrientes.west, boundsCorrientes.south],
      [boundsCorrientes.east, boundsCorrientes.north],
    ]);

    mapRef.current = map;

    const navControl = new maplibregl.NavigationControl();
    navControlRef.current = navControl;

    const setNavPosition = () => {
      const isMobile = window.innerWidth < 1024;
      try {
        map.removeControl(navControl);
      } catch (e) {}
      map.addControl(navControl, isMobile ? "bottom-left" : "bottom-right");
    };

    setNavPosition();
    window.addEventListener("resize", setNavPosition);

    map.on("load", async () => {
      isMapLoaded.current = true;
      proveedoresRef.current = await cargarProveedoresEnMapa(
        map,
        filtros,
        setProveedorActivo
      );
      setCargandoMapa(false);
    });

    return () => {
      map.remove();
      window.removeEventListener("resize", setNavPosition);
      limpiarReseñas();
      proveedoresRef.current = [];
    };
  }, []);

  return {
    mapRef,
    proveedoresRef,
    isMapLoaded,
    cargandoMapa,
  };
};

export default useMapaBase;
