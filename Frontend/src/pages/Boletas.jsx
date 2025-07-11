import { useEffect, useState } from "react";
import { obtenerBoletasDelUsuario } from "../services/boletasService";
import BoletaForm from "../components/boletas/BoletaForm";
import BoletaHistorial from "../components/boletas/BoletaHistorial";
import BoletasLayout from "../components/boletas/BoletasLayout";
import { useNotificaciones } from "../components/layout/Navbar";
import MainButton from "../components/ui/MainButton";
import Alerta from "../components/ui/Alerta";

const Boletas = () => {
  useEffect(() => {
    document.title = "Red-Fi | Boletas";
  }, []);
  const [boletas, setBoletas] = useState([]);
  const [vista, setVista] = useState("historial"); // "formulario" o "historial"
  const { cargarNotificaciones } = useNotificaciones();

  const cargarBoletas = async () => {
    const data = await obtenerBoletasDelUsuario();
    setBoletas(data);
  };

  useEffect(() => {
    cargarBoletas();
  }, []);

  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });

  return (
    <BoletasLayout>
      {alerta.mensaje && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alerta
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
            onCerrar={() => setAlerta({ tipo: "", mensaje: "" })}
            flotante={true}
          />
        </div>
      )}
      <div className="flex gap-4 justify-center mb-8">
        <MainButton
          variant="toggle"
          active={vista === "formulario"}
          onClick={() => setVista("formulario")}
        >
          Nueva Boleta
        </MainButton>
        <MainButton
          variant="toggle"
          active={vista === "historial"}
          onClick={() => setVista("historial")}
        >
          Ver Historial
        </MainButton>
      </div>

      {vista === "formulario" ? (
        <BoletaForm
          onBoletaAgregada={cargarBoletas}
          onActualizarNotificaciones={cargarNotificaciones}
          setAlerta={setAlerta}
          setVista={setVista}
        />
      ) : (
        <BoletaHistorial
          boletas={boletas}
          recargarBoletas={cargarBoletas}
          setAlerta={setAlerta}
        />
      )}
    </BoletasLayout>
  );
};

export default Boletas;
