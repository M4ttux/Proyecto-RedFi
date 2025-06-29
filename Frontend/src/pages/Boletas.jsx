import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import BoletaForm from "../components/boletas/BoletaForm";
import BoletaHistorial from "../components/boletas/BoletaHistorial";
import BoletasLayout from "../components/boletas/BoletasLayout";
import { useNotificaciones } from "../components/Navbar";

const Boletas = () => {
  useEffect(() => {
    document.title = "Red-Fi | Boletas";
  }, []);
  const [boletas, setBoletas] = useState([]);
  const [vista, setVista] = useState("historial"); // "formulario" o "historial"
  const { cargarNotificaciones } = useNotificaciones();

  const cargarBoletas = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("boletas")
      .select("*")
      .eq("user_id", user.id)
      .order("fecha_carga", { ascending: false }); // 🔽 más nuevas arriba

    if (!error) setBoletas(data);
  };

  useEffect(() => {
    cargarBoletas();
  }, []);

  return (
    <BoletasLayout>
      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={() => setVista("formulario")}
          className={`px-4 py-2 rounded font-bold ${
            vista === "formulario" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Nueva Boleta
        </button>
        <button
          onClick={() => setVista("historial")}
          className={`px-4 py-2 rounded font-bold ${
            vista === "historial" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Ver Historial
        </button>
      </div>

      {vista === "formulario" ? (
        <BoletaForm
          onBoletaAgregada={cargarBoletas}
          onActualizarNotificaciones={cargarNotificaciones}
        />
      ) : (
        <BoletaHistorial boletas={boletas} recargarBoletas={cargarBoletas} />
      )}
    </BoletasLayout>
  );
};

export default Boletas;
