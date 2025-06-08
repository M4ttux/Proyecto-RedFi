import React, { useState } from 'react';
import speedtest from '../services/speedtest';

const SpeedTest = () => {
  const [velocidad, setVelocidad] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const medirVelocidad = async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await speedtest.getSpeed();
      setVelocidad(resultado.toFixed(2));
    } catch (err) {
      setError("Error al medir velocidad.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg max-w-md mx-auto text-center">
      <h2 className="text-3xl lg:text-4xl font-bold mb-4">Test de Velocidad</h2>
      <button 
        className="bg-primario px-4 py-2 rounded hover:bg-primario/80" 
        onClick={medirVelocidad}
      >
        {cargando ? 'Midiendo...' : 'Iniciar Test'}
      </button>

      {velocidad && (
        <p className="mt-4 text-green-600 font-semibold text-lg">
          Velocidad: {velocidad} Mbps
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SpeedTest;
