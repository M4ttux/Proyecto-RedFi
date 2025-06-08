import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { crearReseña } from "../services/reseñaService";
import { cargarReseñasEnMapa } from "../services/mapa";
import { useMapaInteractivo } from "../hooks/useMapaInteractivo";
import { useUbicacionActual } from "../hooks/useUbicacionActual";
import { useSeleccionUbicacion } from "../hooks/useSeleccionUbicacion";
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

  const {
    modoSeleccion,
    coordenadasSeleccionadas,
    activarSeleccion,
    desactivarSeleccion,
    limpiarSeleccion,
  } = useSeleccionUbicacion(mapRef, boundsCorrientes, setModalReseñaAbierto);

  const handleAbrirModalReseña = () => {
    limpiarSeleccion();
    setModalReseñaAbierto(true);
  };

  const handleSeleccionarUbicacion = () => {
    setModalReseñaAbierto(false); // Cerrar modal
    activarSeleccion(); // Activar modo selección
  };

  useEffect(() => {
    if (coordenadasSeleccionadas && !modalReseñaAbierto) {
      setModalReseñaAbierto(true); // Reabrir modal con coordenadas
    }
  }, [coordenadasSeleccionadas, modalReseñaAbierto]);

  const handleAgregarReseña = async (reseñaData) => {
    try {
      console.log("📤 Datos recibidos para guardar:", reseñaData);

      // 🔧 GUARDAR en Supabase con formato JSON
      const nuevaReseña = await crearReseña(reseñaData); // o crearReseñaSinAuth
      console.log("✅ Reseña guardada exitosamente:", nuevaReseña);

      // 🔧 Cerrar modal y limpiar después de guardar exitosamente
      setModalReseñaAbierto(false);
      limpiarSeleccion();

      // 🔧 Recargar reseñas en el mapa
      await cargarReseñasEnMapa(
        mapRef.current,
        setReseñaActiva,
        filtros,
        marcadoresReseñasRef
      );
    } catch (error) {
      console.error("❌ Error al enviar reseña:", error);
      // La modal manejará el error y no se cerrará
      throw error;
    }
  };

  const handleCerrarModal = () => {
    setModalReseñaAbierto(false);
    if (modoSeleccion) {
      desactivarSeleccion(); // Desactivar modo selección si está activo
    }
  };

  return (
    <div className="h-full w-full relative">
      {modoSeleccion && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-primario text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">
              Haz clic en el mapa para seleccionar ubicación
            </span>
            <button
              onClick={desactivarSeleccion}
              className="ml-2 text-white hover:text-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <PanelControlMapa
        boundsCorrientes={boundsCorrientes}
        alerta={alerta}
        setAlerta={setAlerta}
        mapRef={mapRef}
        cargandoUbicacion={cargandoUbicacion}
        onUbicacionActual={handleUbicacionActual}
        onAbrirModalReseña={handleAbrirModalReseña}
      />

      <CargandoMapa cargandoMapa={cargandoMapa} />

      <div
        ref={mapContainer}
        className={`w-full h-full transition-opacity duration-700 ease-in-out ${
          cargandoMapa ? "opacity-0" : "opacity-100"
        } ${modoSeleccion ? "cursor-crosshair" : ""}`}
        style={{
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
        }}
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
        onClose={handleCerrarModal}
        onEnviar={handleAgregarReseña}
        mapRef={mapRef}
        boundsCorrientes={boundsCorrientes}
        setAlerta={setAlerta}
        coordenadasSeleccionadas={coordenadasSeleccionadas}
        onSeleccionarUbicacion={handleSeleccionarUbicacion}
      />
    </div>
  );
};

export default memo(MapaInteractivo);
