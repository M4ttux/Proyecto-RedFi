import React, { useEffect, useState } from "react";
import MainH3 from "../ui/MainH3";
import { useTheme } from "../../context/ThemeContext";

const DetectorProveedor = () => {
  const { currentTheme } = useTheme();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://ipwhois.app/json/")
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch(() => setError("No se pudo obtener la información de red."));
  }, []);

  return (
    <div
      className={`p-6 max-w-xl mx-auto text-center rounded-lg ${
        currentTheme === "light"
                ? "bg-white/50 border border-white/50 shadow-lg"
                : "bg-white/5 border border-white/10"
            }`}
          >
      <MainH3 className="text-center justify-center">Tu conexión actual</MainH3>

      {error && <p className="text-red-600">{error}</p>}

      {datos && (
        <div className="space-y-2">
          <p>
            <strong>Proveedor (ISP):</strong> {datos.isp}
          </p>
          <p>
            <strong>IP pública:</strong> {datos.ip}
          </p>
          <p>
            <strong>Ciudad:</strong> {datos.city}
          </p>
          <p>
            <strong>Región:</strong> {datos.region}
          </p>
          <p>
            <strong>País:</strong> {datos.country}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetectorProveedor;
