import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import BoletaForm from "../components/boletas/BoletaForm";
import BoletaHistorial from "../components/boletas/BoletaHistorial";
import BoletasLayout from "../components/boletas/BoletasLayout";
import { useNotificaciones } from "../components/Navbar";
import MainButton from "../components/ui/MainButton";

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
        />
      ) : (
        <BoletaHistorial boletas={boletas} recargarBoletas={cargarBoletas} />
      )}
    </BoletasLayout>
  );
};

export default Boletas;
