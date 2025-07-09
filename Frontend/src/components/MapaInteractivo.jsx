import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
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

import MainButton from "./ui/MainButton";

const MapaInteractivo = ({ filtros, onMapRefReady }) => {
  const [alerta, setAlerta] = useState("");
  const [modalReseñaAbierto, setModalReseñaAbierto] = useState(false);
  const [modalReseñaCerradaManual, setModalReseñaCerradaManual] = useState(false);
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
    cargarReseñasIniciales,
  } = useMapaInteractivo(filtros, boundsCorrientes);

  useEffect(() => {
    if (mapRef?.current && onMapRefReady) {
      onMapRefReady(mapRef);
    }
  }, [mapRef, onMapRefReady]);

  const {
    modoSeleccion,
    coordenadasSeleccionadas,
    activarSeleccion,
    desactivarSeleccion,
    limpiarSeleccion,
  } = useSeleccionUbicacion(mapRef, boundsCorrientes, setModalReseñaAbierto);

  useEffect(() => {
    window.modoSeleccionActivo = modoSeleccion;
    return () => {
      window.modoSeleccionActivo = false;
    };
  }, [modoSeleccion]);

  const { cargandoUbicacion, handleUbicacionActual } = useUbicacionActual(
    boundsCorrientes,
    setAlerta,
    mapRef
  );

  const handleAbrirModalReseña = () => {
    limpiarSeleccion();
    setModalReseñaCerradaManual(false);
    setModalReseñaAbierto(true);
  };

  const handleSeleccionarUbicacion = () => {
    limpiarSeleccion();
    setModalReseñaAbierto(false);
    setModalReseñaCerradaManual(false);
    activarSeleccion();
  };

  useEffect(() => {
    if (
      coordenadasSeleccionadas &&
      !modalReseñaAbierto &&
      !modalReseñaCerradaManual
    ) {
      setModalReseñaAbierto(true);
    }
  }, [coordenadasSeleccionadas, modalReseñaAbierto, modalReseñaCerradaManual]);

  useEffect(() => {
  if (alerta) {
    const timeout = setTimeout(() => setAlerta(""), 4000); // o DURACION_ALERTA si lo tenés
    return () => clearTimeout(timeout);
  }
}, [alerta]);

  useEffect(() => {
  const handleAbrirModal = () => {
    handleAbrirModalReseña();
  };

  window.addEventListener("abrirModalAgregarReseña", handleAbrirModal);
  return () => {
    window.removeEventListener("abrirModalAgregarReseña", handleAbrirModal);
  };
}, []);

  const handleAgregarReseña = async (reseñaData) => {
    try {
      await crearReseña(reseñaData);
      setModalReseñaAbierto(false);
      limpiarSeleccion();
      await cargarReseñasIniciales(filtros);
    } catch (error) {
      console.error("❌ Error al enviar reseña:", error);
    }
  };

  const handleCerrarModal = () => {
    setModalReseñaAbierto(false);
    setModalReseñaCerradaManual(true);
    limpiarSeleccion();
    if (modoSeleccion) {
      desactivarSeleccion();
    }
  };

  return (
    <div className="h-full w-full relative">
      {modoSeleccion && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-primario text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium">Haz clic en el mapa para seleccionar ubicación</span>
            <MainButton type="button" onClick={desactivarSeleccion} variant="cross" className="px-0">
              <IconX size={24} />
            </MainButton>
          </div>
        </div>
      )}

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

      <ModalProveedor proveedor={proveedorActivo} onClose={() => setProveedorActivo(null)} navigate={navigate} />
      <ModalReseña reseña={reseñaActiva} onClose={() => setReseñaActiva(null)} />
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