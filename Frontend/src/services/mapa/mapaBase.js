import maplibregl from "maplibre-gl";

export const estaEnCorrientes = (lng, lat, bounds) => {
  return (
    lng >= bounds.west &&
    lng <= bounds.east &&
    lat >= bounds.south &&
    lat <= bounds.north
  );
};

export const crearMapaBase = (mapContainer, bounds) => {
  return new maplibregl.Map({
    container: mapContainer,
    style:
      "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
    center: [-58.95, -28.65],
    zoom: 2,
    maxBounds: bounds,
    attributionControl: false,
  });
};

export const getVisible = (prov, filtros) => {
  if (!filtros) return true;
  if (filtros.proveedor && prov.id != filtros.proveedor) return false;
  if (filtros.zona && prov.zona_id != filtros.zona) return false;
  if (filtros.tecnologia && prov.tecnologia !== filtros.tecnologia) return false;
  return true;
};
