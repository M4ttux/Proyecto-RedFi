import { useState, useCallback } from "react";
import { buscarUbicacion } from "../services/mapa";

const API_KEY = "195f05dc4c614f52ac0ac882ee570395";

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
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value + ", Corrientes, Argentina")}&key=${API_KEY}&limit=5`
          )
            .then((res) => res.json())
            .then((data) => {
              setSugerencias(data.results || []);
            })
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
    setInput(sugerencia.formatted);
    setSugerencias([]);
    buscarUbicacion(sugerencia.formatted, boundsCorrientes, setAlerta, mapRef.current);
  };

  return {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
  };
};
