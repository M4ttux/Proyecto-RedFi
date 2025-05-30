import { obtenerReseñas } from "../reseñaService";
import maplibregl from "maplibre-gl";

export const cargarReseñasEnMapa = async (map, setReseñaActiva, filtros = {}, marcadoresRef) => {
  try {
    console.log("🔍 Cargando reseñas con filtros:", filtros);
    
    if (!filtros) filtros = {};
    
    const reseñas = await obtenerReseñas();
    console.log(`📊 Total reseñas obtenidas: ${reseñas.length}`);

    // ✨ APLICAR filtros con mejor logging
    const filtradas = reseñas.filter((r) => {
      const proveedorMatch = !filtros.proveedor || r.proveedor_id === filtros.proveedor;
      const zonaMatch = !filtros.zona || r.proveedores?.zona_id === filtros.zona;
      const tecnologiaMatch = !filtros.tecnologia || r.proveedores?.tecnologia === filtros.tecnologia;
      const valoracionMatch = r.estrellas >= (filtros.valoracionMin || 0);
      
      const cumple = proveedorMatch && zonaMatch && tecnologiaMatch && valoracionMatch;
      
      // ✨ DEBUG: Log para reseñas que no cumplen filtros
      if (!cumple) {
        console.log(`❌ Reseña ${r.id} no cumple filtros:`, {
          proveedor: proveedorMatch,
          zona: zonaMatch,
          tecnologia: tecnologiaMatch,
          valoracion: valoracionMatch
        });
      }
      
      return cumple;
    });

    console.log(`✅ Reseñas filtradas: ${filtradas.length}`);

    // ✨ CREAR/MOSTRAR marcadores para reseñas filtradas
    filtradas.forEach((r) => {
      let marcadorExistente = marcadoresRef.current.find((m) => m.reseña.id === r.id);
      
      if (marcadorExistente) {
        // ✨ MOSTRAR marcador existente
        console.log(`👁️ Mostrando marcador existente para reseña ${r.id}`);
        marcadorExistente.element.style.opacity = "1";
        marcadorExistente.element.style.pointerEvents = "auto";
        marcadorExistente.element.style.display = "block";
      } else {
        // ✨ CREAR nuevo marcador
        const coords = r.proveedores?.zonas?.geom?.coordinates?.flat(2);
        if (!Array.isArray(coords) || coords.length < 2) {
          console.warn(`⚠️ Coordenadas inválidas para reseña ${r.id}`);
          return;
        }

        const [lng, lat] = coords;
        
        // ✨ VALIDAR coordenadas
        if (isNaN(lng) || isNaN(lat)) {
          console.warn(`⚠️ Coordenadas NaN para reseña ${r.id}:`, { lng, lat });
          return;
        }

        console.log(`➕ Creando nuevo marcador para reseña ${r.id} en [${lng}, ${lat}]`);

        const markerEl = document.createElement("div");
        markerEl.className = `
          w-4 h-4 bg-[#FB8531] rounded-full border border-white shadow-md 
          opacity-0 hover:shadow-xl hover:ring-2 hover:ring-white/40 
          cursor-pointer
        `.replace(/\s+/g, ' ').trim();

        // ✨ AGREGAR data attribute para debugging
        markerEl.setAttribute('data-reseña-id', r.id);

        markerEl.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log(`🖱️ Click en reseña ${r.id}`);
          setReseñaActiva(r);
        });

        const marker = new maplibregl.Marker({
          element: markerEl,
          anchor: "center",
        })
          .setLngLat([lng, lat])
          .addTo(map);

        // ✨ ANIMACIÓN de aparición
        setTimeout(() => {
          markerEl.classList.remove("opacity-0");
          markerEl.classList.add("opacity-100");
        }, 10);

        // ✨ GUARDAR referencia con más información
        marcadoresRef.current.push({ 
          marker, 
          element: markerEl, 
          reseña: r,
          coords: [lng, lat],
          visible: true
        });
      }
    });

    // ✨ OCULTAR marcadores que NO cumplen el filtro
    let ocultados = 0;
    let mostrados = 0;

    marcadoresRef.current.forEach(({ reseña, element, marker }) => {
      const cumpleFiltro = filtradas.find((r) => r.id === reseña.id);
      
      if (cumpleFiltro) {
        // ✨ MOSTRAR
        element.style.opacity = "1";
        element.style.pointerEvents = "auto";
        element.style.display = "block";
        mostrados++;
      } else {
        // ✨ OCULTAR (pero NO remover)
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        element.style.display = "none";
        ocultados++;
      }
    });

    console.log(`👁️ Marcadores mostrados: ${mostrados}, ocultados: ${ocultados}`);

  } catch (error) {
    console.error("❌ Error en cargarReseñasEnMapa:", error);
    throw error;
  }
};

// ✨ FUNCIÓN para limpiar marcadores completamente
export const limpiarMarcadoresReseñas = (marcadoresRef) => {
  if (!marcadoresRef.current) return;
  
  console.log(`🧹 Limpiando ${marcadoresRef.current.length} marcadores`);
  
  marcadoresRef.current.forEach(({ marker, element }) => {
    try {
      if (marker && marker.remove) {
        marker.remove();
      }
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (error) {
      console.warn("⚠️ Error limpiando marcador:", error);
    }
  });
  
  marcadoresRef.current = [];
  console.log("✅ Marcadores limpiados");
};

// ✨ NUEVA FUNCIÓN: Actualizar visibilidad sin recargar
export const actualizarVisibilidadReseñas = (filtros, marcadoresRef) => {
  if (!marcadoresRef.current || marcadoresRef.current.length === 0) {
    console.log("ℹ️ No hay marcadores para actualizar");
    return;
  }

  console.log("🔄 Actualizando visibilidad de marcadores con filtros:", filtros);

  let mostrados = 0;
  let ocultados = 0;

  marcadoresRef.current.forEach(({ reseña, element }) => {
    // ✨ APLICAR filtros
    const proveedorMatch = !filtros.proveedor || reseña.proveedor_id === filtros.proveedor;
    const zonaMatch = !filtros.zona || reseña.proveedores?.zona_id === filtros.zona;
    const tecnologiaMatch = !filtros.tecnologia || reseña.proveedores?.tecnologia === filtros.tecnologia;
    const valoracionMatch = reseña.estrellas >= (filtros.valoracionMin || 0);
    
    const cumpleFiltro = proveedorMatch && zonaMatch && tecnologiaMatch && valoracionMatch;

    if (cumpleFiltro) {
      element.style.opacity = "1";
      element.style.pointerEvents = "auto";
      element.style.display = "block";
      mostrados++;
    } else {
      element.style.opacity = "0";
      element.style.pointerEvents = "none";
      element.style.display = "none";
      ocultados++;
    }
  });

  console.log(`👁️ Visibilidad actualizada - Mostrados: ${mostrados}, Ocultados: ${ocultados}`);
};
