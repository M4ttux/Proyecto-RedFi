import { useState, useEffect } from "react";
import { obtenerProveedores } from "../../services/proveedorService";
import { IconX, IconMapPin } from "@tabler/icons-react";
import MainH2 from "../ui/MainH2";
import MainButton from "../ui/MainButton";
import Select from "../ui/Select";
import Alerta from "../ui/Alerta";

const ModalAgregarReseña = ({
  isOpen,
  onClose,
  onEnviar,
  mapRef,
  boundsCorrientes,
  coordenadasSeleccionadas,
  onSeleccionarUbicacion,
}) => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [comentario, setComentario] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [alerta, setAlerta] = useState("");

  const estrellasOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      setProveedores(data);
    };
    if (isOpen) cargarProveedores();
  }, [isOpen]);

  useEffect(() => {
    if (coordenadasSeleccionadas) {
      convertirCoordenadasATexto(coordenadasSeleccionadas);
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
      setAlerta("");
    } catch (error) {
      setUbicacionTexto(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      console.error("Error al convertir coordenadas:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim() || !proveedorSeleccionado) {
      setAlerta("Debes completar todos los campos.");
      return;
    }
    if (!coordenadasSeleccionadas) {
      setAlerta("Debes seleccionar una ubicación en el mapa.");
      return;
    }

    onEnviar({
      comentario,
      estrellas,
      proveedor_id: proveedorSeleccionado,
      ubicacion: coordenadasSeleccionadas,
      ubicacionTexto,
    });

    setComentario("");
    setProveedorSeleccionado("");
    setUbicacionTexto("");
    setEstrellas(5);
    onClose();
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
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-gray-900 p-6 rounded-lg w-[95vw] max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
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
          <Select
            label="Proveedor *"
            value={proveedorSeleccionado}
            onChange={(id) => setProveedorSeleccionado(id)}
            options={[
              { id: "__disabled__", nombre: "Todos los Proveedores" },
              ...proveedores,
            ]}
            getOptionValue={(p) => p.id}
            getOptionLabel={(p) => p.nombre}
            required
            className="disabled:opacity-50"
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

          <div className="space-y-2">
            <label className="block font-medium text-texto">Ubicación *</label>
            {coordenadasSeleccionadas ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-400 font-medium mb-1">
                  <IconMapPin size={16} />
                  Ubicación seleccionada
                </div>
                <p className="text-texto break-words">
                  {ubicacionTexto || "Cargando dirección..."}
                </p>
                <p className="text-texto/60 text-xs mt-1">
                  {coordenadasSeleccionadas.lat.toFixed(6)},{" "}
                  {coordenadasSeleccionadas.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="bg-texto/5 border border-texto/20 rounded-lg p-3">
                <p className="text-texto/60 mb-2">
                  No has seleccionado una ubicación
                </p>
              </div>
            )}
            <MainButton
              type="button"
              onClick={onSeleccionarUbicacion}
              variant="primary"
              className="w-full"
              title="Seleccionar ubicación en el mapa"
              icon={IconMapPin}
            >
              {coordenadasSeleccionadas
                ? "Cambiar ubicación"
                : "Seleccionar en mapa"}
            </MainButton>
          </div>

          <Select
            label="Estrellas *"
            value={estrellas}
            required
            onChange={setEstrellas}
            options={estrellasOptions}
            getOptionValue={(e) => e}
            getOptionLabel={(e) => `${e}★`}
          />

          <div>
            <label className="block mb-1 font-medium text-texto">
              Comentario *
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-2 rounded bg-secundario text-texto"
              placeholder="Escribe tu opinión..."
              required
              rows={3}
            />
          </div>

          <MainButton type="submit" variant="primary" className="w-full">
            Enviar Reseña
          </MainButton>

          <Alerta
            mensaje={alerta}
            tipo="error" // o "exito", "info", "advertencia"
            onCerrar={() => setAlerta("")}
          />
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarReseña;
