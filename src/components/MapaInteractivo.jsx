import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


const MapaInteractivo = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: '/map-styles/americana.json', // Estilo base gratuito
      center: [-58.91, -37.98], 
      zoom: 4,
    });

    // Agregar controles
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => map.remove(); // Limpia al desmontar
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapaInteractivo;
