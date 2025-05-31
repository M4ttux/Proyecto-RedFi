import { useEffect, useState } from "react";
import BoletaForm from "../components/boletas/BoletaForm";
import BoletaHistorial from "../components/boletas/BoletaHistorial";
import { supabase } from "../supabase/client";
import { useNotificaciones } from "../components/Navbar"; // Asegurate de que la ruta sea correcta

const Boletas = () => {
  const [boletas, setBoletas] = useState([]);
  const { cargarNotificaciones } = useNotificaciones();

  const cargarBoletas = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("boletas")
      .select("*")
      .eq("user_id", user.id)
      .order("vencimiento", { ascending: false });

    if (!error) {
      setBoletas(data);
    }
  };

  useEffect(() => {
    cargarBoletas();
  }, []);

  return (
    <section className="py-20 px-6 text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          📄 Mis Boletas
        </h1>

        <div className="flex flex-col lg:flex-row gap-x-12 gap-y-12 items-start">
          {/* 🧾 Formulario de carga */}
          <div className="flex-1 w-full">
            <BoletaForm
              onBoletaAgregada={cargarBoletas}
              onActualizarNotificaciones={cargarNotificaciones}
            />
          </div>

          {/* 📜 Historial de boletas */}
          <div className="flex-1 w-full">
            <BoletaHistorial
              boletas={boletas}
              onActualizar={cargarBoletas}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Boletas;
