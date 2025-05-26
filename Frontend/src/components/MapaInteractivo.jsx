import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cargarReseñasEnMapa } from "../services/mapa";
import { useMapaInteractivo } from "../hooks/useMapaInteractivo";
import { useUbicacionActual } from "../hooks/useUbicacionActual";
import { BOUNDS_CORRIENTES } from "../constantes";
import CargandoMapa from "./mapa/CargandoMapa";
import PanelControlMapa from "./mapa/PanelControlMapa";
import ModalProveedor from "./modals/ModalProveedor";
import ModalReseña from "./modals/ModalReseña";
import ModalAgregarReseña from "./modals/ModalAgregarReseña";

const MapaInteractivo = ({ filtros }) => {
  const [alerta, setAlerta] = useState("");
  const [modalReseñaAbierto, setModalReseñaAbierto] = useState(false);
  const navigate = useNavigate();

  const boundsCorrientes = BOUNDS_CORRIENTES;

  const {
    mapContainer,
    mapRef,
    cargandoMapa,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    marcadoresReseñasRef,
  } = useMapaInteractivo(filtros, boundsCorrientes);

  const { cargandoUbicacion, handleUbicacionActual } = useUbicacionActual(
    boundsCorrientes,
    setAlerta,
    mapRef
  );

  const handleAgregarReseña = async ({ ubicacion, proveedorId, comentario, estrellas }) => {
    try {
      setModalReseñaAbierto(false);
      await cargarReseñasEnMapa(mapRef.current, setReseñaActiva, filtros, marcadoresReseñasRef);
    } catch (error) {
      console.error("Error al enviar reseña:", error);
    }
  };

  return (
    <div className="h-full w-full relative">
      <PanelControlMapa
        boundsCorrientes={boundsCorrientes}
        alerta={alerta}
        setAlerta={setAlerta}
        mapRef={mapRef}
        cargandoUbicacion={cargandoUbicacion}
        onUbicacionActual={handleUbicacionActual}
        onAbrirModalReseña={() => setModalReseñaAbierto(true)}
      />

      <CargandoMapa cargandoMapa={cargandoMapa} />

      <div
        ref={mapContainer}
        className={`w-full h-full transition-opacity duration-700 ease-in-out ${
          cargandoMapa ? "opacity-0" : "opacity-100"
        }`}
      />

      <ModalProveedor
        proveedor={proveedorActivo}
        onClose={() => setProveedorActivo(null)}
        navigate={navigate}
      />

      <ModalReseña
        reseña={reseñaActiva}
        onClose={() => setReseñaActiva(null)}
      />

      <ModalAgregarReseña
        isOpen={modalReseñaAbierto}
        onClose={() => setModalReseñaAbierto(false)}
        onEnviar={handleAgregarReseña}
        mapRef={mapRef}
        boundsCorrientes={boundsCorrientes}
        setAlerta={setAlerta}
      />
    </div>
  );
};

export default MapaInteractivo;
