import { useState, useEffect } from "react";
import { obtenerProveedores } from "../../../services/proveedores/obtenerProveedor";
import {
  IconX,
  IconMapPin,
  IconLoader2,
  IconCarambola,
  IconCarambolaFilled,
} from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainButton from "../../ui/MainButton";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import ModalContenedor from "../../ui/ModalContenedor";

import { obtenerCoordenadasSiEstanEnCorrientes } from "../../../services/mapa/ubicacion";
import { useAlerta } from "../../../context/AlertaContext";

const ModalAgregarReseña = ({
  isOpen,
  onClose,
  onEnviar,
  mapRef,
  boundsCorrientes,
  coordenadasSeleccionadas,
  onSeleccionarUbicacion,
  onUbicacionActual, // Nueva prop para manejar ubicación actual
}) => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("__disabled__");
  const [comentario, setComentario] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const { mostrarError } = useAlerta();
  const [errorProveedor, setErrorProveedor] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(false);
  const [errorComentario, setErrorComentario] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const usarUbicacionActual = async () => {
    setCargandoUbicacion(true);
    const coords = await obtenerCoordenadasSiEstanEnCorrientes(boundsCorrientes, mostrarError);
    if (coords) {
      // Usar la nueva prop si está disponible, sino usar la función original
      if (onUbicacionActual) {
        onUbicacionActual(coords);
      } else {
        onSeleccionarUbicacion(coords);
      }
      setUbicacionTexto("Ubicación actual");
      setErrorUbicacion(false);
    }
    setCargandoUbicacion(false);
  };

  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      setProveedores(data);
    };
    if (isOpen && proveedores.length === 0) {
      cargarProveedores();
    }
  }, [isOpen, proveedores.length]);

  useEffect(() => {
    if (isOpen && !coordenadasSeleccionadas) {
      setProveedorSeleccionado("__disabled__");
      setComentario("");
      setUbicacionTexto("");
      setEstrellas(5);
    }

    if (isOpen) {
      setErrorProveedor(false);
      setErrorUbicacion(false);
      setErrorComentario(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (coordenadasSeleccionadas) {
      convertirCoordenadasATexto(coordenadasSeleccionadas);
      setErrorUbicacion(false);
    }
  }, [coordenadasSeleccionadas]);

  const convertirCoordenadasATexto = async (coords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setUbicacionTexto(data.display_name);
      } else {
        setUbicacionTexto(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      }
    } catch (error) {
      setUbicacionTexto(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      console.error("Error al convertir coordenadas:", error);
    }
  };

  const handleStarClick = (rating) => {
    setEstrellas(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorProveedor(false);
    setErrorUbicacion(false);
    setErrorComentario(false);

    const proveedorInvalido = proveedorSeleccionado === "__disabled__";
    const ubicacionInvalida = !coordenadasSeleccionadas;
    const comentarioInvalido = !comentario.trim();

    if (proveedorInvalido) {
      setErrorProveedor(true);
      mostrarError("Debes seleccionar un proveedor.");
      return;
    }

    if (ubicacionInvalida) {
      setErrorUbicacion(true);
      mostrarError("Debes seleccionar una ubicación en el mapa.");
      return;
    }

    if (comentarioInvalido) {
      setErrorComentario(true);
      mostrarError("Debes escribir un comentario.");
      return;
    }

    setLoading(true);
    try {
      await onEnviar({
        comentario,
        estrellas,
        proveedor_id: proveedorSeleccionado,
        ubicacion: coordenadasSeleccionadas,
        ubicacionTexto,
      });
      onClose();
    } catch (e) {
      mostrarError("Error al publicar reseña");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Agregar reseña</MainH2>
        <MainButton onClick={onClose} type="button" variant="cross" title="Cerrar modal" className="px-0">
          <IconX size={24} />
        </MainButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label={
            <>
              Proveedor <span className="text-red-600">*</span>
            </>
          }
          value={proveedorSeleccionado}
          onChange={(id) => {
            setProveedorSeleccionado(id);
            setErrorProveedor(false);
          }}
          options={[{ id: "__disabled__", nombre: "Todos los Proveedores" }, ...proveedores]}
          getOptionValue={(p) => p.id}
          getOptionLabel={(p) => p.nombre}
          loading={proveedores.length === 0}
          isInvalid={errorProveedor}
          renderOption={(p) => (
            <option
              key={p.id}
              value={p.id}
              disabled={p.id === "__disabled__"}
              className="bg-fondo"
            >
              {p.nombre}
            </option>
          )}
        />

        {/* Ubicación */}
        <div className="space-y-2">
          <label className="block font-medium text-texto">
            Ubicación <span className="text-red-600">*</span>
          </label>
          {coordenadasSeleccionadas ? (
            <div className="bg-green-600/20 border border-green-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                <IconMapPin size={16} />
                Ubicación seleccionada
              </div>
              <p className="text-texto break-words font-medium">
                {ubicacionTexto ? (
                  ubicacionTexto
                ) : (
                  <span className="flex items-center gap-2 text-texto">
                    <IconLoader2 className="animate-spin" size={16} />
                    Cargando dirección...
                  </span>
                )}
              </p>
              <p className="text-texto/60 text-xs mt-1">
                Coordenadas: {coordenadasSeleccionadas.lat.toFixed(6)}, {coordenadasSeleccionadas.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <div
              className={`rounded-lg p-3 transition border ${
                errorUbicacion
                  ? "bg-red-500/10 border-red-500/50"
                  : "bg-texto/5 border-texto/15"
              }`}
            >
              <p className={`${errorUbicacion ? "text-red-400" : "text-texto/60"} mb-2`}>
                No has seleccionado una ubicación
              </p>
            </div>
          )}

          <MainButton
            type="button"
            onClick={onSeleccionarUbicacion}
            variant="primary"
            className={`w-full ${errorUbicacion ? "ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900" : ""}`}
            title="Seleccionar ubicación en el mapa"
            icon={IconMapPin}
          >
            {coordenadasSeleccionadas ? "Cambiar ubicación" : "Seleccionar en mapa"}
          </MainButton>

          <MainButton
            type="button"
            onClick={usarUbicacionActual}
            loading={cargandoUbicacion}
            variant="accent"
          >
            📍 Usar mi ubicación actual
          </MainButton>
        </div>

        {/* Estrellas */}
        <div>
          <label className="block font-medium text-texto mb-2">
            Calificación <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-1 text-yellow-600 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15 w-fit">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="text-2xl hover:scale-105 transition p-1"
                disabled={loading}
              >
                {star <= estrellas ? <IconCarambolaFilled size={24} /> : <IconCarambola size={24} />}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label={
            <>
              Comentario <span className="text-red-600">*</span>
            </>
          }
          name="comentario"
          value={comentario}
          onChange={(e) => {
            setComentario(e.target.value);
            setErrorComentario(false);
          }}
          placeholder="Escribe tu opinión..."
          isInvalid={errorComentario}
        />

        <div className="flex gap-3 pt-4">
          <MainButton type="button" variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </MainButton>
          <MainButton type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? "Publicando..." : "Publicar Reseña"}
          </MainButton>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-texto/50 italic">
            Los campos marcados con <span className="text-red-600">*</span> son obligatorios.
          </p>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalAgregarReseña;
