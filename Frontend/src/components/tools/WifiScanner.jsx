import { useEffect, useRef, useState } from "react";
import MainH2 from "../ui/MainH2";
import MainH3 from "../ui/MainH3";
import MainButton from "../ui/MainButton";
import Select from "../ui/Select";
import Alerta from "../ui/Alerta";

const ZONAS = ["Seleccionar una zona", "Pieza", "Living", "Segundo piso"];

const WifiScanner = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [resultados, setResultados] = useState({});
  const [recomendacion, setRecomendacion] = useState("");
  const [alertaError, setAlertaError] = useState("");
  const [enProgreso, setEnProgreso] = useState(false);
  const medidorRef = useRef(null);
  const testActivo = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/speedtest/speedtest.js";
    script.async = true;
    script.onload = () => {
      if (window.Speedtest) {
        medidorRef.current = new window.Speedtest();
        console.log("✅ Speedtest inicializado");
      } else {
        console.error("❌ Speedtest.js no se cargó correctamente.");
      }
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const medirZona = () => {
    if (!zonaSeleccionada || zonaSeleccionada === "Seleccionar una zona") {
      setAlertaError("Debés seleccionar una zona antes de medir.");
      return;
    }

    if (!medidorRef.current) return;

    if (testActivo.current && testActivo.current._state !== 4) {
      testActivo.current.abort();
    }

    const t = new window.Speedtest();
    testActivo.current = t;
    let datosSeteados = false;
    setEnProgreso(true);

    t.onupdate = (data) => {
      if (data.testState === 4 && !datosSeteados) {
        setResultados((prev) => ({
          ...prev,
          [zonaSeleccionada]: {
            ping: parseFloat(data.pingStatus) || 0,
            jitter: parseFloat(data.jitterStatus) || 0,
          },
        }));
        datosSeteados = true;
        t.abort();
        setEnProgreso(false);
      }
    };

    t.onerror = (err) => {
      console.error("❌ Error al medir:", err);
      setEnProgreso(false);
    };

    t.onend = () => {
      console.log("✅ Test finalizado");
      setEnProgreso(false);
    };

    t.start();
  };

  const recomendarUbicacion = () => {
    if (Object.keys(resultados).length < 2) {
      setRecomendacion(
        "Medí al menos dos zonas para obtener una recomendación."
      );
      return;
    }

    const mejor = Object.entries(resultados).sort(([, a], [, b]) => {
      return a.ping + a.jitter - (b.ping + b.jitter);
    })[0];

    setRecomendacion(
      `Mejor ubicación: ${mejor[0]} (Ping: ${mejor[1].ping} ms, Jitter: ${mejor[1].jitter} ms)`
    );
  };

  const reiniciarAnalisis = () => {
    setResultados({});
    setRecomendacion("");
    setZonaSeleccionada("");
    setAlertaError("");
  };

  const eliminarZona = (zona) => {
    const nuevosResultados = { ...resultados };
    delete nuevosResultados[zona];
    setResultados(nuevosResultados);
  };

  return (
    <div className="p-6 rounded-lg mx-auto text-white max-w-2xl relative">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4 text-center">
        <Select
          name="zona"
          value={zonaSeleccionada}
          onChange={(val) => {
            setZonaSeleccionada(val);
            setAlertaError("");
          }}
          options={ZONAS}
          getOptionValue={(opt) => opt}
          getOptionLabel={(opt) => opt}
          isInvalid={!!alertaError}
        />

        <MainButton
          onClick={medirZona}
          disabled={enProgreso}
          loading={enProgreso}
        >
          Medir conexión
        </MainButton>
      </div>

      {alertaError && (
        <div className="mt-4">
          <Alerta
            mensaje={alertaError}
            tipo="error"
            onCerrar={() => setAlertaError("")}
          />
        </div>
      )}

      {Object.keys(resultados).length > 0 && (
        <div className="mt-6 text-left">
          <MainH3>Resultados:</MainH3>
          <ul className="space-y-2">
            {Object.entries(resultados).map(([zona, datos]) => (
              <li
                key={zona}
                className="bg-gray-800 p-3 rounded flex justify-between items-center"
              >
                <span>
                  <strong>{zona}:</strong> Ping: {datos.ping} ms | Jitter:{" "}
                  {datos.jitter} ms
                </span>
                <MainButton
                  onClick={() => eliminarZona(zona)}
                  variant="delete"
                  iconSize={18}
                  className="p-1"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-4">
        <MainButton onClick={recomendarUbicacion} variant="accent">
          Recomendar ubicación
        </MainButton>

        <MainButton onClick={reiniciarAnalisis} variant="danger">
          Reiniciar análisis
        </MainButton>
      </div>

      {recomendacion && (
        <div className="mt-6">
          <Alerta
            mensaje={recomendacion}
            tipo="info"
            onCerrar={() => setRecomendacion("")}
            autoOcultar={true}
            flotante={false}
          />
        </div>
      )}
    </div>
  );
};

export default WifiScanner;
