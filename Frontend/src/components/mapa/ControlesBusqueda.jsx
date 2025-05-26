import { useState } from "react";

const ControlesBusqueda = ({
  input,
  setInput,
  buscarUbicacion,
  boundsCorrientes,
  setAlerta,
  mapRef,
  sugerencias,
  setSugerencias,
}) => {
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
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
            .catch((err) => console.error("Error en autocompletar:", err));
        } else {
          setSugerencias([]);
        }
      }, 150)
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-sm text-texto">Buscar ubicación</p>
      </div>

      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          buscarUbicacion(input, boundsCorrientes, setAlerta, mapRef.current)
        }
        placeholder="Buscar en Corrientes..."
        className="px-3 py-2 rounded w-full bg-fondo text-sm text-texto placeholder-gray-400"
      />

      {input && sugerencias.length > 0 && (
        <ul className="bg-fondo border border-white/10 rounded-md mt-1 max-h-40 overflow-auto text-sm">
          {sugerencias.map((sug, index) => (
            <li
              key={index}
              onClick={() => {
                setInput(sug.display_name);
                setSugerencias([]);
                buscarUbicacion(
                  sug.display_name,
                  boundsCorrientes,
                  setAlerta,
                  mapRef.current
                );
              }}
              className="px-3 py-2 cursor-pointer hover:bg-white/10"
            >
              {sug.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ControlesBusqueda;
