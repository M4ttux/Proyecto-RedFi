// components/mapa/UbicacionActual.jsx
import { useState } from "react";
import { IconCurrentLocation } from "@tabler/icons-react";
import { manejarUbicacionActual } from "../../services/mapa";
import MainButton from "../ui/MainButton";
import Alerta from "../ui/Alerta";

const UbicacionActual = ({ mapRef, boundsCorrientes }) => {
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [alerta, setAlerta] = useState("");

  const handleUbicacionActual = async () => {
    setCargandoUbicacion(true);
    setAlerta("");
    try {
      if (mapRef?.current) {
        await manejarUbicacionActual(
          boundsCorrientes,
          setAlerta,
          mapRef.current
        );
      } else {
        setAlerta("No se puede acceder al mapa en este momento.");
      }
    } catch (error) {
      setAlerta("No se pudo obtener tu ubicación.");
    } finally {
      setTimeout(() => setCargandoUbicacion(false), 1000);
    }
  };

  return (
    <div className="relative">
      <MainButton
        onClick={handleUbicacionActual}
        title="Ubicación actual"
        icon={IconCurrentLocation}
        type="button"
        variant="accent"
        className="w-full"
        loading={cargandoUbicacion}
      >
        Mi Ubicación
      </MainButton>

      {alerta && (
        <div className="absolute top-full left-0 w-full mt-2 z-50">
          <Alerta
            mensaje={alerta}
            tipo="error"
            onCerrar={() => setAlerta("")}
            flotante
          />
        </div>
      )}
    </div>
  );
};

export default UbicacionActual;
