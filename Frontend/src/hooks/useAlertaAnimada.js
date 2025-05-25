import { useState, useEffect } from "react";
import { DURACION_ALERTA } from "../constantes";

export const useAlertaAnimada = (alerta) => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [animarAlerta, setAnimarAlerta] = useState(false);

  useEffect(() => {
    if (alerta) {
      setMostrarAlerta(true);
      const fadeIn = setTimeout(() => setAnimarAlerta(true), 10);
      const fadeOut = setTimeout(() => setAnimarAlerta(false), DURACION_ALERTA);
      const remove = setTimeout(() => setMostrarAlerta(false), DURACION_ALERTA + 500);

      return () => {
        clearTimeout(fadeIn);
        clearTimeout(fadeOut);
        clearTimeout(remove);
      };
    }
  }, [alerta]);

  return { mostrarAlerta, animarAlerta };
};
