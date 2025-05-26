/* import { useState, useEffect, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { obtenerProveedores } from "../../services/proveedorService";
import { estaEnCorrientes } from "../../services/mapa/mapaBase";
import {
  IconX,
  IconCurrentLocation,
  IconChevronDown,
} from "@tabler/icons-react";
import { useAlertaAnimada } from "../../hooks/useAlertaAnimada";

const ModalAgregarReseña = ({
  isOpen,
  onClose,
  onEnviar,
  mapRef,
  boundsCorrientes,
}) => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const { mostrarAlerta, animarAlerta } = useAlertaAnimada(alerta);

  const estrellasOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      setProveedores(data);
    };
    if (isOpen) cargarProveedores();
  }, [isOpen]);

  const manejarBuscarUbicacionActual = () => {
    setCargandoUbicacion(true);
    setAlerta("");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const address = data.address;
          const ciudad = address.city || address.town || address.village || "";
          const calle = address.road || "";
          const provincia = address.state || "";

          if (!estaEnCorrientes(longitude, latitude, boundsCorrientes)) {
            setAlerta(
              `Red-Fi solo está disponible en Corrientes. Estás en ${ciudad}, ${provincia}.`
            );
            setUbicacion("");
          } else {
            setUbicacion(`${calle}, ${ciudad}`);
            setAlerta("");
          }
        } catch (error) {
          setAlerta("No se pudo obtener la ubicación actual.");
        } finally {
          setCargandoUbicacion(false);
        }
      },
      () => {
        setAlerta("No se pudo obtener tu ubicación.");
        setCargandoUbicacion(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleInputChange = (value) => {
    setUbicacion(value);
    setAlerta("");

    if (debounceTimeout) clearTimeout(debounceTimeout);

    setDebounceTimeout(
      setTimeout(() => {
        if (value.trim().length > 2) {
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value + ", Corrientes, Argentina"
            )}&addressdetails=1&limit=5`
          )
            .then((res) => res.json())
            .then((data) => setSugerencias(data))
            .catch(() => setAlerta("Error buscando sugerencias."));
        } else {
          setSugerencias([]);
        }
      }, 200)
    );
  };

  const handleSeleccionSugerencia = (sug) => {
    setUbicacion(sug.display_name);
    setSugerencias([]);
    setAlerta("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim() || !proveedorSeleccionado) {
      setAlerta("Debes completar todos los campos.");
      return;
    }

    onEnviar({
      comentario,
      estrellas,
      proveedor_id: proveedorSeleccionado.id,
      ubicacion,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-fondo p-6 rounded-xl w-[95vw] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-texto hover:text-acento"
        >
          <IconX size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-texto">Agregar Reseña</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-texto">Proveedor</p>
            <Listbox
              value={proveedorSeleccionado}
              onChange={setProveedorSeleccionado}
            >
              {({ open }) => (
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer bg-texto/10 text-texto py-2 pl-3 pr-10 text-left shadow-md rounded-lg text-sm">
                    <span className="block truncate">
                      {proveedorSeleccionado
                        ? proveedorSeleccionado.nombre
                        : "Selecciona un proveedor"}
                    </span>
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <IconChevronDown />
                    </div>
                  </ListboxButton>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions
                      modal={false}
                      className="absolute z-50 max-h-48 w-full overflow-auto bg-fondo text-texto py-1 shadow-lg rounded-lg focus:outline-none text-sm scrollbar-thin"
                    >
                      {proveedores.map((p) => (
                        <ListboxOption
                          key={p.id}
                          className={({ active }) =>
                            `${
                              active ? "bg-acento text-white" : "text-texto"
                            } relative cursor-pointer select-none py-2 pl-3 pr-4`
                          }
                          value={p}
                        >
                          {({ selected }) => (
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {p.nombre}
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          
          <div>
            <label className="block text-sm mb-1">Ubicación</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-1 p-2 rounded bg-secundario text-texto"
                placeholder="Ejemplo: San Martín 123, Corrientes"
              />
              <button
                type="button"
                onClick={manejarBuscarUbicacionActual}
                className={`px-3 py-1 rounded text-white flex items-center justify-center ${
                  cargandoUbicacion
                    ? "bg-gray-500"
                    : "bg-primario hover:bg-acento"
                }`}
                disabled={cargandoUbicacion}
              >
                <IconCurrentLocation size={18} />
              </button>
            </div>
            {sugerencias.length > 0 && (
              <ul className="bg-fondo border border-white/10 rounded-md mt-2 max-h-32 overflow-auto text-sm">
                {sugerencias.map((sug, index) => (
                  <li
                    key={index}
                    onClick={() => handleSeleccionSugerencia(sug)}
                    className="px-3 py-2 cursor-pointer hover:bg-white/10"
                  >
                    {sug.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {mostrarAlerta && (
            <p
              className={`text-sm text-red-400 transition-opacity duration-500 ${
                animarAlerta ? "opacity-100" : "opacity-0"
              }`}
            >
              {alerta}
            </p>
          )}

          
          <div className="space-y-1">
            <p className="text-sm font-medium text-texto">Estrellas</p>
            <Listbox value={estrellas} onChange={setEstrellas}>
              {({ open }) => (
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer bg-texto/10 text-texto py-2 pl-3 pr-10 text-left shadow-md rounded-lg text-sm">
                    <span className="block truncate">{estrellas}★</span>
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <IconChevronDown />
                    </div>
                  </ListboxButton>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions
                      modal={false}
                      className="absolute z-50 max-h-48 w-full overflow-auto bg-fondo text-texto py-1 shadow-lg rounded-lg focus:outline-none text-sm scrollbar-thin"
                    >
                      {estrellasOptions.map((e) => (
                        <ListboxOption
                          key={e}
                          className={({ active }) =>
                            `${
                              active ? "bg-acento text-white" : "text-texto"
                            } relative cursor-pointer select-none py-2 pl-3 pr-4`
                          }
                          value={e}
                        >
                          {({ selected }) => (
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {e}★
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div>
            <label className="block text-sm mb-1">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-2 rounded bg-secundario text-texto"
              placeholder="Escribe tu opinión..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primario text-white py-2 rounded hover:bg-acento"
          >
            Enviar Reseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarReseña; */


