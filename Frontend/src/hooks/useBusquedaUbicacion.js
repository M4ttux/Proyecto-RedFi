import { useState, useCallback } from "react";
import { buscarUbicacion } from "../services/mapa";

export const useBusquedaUbicacion = (boundsCorrientes, setAlerta, mapRef) => {
  const [input, setInput] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const buscarSugerencias = useCallback((value) => {
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
  }, [debounceTimeout]);

  const handleInputChange = (value) => {
    setInput(value);
    buscarSugerencias(value);
  };

  const handleBuscar = () => {
    buscarUbicacion(input, boundsCorrientes, setAlerta, mapRef.current);
  };

  const handleSeleccionarSugerencia = (sugerencia) => {
    setInput(sugerencia.display_name);
    setSugerencias([]);
    buscarUbicacion(sugerencia.display_name, boundsCorrientes, setAlerta, mapRef.current);
  };

  return {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
  };
};
