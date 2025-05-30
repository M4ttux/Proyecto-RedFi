import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import maplibregl from "maplibre-gl";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  cargarReseñasEnMapa,
  actualizarVisibilidadReseñas,
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
  
  // ✨ MEMOIZAR filtros normalizados
  const filtrosNormalizados = useMemo(() => {
    if (!filtros) {
      return {
        zona: "",
        proveedor: "",
        tecnologia: "",
        valoracionMin: 0
      };
    }

    return {
      zona: filtros.zona || "",
      proveedor: filtros.proveedor || "",
      tecnologia: filtros.tecnologia || "",
      valoracionMin: filtros.valoracionMin || 0
    };
  }, [filtros]);

  // ✨ TRACKING de estado
  const filtrosActualesRef = useRef(filtrosNormalizados);
  const reseñasCargadasRef = useRef(false);
  const actualizandoFiltrosRef = useRef(false);
  
  const [cargandoMapa, setCargandoMapa] = useState(true);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [reseñaActiva, setReseñaActiva] = useState(null);

  // ✨ FUNCIÓN para cargar reseñas por primera vez (SIN dependencias de filtros)
  const cargarReseñasIniciales = useCallback(async (filtrosParaUsar = null) => {
    if (mapRef.current && isMapLoaded.current && !reseñasCargadasRef.current) {
      const filtrosAUsar = filtrosParaUsar || filtrosNormalizados;
      console.log("🔄 Cargando reseñas iniciales con filtros:", filtrosAUsar);
      
      try {
        await cargarReseñasEnMapa(mapRef.current, setReseñaActiva, filtrosAUsar, marcadoresReseñasRef);
        reseñasCargadasRef.current = true;
        filtrosActualesRef.current = filtrosAUsar;
      } catch (error) {
        console.error("❌ Error cargando reseñas iniciales:", error);
      }
    }
  }, []); // ✨ SIN dependencias para evitar re-creación

  // ✨ FUNCIÓN para actualizar solo visibilidad
  const actualizarFiltrosReseñas = useCallback(async () => {
    if (!reseñasCargadasRef.current || actualizandoFiltrosRef.current) {
      return;
    }

    const anterior = filtrosActualesRef.current;
    const nuevo = filtrosNormalizados;
    
    const cambio = (
      anterior.zona !== nuevo.zona ||
      anterior.proveedor !== nuevo.proveedor ||
      anterior.tecnologia !== nuevo.tecnologia ||
      anterior.valoracionMin !== nuevo.valoracionMin
    );

    if (!cambio) {
      console.log("🔄 Filtros no cambiaron, saltando actualización");
      return;
    }

    actualizandoFiltrosRef.current = true;
    
    try {
      console.log("🔄 Actualizando visibilidad de reseñas:", { anterior, nuevo });
      
      requestAnimationFrame(() => {
        actualizarVisibilidadReseñas(filtrosNormalizados, marcadoresReseñasRef);
        filtrosActualesRef.current = filtrosNormalizados;
        actualizandoFiltrosRef.current = false;
      });
      
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
      actualizandoFiltrosRef.current = false;
    }
  }, [filtrosNormalizados]);

  // ✨ EFECTO 1: Inicialización del mapa (SOLO una vez por boundsCorrientes)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    console.log("🗺️ Inicializando mapa...");

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
      console.log("✅ Mapa cargado");
      isMapLoaded.current = true;
      
      try {
        // ✨ CARGAR proveedores con filtros iniciales
        proveedoresRef.current = await cargarProveedoresEnMapa(map, filtrosNormalizados, setProveedorActivo);
        
        // ✨ CARGAR reseñas con filtros iniciales
        await cargarReseñasIniciales(filtrosNormalizados);
        
        setCargandoMapa(false);
      } catch (error) {
        console.error("❌ Error en carga inicial del mapa:", error);
        setCargandoMapa(false);
      }
    });

    return () => {
      console.log("🧹 Limpiando mapa...");
      if (map) {
        map.remove();
      }
      window.removeEventListener("resize", setNavPosition);
      limpiarMarcadoresReseñas(marcadoresReseñasRef);
      proveedoresRef.current = [];
      mapRef.current = null;
      isMapLoaded.current = false;
      reseñasCargadasRef.current = false;
      actualizandoFiltrosRef.current = false;
    };
  }, [boundsCorrientes]); // ✨ SOLO boundsCorrientes, NO filtros

  // ✨ EFECTO 2: Cambios de ruta
  useEffect(() => {
    if (location.pathname === "/mapa" && !reseñasCargadasRef.current && isMapLoaded.current) {
      console.log("🔄 Ruta cambió a /mapa, cargando reseñas");
      cargarReseñasIniciales(filtrosNormalizados);
    }
  }, [location.pathname, cargarReseñasIniciales, filtrosNormalizados]);

  // ✨ EFECTO 3: Cambios de filtros (SEPARADO de la inicialización)
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded.current) {
      console.log("⏳ Mapa no está listo para filtros");
      return;
    }

    console.log("🔄 Filtros cambiaron:", filtrosNormalizados);

    try {
      // ✨ ACTUALIZAR proveedores
      actualizarVisibilidadEnMapa(mapRef.current, proveedoresRef, filtrosNormalizados);
      
      // ✨ ACTUALIZAR reseñas
      if (reseñasCargadasRef.current) {
        actualizarFiltrosReseñas();
      } else {
        // Si no se han cargado aún, cargar por primera vez
        cargarReseñasIniciales(filtrosNormalizados);
      }
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
    }

  }, [filtrosNormalizados, actualizarFiltrosReseñas, cargarReseñasIniciales]);

  // ✨ FUNCIÓN pública para recargar reseñas completamente
  const recargarReseñasCompleto = useCallback(async () => {
    if (mapRef.current && isMapLoaded.current) {
      console.log("🔄 Recarga completa de reseñas solicitada");
      
      try {
        limpiarMarcadoresReseñas(marcadoresReseñasRef);
        reseñasCargadasRef.current = false;
        actualizandoFiltrosRef.current = false;
        
        await cargarReseñasIniciales(filtrosNormalizados);
      } catch (error) {
        console.error("❌ Error en recarga completa:", error);
      }
    }
  }, [cargarReseñasIniciales, filtrosNormalizados]);

  return {
    mapContainer,
    mapRef,
    cargandoMapa,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    recargarReseñas: actualizarFiltrosReseñas,
    recargarReseñasCompleto,
    marcadoresReseñasRef,
  };
};