import { useState, useEffect, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { obtenerProveedores } from "../../services/proveedorService";
import {
  IconX,
  IconMapPin,
  IconChevronDown,
} from "@tabler/icons-react";
import { useAlertaAnimada } from "../../hooks/useAlertaAnimada";

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
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState(""); //   RENOMBRADO
  const [estrellas, setEstrellas] = useState(5);
  const [alerta, setAlerta] = useState("");

  const { mostrarAlerta, animarAlerta } = useAlertaAnimada(alerta);
  const estrellasOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      setProveedores(data);
    };
    if (isOpen) cargarProveedores();
  }, [isOpen]);

  // Efecto para manejar coordenadas seleccionadas
  useEffect(() => {
    if (coordenadasSeleccionadas) {
      // Convertir coordenadas a texto legible
      convertirCoordenadasATexto(coordenadasSeleccionadas);
    }
  }, [coordenadasSeleccionadas]);

  // Convertir coordenadas a dirección
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

  // Manejar selección en mapa
  const handleSeleccionarEnMapa = () => {
    setAlerta("");
    onSeleccionarUbicacion(); // Cerrar modal y activar modo selección
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
      proveedor_id: proveedorSeleccionado.id,
      ubicacion: coordenadasSeleccionadas, // Enviar coordenadas
      ubicacionTexto, // Enviar texto de ubicación
    });

    // Limpiar formulario
    setComentario("");
    setProveedorSeleccionado(null);
    setUbicacionTexto("");
    setEstrellas(5);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-fondo p-6 rounded-xl w-[95vw] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-texto hover:text-acento"
        >
          <IconX size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-texto">Agregar Reseña</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Proveedor */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-texto">Proveedor</p>
            <Listbox
              value={proveedorSeleccionado}
              onChange={setProveedorSeleccionado}
            >
              {({ open }) => (
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer bg-texto/10 text-texto py-2 pl-3 pr-10 text-left shadow-md rounded-lg text-sm">
                    <span className="block truncate">
                      {proveedorSeleccionado
                        ? proveedorSeleccionado.nombre
                        : "Selecciona un proveedor"}
                    </span>
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <IconChevronDown />
                    </div>
                  </ListboxButton>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions
                      modal={false}
                      className="absolute z-50 max-h-48 w-full overflow-auto bg-fondo text-texto py-1 shadow-lg rounded-lg focus:outline-none text-sm scrollbar-thin"
                    >
                      {proveedores.map((p) => (
                        <ListboxOption
                          key={p.id}
                          className={({ active }) =>
                            `${
                              active ? "bg-acento text-white" : "text-texto"
                            } relative cursor-pointer select-none py-2 pl-3 pr-4`
                          }
                          value={p}
                        >
                          {({ selected }) => (
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {p.nombre}
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          {/* SECCIÓN: Selección de Ubicación */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-texto">Ubicación</label>
            
            {/* Mostrar ubicación seleccionada */}
            {coordenadasSeleccionadas ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
                  <IconMapPin size={16} />
                  Ubicación seleccionada
                </div>
                <p className="text-texto text-sm break-words">
                  {ubicacionTexto || "Cargando dirección..."}
                </p>
                <p className="text-texto/60 text-xs mt-1">
                  {coordenadasSeleccionadas.lat.toFixed(6)}, {coordenadasSeleccionadas.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="bg-texto/5 border border-texto/20 rounded-lg p-3">
                <p className="text-texto/60 text-sm mb-2">
                  No has seleccionado una ubicación
                </p>
              </div>
            )}

            {/* Botón para seleccionar en mapa */}
            <button
              type="button"
              onClick={handleSeleccionarEnMapa}
              className="w-full bg-primario hover:bg-acento text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <IconMapPin size={18} />
              {coordenadasSeleccionadas ? "Cambiar ubicación" : "Seleccionar en mapa"}
            </button>
          </div>

          {/* Alerta */}
          {mostrarAlerta && (
            <p
              className={`text-sm text-red-400 transition-opacity duration-500 ${
                animarAlerta ? "opacity-100" : "opacity-0"
              }`}
            >
              {alerta}
            </p>
          )}

          {/* Select Estrellas */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-texto">Estrellas</p>
            <Listbox value={estrellas} onChange={setEstrellas}>
              {({ open }) => (
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer bg-texto/10 text-texto py-2 pl-3 pr-10 text-left shadow-md rounded-lg text-sm">
                    <span className="block truncate">{estrellas}★</span>
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <IconChevronDown />
                    </div>
                  </ListboxButton>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions
                      modal={false}
                      className="absolute z-50 max-h-48 w-full overflow-auto bg-fondo text-texto py-1 shadow-lg rounded-lg focus:outline-none text-sm scrollbar-thin"
                    >
                      {estrellasOptions.map((e) => (
                        <ListboxOption
                          key={e}
                          className={({ active }) =>
                            `${
                              active ? "bg-acento text-white" : "text-texto"
                            } relative cursor-pointer select-none py-2 pl-3 pr-4`
                          }
                          value={e}
                        >
                          {({ selected }) => (
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {e}★
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm mb-1 font-medium text-texto">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-2 rounded bg-secundario text-texto"
              placeholder="Escribe tu opinión..."
              rows={3}
            />
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            className="w-full bg-primario text-white py-2 rounded hover:bg-acento transition-colors"
          >
            Enviar Reseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarReseña;
