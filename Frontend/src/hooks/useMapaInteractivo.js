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

    const features = mapRef.current.queryRenderedFeatures(e.point);
    console.log("🔍 Features detectados:", features.map(f => f.layer.id));

    // Buscar si hay una reseña en el click
    const reseñaFeature = features.find(f => f.layer.id === 'reseñas-layer');
    
    if (reseñaFeature) {
      console.log("🔍 Feature de reseña encontrado:", reseñaFeature.properties);
      
      // 📌 Debug: verificar el estado de reseñasCompletasRef
      console.log("📊 Total reseñas en ref:", reseñasCompletasRef.current.length);
      console.log("📊 IDs de reseñas en ref:", reseñasCompletasRef.current.map(r => r.id));
      
      // 🔧 NO usar parseInt para UUIDs
      const reseñaId = reseñaFeature.properties.id;
      console.log("🔍 Buscando reseña con ID:", reseñaId);
      
      const reseñaCompleta = reseñasCompletasRef.current.find(r => r.id === reseñaId);
      
      if (reseñaCompleta) {
        console.log("✅ Reseña completa encontrada:", reseñaCompleta);
        setReseñaActiva(reseñaCompleta);
      } else {
        console.warn("❌ Reseña completa NO encontrada para ID:", reseñaId);
        console.log("📊 Reseñas disponibles:", reseñasCompletasRef.current);
        
        // 🔧 Fallback mejorado para UUIDs
        const properties = reseñaFeature.properties;
        
        // Buscar proveedor real usando UUID
        const proveedorReal = proveedoresRef.current.find(
          p => p.id === properties.proveedor_id
        );
        
        console.log("🔍 Buscando proveedor con ID:", properties.proveedor_id);
        console.log("🔍 Proveedor encontrado:", proveedorReal);
        
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
        
        console.log("📌 Usando reseña fallback mejorada:", reseñaFallback);
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
        console.log("✅ Click en proveedor detectado:", proveedor);
        setProveedorActivo(proveedor);
      }
    }
  }, []);

  const cargarReseñasIniciales = useCallback(async (filtrosParaUsar = null) => {
    if (mapRef.current && isMapLoaded.current) {
      const filtrosAUsar = filtrosParaUsar || filtrosActualesRef.current;
      console.log("🔄 Cargando reseñas iniciales con filtros:", filtrosAUsar);
      try {
        // 📌 Obtener reseñas completas y guardarlas
        const reseñasCompletas = await obtenerReseñas();
        console.log("📊 Reseñas obtenidas del servicio:", reseñasCompletas);
        console.log("📊 Primera reseña como ejemplo:", reseñasCompletas[0]);
        
        reseñasCompletasRef.current = reseñasCompletas;
        console.log("📊 Reseñas guardadas en ref:", reseñasCompletasRef.current.length);
        
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
      console.log("🔄 Actualizando filtros de reseñas:", { anterior, nuevo });
      actualizarVisibilidadReseñas(mapRef.current, filtrosNormalizados);
      filtrosActualesRef.current = filtrosNormalizados;
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
    }
  }, [filtrosNormalizados]);

  // 🌎 Inicializar el mapa (SOLO UNA VEZ)
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
      try { map.removeControl(navControl); } catch (e) {}
      map.addControl(navControl, isMobile ? "bottom-left" : "bottom-right");
    };

    setNavPosition();
    window.addEventListener("resize", setNavPosition);

    map.on("load", async () => {
      console.log("✅ Mapa cargado");
      isMapLoaded.current = true;

      try {
        // Cargar proveedores SIN event listeners individuales
        proveedoresRef.current = await cargarProveedoresEnMapa(map, filtrosNormalizados, null);
        console.log("📊 Proveedores cargados:", proveedoresRef.current.length);
        
        await cargarReseñasIniciales(filtrosNormalizados);
        
        // 🎯 Agregar manejador global de clicks
        map.on('click', manejarClickGlobal);
        
        setCargandoMapa(false);
      } catch (error) {
        console.error("❌ Error en carga inicial del mapa:", error);
        setCargandoMapa(false);
      }
    });

    return () => {
      console.log("🧹 Limpiando mapa...");
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
      console.log("🔄 Ruta cambió a /mapa, cargando reseñas");
      cargarReseñasIniciales(filtrosNormalizados);
    }
  }, [location.pathname, cargarReseñasIniciales, filtrosNormalizados]);

  // 🔄 Aplicar filtros dinámicos (sin reinicializar mapa)
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded.current) {
      console.log("⏳ Mapa no está listo para filtros");
      return;
    }

    console.log("🔄 Filtros cambiaron:", filtrosNormalizados);
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
  };
};
