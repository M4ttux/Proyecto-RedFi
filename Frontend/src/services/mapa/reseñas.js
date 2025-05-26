import { obtenerReseñas } from "../reseñaService";
import maplibregl from "maplibre-gl";

export const cargarReseñasEnMapa = async (map, setReseñaActiva, filtros = {}, marcadoresRef) => {
  if (!filtros) filtros = {};

  const reseñas = await obtenerReseñas();

  const reseñasConEstado = reseñas.map((r) => {
    const visible =
      (!filtros.proveedor || r.proveedor_id === filtros.proveedor) &&
      (!filtros.valoracionMin || r.estrellas >= parseInt(filtros.valoracionMin)) &&
      (!filtros.zona || r.proveedores?.zona_id === filtros.zona) &&
      (!filtros.tecnologia || r.proveedores?.tecnologia === filtros.tecnologia);

    return { ...r, visible };
  });

  reseñasConEstado.forEach((r) => {
    let marcadorExistente = marcadoresRef.current.find((m) => m.reseña.id === r.id);

    if (marcadorExistente) {
      // Actualiza la visibilidad
      marcadorExistente.element.style.opacity = r.visible ? "1" : "0";
    } else if (r.visible) {
      const coords = r.proveedores?.zonas?.geom?.coordinates?.flat(2);
      if (!Array.isArray(coords) || coords.length < 2) return;

      const [lng, lat] = coords;

      const markerEl = document.createElement("div");
      markerEl.className =
        "w-4 h-4 bg-[#FB8531] rounded-full border border-white shadow-md opacity-0 hover:shadow-xl hover:ring-2 hover:ring-white/40 cursor-pointer transition-all duration-300";

      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        setReseñaActiva(r);
      });

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      setTimeout(() => {
        markerEl.classList.remove("opacity-0");
        markerEl.classList.add("opacity-100");
      }, 10);

      marcadoresRef.current.push({ marker, element: markerEl, reseña: r });
    }
  });
};

export const limpiarMarcadoresReseñas = (marcadoresRef) => {
  marcadoresRef.current.forEach(({ marker }) => marker.remove());
  marcadoresRef.current = [];
};
