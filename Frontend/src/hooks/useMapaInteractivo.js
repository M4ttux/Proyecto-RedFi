import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import maplibregl from "maplibre-gl";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  cargarReseñasEnMapa,
  actualizarVisibilidadReseñas,
  manejarUbicacionActual,
} from "../services/mapa";
import { obtenerReseñas } from "../services/reseñaService";

export const useMapaInteractivo = (filtros, boundsCorrientes) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navControlRef = useRef(null);
  const isMapLoaded = useRef(false);
  const proveedoresRef = useRef([]);
  const reseñasCompletasRef = useRef([]);
  const location = useLocation();

  const filtrosNormalizados = useMemo(() => ({
    zona: filtros?.zona || "",
    proveedor: filtros?.proveedor || "",
    tecnologia: filtros?.tecnologia || "",
    valoracionMin: filtros?.valoracionMin || 0,
  }), [filtros]);

  const filtrosActualesRef = useRef(filtrosNormalizados);

  const [cargandoMapa, setCargandoMapa] = useState(true);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [reseñaActiva, setReseñaActiva] = useState(null);

  // 🎯 Manejador global de clicks corregido para UUIDs
  const manejarClickGlobal = useCallback((e) => {
    if (!mapRef.current) return;

    if (modoSeleccionActivo) {
      console.log("🛑 Ignorado: en modo selección de ubicación.");
      return; // Evita procesar clicks mientras se selecciona ubicación
    }

    const features = mapRef.current.queryRenderedFeatures(e.point);

    // Buscar si hay una reseña en el click
    const reseñaFeature = features.find(f => f.layer.id === 'reseñas-layer');
    
    if (reseñaFeature) {
      // 🔧 NO usar parseInt para UUIDs
      const reseñaId = reseñaFeature.properties.id;
      
      const reseñaCompleta = reseñasCompletasRef.current.find(r => r.id === reseñaId);
      
      if (reseñaCompleta) {
        setReseñaActiva(reseñaCompleta);
      } else {        
        // 🔧 Fallback mejorado para UUIDs
        const properties = reseñaFeature.properties;
        
        // Buscar proveedor real usando UUID
        const proveedorReal = proveedoresRef.current.find(
          p => p.id === properties.proveedor_id
        );
        
        const reseñaFallback = {
          id: properties.id,
          proveedor_id: properties.proveedor_id,
          usuario_id: properties.usuario_id,
          estrellas: parseInt(properties.estrellas) || 0,
          comentario: properties.comentario || "Sin comentario",
          // Usar datos reales si están disponibles
          proveedores: proveedorReal ? 
            { nombre: proveedorReal.nombre } : 
            { nombre: `Proveedor ${properties.proveedor_id}` },
          user_profiles: { nombre: `Usuario ${properties.usuario_id.substring(0, 8)}...` }
        };

        setReseñaActiva(reseñaFallback);
      }
      return; // 🛑 Detener aquí, no procesar proveedores
    }

    // Buscar proveedores solo si no hay reseñas
    const proveedorFeature = features.find(f => f.layer.id.startsWith('fill-'));
    if (proveedorFeature) {
      const proveedorId = proveedorFeature.layer.id.replace('fill-', '');
      const proveedor = proveedoresRef.current.find(p => p.id.toString() === proveedorId);
      
      if (proveedor && proveedor.visible) {
        setProveedorActivo(proveedor);
      }
    }
  }, []);

  const cargarReseñasIniciales = useCallback(async (filtrosParaUsar = null) => {
    if (mapRef.current && isMapLoaded.current) {
      const filtrosAUsar = filtrosParaUsar || filtrosActualesRef.current;
      try {
        // 📌 Obtener reseñas completas y guardarlas
        const reseñasCompletas = await obtenerReseñas();

        reseñasCompletasRef.current = reseñasCompletas;
        
        // Cargar en el mapa (sin setReseñaActiva porque usamos el manejador global)
        await cargarReseñasEnMapa(mapRef.current, null, filtrosAUsar);
        filtrosActualesRef.current = filtrosAUsar;
      } catch (error) {
        console.error("❌ Error cargando reseñas iniciales:", error);
      }
    }
  }, []);

  const actualizarFiltrosReseñas = useCallback(() => {
    if (!mapRef.current || !isMapLoaded.current) return;

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

    try {
      actualizarVisibilidadReseñas(mapRef.current, filtrosNormalizados);
      filtrosActualesRef.current = filtrosNormalizados;
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
    }
  }, [filtrosNormalizados]);

  // 🌎 Inicializar el mapa (SOLO UNA VEZ)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = crearMapaBase(mapContainer.current, [
      [boundsCorrientes.west, boundsCorrientes.south],
      [boundsCorrientes.east, boundsCorrientes.north],
    ]);

    mapRef.current = map;

    const navControl = new maplibregl.NavigationControl();
    navControlRef.current = navControl;

    const setNavPosition = () => {
      const isMobile = window.innerWidth < 1024;
      try { map.removeControl(navControl); } catch (e) {}
      map.addControl(navControl, isMobile ? "bottom-left" : "bottom-right");
    };

    setNavPosition();
    window.addEventListener("resize", setNavPosition);

    map.on("load", async () => {
      isMapLoaded.current = true;

      try {
        // Cargar proveedores SIN event listeners individuales
        proveedoresRef.current = await cargarProveedoresEnMapa(map, filtrosNormalizados, null);
        
        await cargarReseñasIniciales(filtrosNormalizados);
        
        // 🎯 Agregar manejador global de clicks
        map.on('click', (e) => manejarClickGlobal(e));
        
        setCargandoMapa(false);
      } catch (error) {
        console.error("❌ Error en carga inicial del mapa:", error);
        setCargandoMapa(false);
      }
    });

    return () => {
      if (map) {
        map.off('click', manejarClickGlobal);
        map.remove();
      }
      window.removeEventListener("resize", setNavPosition);
      proveedoresRef.current = [];
      reseñasCompletasRef.current = [];
      mapRef.current = null;
      isMapLoaded.current = false;
    };
  }, [boundsCorrientes, manejarClickGlobal]);

  // 🔄 Cuando cambia la ruta a /mapa, cargar reseñas si no están cargadas
  useEffect(() => {
    if (location.pathname === "/mapa" && isMapLoaded.current) {
      cargarReseñasIniciales(filtrosNormalizados);
    }
  }, [location.pathname, cargarReseñasIniciales, filtrosNormalizados]);

  // 🔄 Aplicar filtros dinámicos (sin reinicializar mapa)
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded.current) {
      return;
    }

    try {
      actualizarVisibilidadEnMapa(mapRef.current, proveedoresRef, filtrosNormalizados);
      actualizarFiltrosReseñas();
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
    }
  }, [filtrosNormalizados, actualizarFiltrosReseñas]);

  return {
    mapContainer,
    mapRef,
    cargandoMapa,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    cargarReseñasIniciales,
    reseñasCompletasRef,
  };
};
