import { useState, useEffect } from "react";
import { obtenerProveedores } from "../../../services/proveedores/obtenerProveedor";
import {
  obtenerProveedoresPorZona,
  determinarZonaPorCoordenadas,
} from "../../../services/proveedores/obtenerProveedoresPorZona";
import {
  IconX,
  IconMapPin,
  IconLoader2,
  IconCarambola,
  IconCarambolaFilled,
  IconHandFinger,
  IconCheck,
  IconCircleNumber1,
  IconCircleNumber2,
  IconCircleNumber3,
} from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainH3 from "../../ui/MainH3";
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
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState("__disabled__");
  const [comentario, setComentario] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const { mostrarError } = useAlerta();
  const [errorProveedor, setErrorProveedor] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(false);
  const [errorComentario, setErrorComentario] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [zonaDetectada, setZonaDetectada] = useState(null);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(false);

  const usarUbicacionActual = async () => {
    setCargandoUbicacion(true);
    const coords = await obtenerCoordenadasSiEstanEnCorrientes(
      boundsCorrientes,
      mostrarError
    );
    if (coords) {
      // Usar la nueva prop si está disponible, sino usar la función original
      if (onUbicacionActual) {
        onUbicacionActual(coords);
      } else {
        onSeleccionarUbicacion(coords);
      }
      setUbicacionTexto("Ubicación actual");
      setErrorUbicacion(false);
      setUbicacionSeleccionada(true);

      // Detectar zona y cargar proveedores
      await detectarZonaYCargarProveedores(coords);
    }
    setCargandoUbicacion(false);
  };

  const detectarZonaYCargarProveedores = async (coords) => {
    try {
      setCargandoProveedores(true);

      // Detectar la zona basada en las coordenadas
      const zona = await determinarZonaPorCoordenadas(
        coords.lat,
        coords.lng,
        mostrarError
      );
      setZonaDetectada(zona);

      if (!zona || !zona.id) {
        // Limpiar proveedores si no hay zona válida
        setProveedores([]);
        mostrarError("Esta ubicación está fuera del área de cobertura. Selecciona una ubicación dentro de Corrientes.");
        return;
      }

      // Cargar proveedores de esa zona específica
      const proveedoresZona = await obtenerProveedoresPorZona(
        zona.id,
        mostrarError
      );
      setProveedores(proveedoresZona);
    } catch (error) {
      setProveedores([]);
      mostrarError("Error al cargar proveedores de la zona");
    } finally {
      setCargandoProveedores(false);
    }
  };

  // Remover el useEffect que cargaba todos los proveedores
  // Ahora solo cargamos proveedores después de seleccionar ubicación

  useEffect(() => {
    if (isOpen && !coordenadasSeleccionadas) {
      setProveedorSeleccionado("__disabled__");
      setComentario("");
      setUbicacionTexto("");
      setEstrellas(5);
      setUbicacionSeleccionada(false);
      setZonaDetectada(null);
      setProveedores([]);
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
      setUbicacionSeleccionada(true);

      // Detectar zona y cargar proveedores cuando se selecciona desde el mapa
      detectarZonaYCargarProveedores(coordenadasSeleccionadas);
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
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Paso 1: Ubicación */}
        <div className="space-y-4">
          <MainH3 icon={IconCircleNumber1} className="text-lg">
            Selecciona tu ubicación
          </MainH3>
          <p className="text-texto text-sm mb-3">
            Primero debes seleccionar dónde te encuentras para mostrar los
            proveedores disponibles en tu zona.
          </p>

          {coordenadasSeleccionadas ? (
            <div className={`rounded-lg p-3 mb-3 ${
              zonaDetectada 
                ? "bg-green-600/20 border border-green-700/50" 
                : "bg-red-600/20 border border-red-700/50"
            }`}>
              <div className={`flex items-center gap-2 font-bold mb-1 ${
                zonaDetectada ? "text-green-700" : "text-red-700"
              }`}>
                <IconCheck size={16} />
                {zonaDetectada ? "Ubicación seleccionada" : "Ubicación fuera del área"}
              </div>
              <p
                className="text-texto break-words font-medium line-clamp-1"
                title={ubicacionTexto}
              >
                {ubicacionTexto ? (
                  ubicacionTexto
                ) : (
                  <span className="flex items-center gap-2 text-texto">
                    <IconLoader2 className="animate-spin" size={16} />
                    Cargando dirección...
                  </span>
                )}
              </p>
              {zonaDetectada ? (
                <p className="text-texto/75 text-sm mt-1 font-medium">
                  Zona detectada: {zonaDetectada.departamento}
                </p>
              ) : (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  Fuera del área de cobertura
                </p>
              )}
              <p className="text-texto/50 text-xs mt-1">
                Coordenadas: {coordenadasSeleccionadas.lat.toFixed(6)},{" "}
                {coordenadasSeleccionadas.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <div
              className={`rounded-lg p-3 transition border mb-3 ${
                errorUbicacion
                  ? "bg-red-500/10 border-red-500/50"
                  : "bg-texto/5 border-texto/15"
              }`}
            >
              <p
                className={`${
                  errorUbicacion ? "text-red-400" : "text-texto/75"
                } mb-2`}
              >
                No has seleccionado una ubicación
              </p>
            </div>
          )}

          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <MainButton
                type="button"
                onClick={onSeleccionarUbicacion}
                variant="primary"
                className={`w-full ${
                  errorUbicacion
                    ? "ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900"
                    : ""
                }`}
                title="Seleccionar ubicación en el mapa"
                icon={IconHandFinger}
              >
                {coordenadasSeleccionadas
                  ? "Cambiar ubicación"
                  : "Seleccionar en mapa"}
              </MainButton>
            </div>
            <div className="flex-1">
              <MainButton
                type="button"
                onClick={usarUbicacionActual}
                loading={cargandoUbicacion}
                variant="accent"
                icon={IconMapPin}
                className={`w-full ${
                  errorUbicacion
                    ? "ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900"
                    : ""
                }`}
              >
                Mi ubicación
              </MainButton>
            </div>
          </div>
        </div>

        {/* Paso 2: Proveedor (solo se muestra después de seleccionar ubicación válida) */}
        {ubicacionSeleccionada && zonaDetectada && (
          <div className="space-y-4">
            <MainH3 icon={IconCircleNumber2} className="text-lg">
              Elige el proveedor
            </MainH3>
            <p className="text-texto text-sm mb-3">
              Selecciona el proveedor de internet que quieres reseñar en esta
              zona.
            </p>

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
              options={[
                {
                  id: "__disabled__",
                  nombre: `Selecciona un proveedor ${
                    zonaDetectada ? `en ${zonaDetectada.departamento}` : ""
                  }`,
                },
                ...proveedores,
              ]}
              getOptionValue={(p) => p.id}
              getOptionLabel={(p) => p.nombre}
              loading={cargandoProveedores}
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

            {cargandoProveedores && (
              <div className="flex items-center gap-2 text-primario mt-2">
                <IconLoader2 className="animate-spin" size={16} />
                <span className="text-sm">
                  Cargando proveedores de la zona...
                </span>
              </div>
            )}

            {!cargandoProveedores &&
              proveedores.length === 0 &&
              ubicacionSeleccionada && (
                <div className={`rounded-lg p-3 mt-3 ${
                  zonaDetectada 
                    ? "bg-yellow-600/20 border border-yellow-600/50" 
                    : "bg-red-600/20 border border-red-600/50"
                }`}>
                  <p className={`text-sm ${
                    zonaDetectada ? "text-yellow-700" : "text-red-700"
                  }`}>
                    {zonaDetectada 
                      ? "No se encontraron proveedores en esta zona. Los proveedores se mostrarán cuando estén disponibles."
                      : "Esta ubicación está fuera del área de cobertura. Selecciona una ubicación dentro de las zonas de Corrientes para ver proveedores disponibles."
                    }
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Paso 3: Calificación y comentario (solo se muestra después de seleccionar proveedor) */}
        {ubicacionSeleccionada && zonaDetectada && proveedorSeleccionado !== "__disabled__" && (
          <div className="space-y-4">
            <MainH3 icon={IconCircleNumber3} className="text-lg">
              Califica tu experiencia
            </MainH3>

            {/* Estrellas */}
            <div className="mb-4">
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
                    {star <= estrellas ? (
                      <IconCarambolaFilled size={24} />
                    ) : (
                      <IconCarambola size={24} />
                    )}
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
              placeholder="Escribe tu opinión sobre este proveedor..."
              isInvalid={errorComentario}
            />
          </div>
        )}

        {/* Botones de acción solo cuando se puede completar */}
        {ubicacionSeleccionada && zonaDetectada && proveedorSeleccionado !== "__disabled__" && (
          <>
            <div className="flex gap-3 pt-4">
              <MainButton
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </MainButton>
              <MainButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Publicando..." : "Publicar Reseña"}
              </MainButton>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-texto/50 italic">
                Los campos marcados con <span className="text-red-600">*</span>{" "}
                son obligatorios.
              </p>
            </div>
          </>
        )}

        {/* Botón para cerrar si no se ha completado el flujo */}
        {!(
          ubicacionSeleccionada && zonaDetectada && proveedorSeleccionado !== "__disabled__"
        ) && (
          <div className="flex justify-center pt-4">
            <MainButton
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-32"
            >
              Cerrar
            </MainButton>
          </div>
        )}
      </form>
    </ModalContenedor>
  );
};

export default ModalAgregarReseña;
