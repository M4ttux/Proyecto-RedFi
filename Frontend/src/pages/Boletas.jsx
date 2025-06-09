import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoletaForm from "../components/boletas/BoletaForm";
import BoletaHistorial from "../components/boletas/BoletaHistorial";
import { supabase } from "../supabase/client";
import { useNotificaciones } from "../components/Navbar";

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
        <h1 className="text-5xl lg:text-5xl font-bold text-center flex items-center justify-center gap-2">
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

        {/* 🔙 Botón volver al perfil al final */}
        <div className="text-center mt-10">
          <Link
            to="/cuenta"
            className="inline-block bg-white/10 text-white font-semibold px-6 py-3 rounded hover:bg-white/20 transition"
          >
            ← Volver al perfil
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Boletas;
