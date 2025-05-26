import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import maplibregl from "maplibre-gl";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  cargarReseñasEnMapa,
  limpiarMarcadoresReseñas,
  manejarUbicacionActual,
} from "../services/mapa";

export const useMapaInteractivo = (filtros, boundsCorrientes) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navControlRef = useRef(null);
  const isMapLoaded = useRef(false);
  const marcadoresReseñasRef = useRef([]);
  const proveedoresRef = useRef([]);
  const location = useLocation();
  const [cargandoMapa, setCargandoMapa] = useState(true);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [reseñaActiva, setReseñaActiva] = useState(null);

  const recargarReseñas = useCallback(() => {
    if (mapRef.current && isMapLoaded.current) {
      cargarReseñasEnMapa(mapRef.current, setReseñaActiva, filtros, marcadoresReseñasRef);
    }
  }, [filtros]);

  // Inicialización del mapa
  useEffect(() => {
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
      proveedoresRef.current = await cargarProveedoresEnMapa(map, filtros, setProveedorActivo);
      await cargarReseñasEnMapa(map, setReseñaActiva, filtros, marcadoresReseñasRef);
      setCargandoMapa(false);
    });

    return () => {
      map.remove();
      window.removeEventListener("resize", setNavPosition);
      limpiarMarcadoresReseñas(marcadoresReseñasRef);
      proveedoresRef.current = [];
    };
  }, []);

  // Efecto para recargar reseñas cuando cambia la ruta
  useEffect(() => {
    if (location.pathname === "/mapa") {
      recargarReseñas();
    }
  }, [location.pathname, recargarReseñas]);

  // Efecto para actualizar filtros
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded.current) return;
    actualizarVisibilidadEnMapa(mapRef.current, proveedoresRef, filtros);
    recargarReseñas();
  }, [filtros, recargarReseñas]);

  return {
    mapContainer,
    mapRef,
    cargandoMapa,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    recargarReseñas,
    marcadoresReseñasRef,
  };
};
