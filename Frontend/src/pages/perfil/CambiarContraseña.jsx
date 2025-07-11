import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cambiarPassword } from "../../services/authService";
import { IconLock, IconUserEdit } from "@tabler/icons-react";

import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import Alerta from "../../components/ui/Alerta";
import Input from "../../components/ui/Input";

const CambiarContraseña = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nueva: "", repetir: "" });
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Red-Fi | Cambiar contraseña";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setAlerta({ tipo: "", mensaje: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlerta({ tipo: "", mensaje: "" });

    if (form.nueva !== form.repetir) {
      setAlerta({
        tipo: "error",
        mensaje: "Las contraseñas no coinciden.",
      });
      setLoading(false);
      return;
    }

    try {
      await cambiarPassword(form.nueva);
      setAlerta({
        tipo: "exito",
        mensaje: "¡Contraseña actualizada correctamente!",
      });
      setForm({ nueva: "", repetir: "" });

      setTimeout(() => navigate("/cuenta"), 1500);
    } catch (err) {
      setAlerta({ tipo: "error", mensaje: err.message });
    }

    setLoading(false);
  };

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-8 relative">
      <div className="w-full max-w-lg">
        {/* Título */}
        <div className="w-full text-center mb-8">
          <MainH1 icon={IconUserEdit}>Cambiar contraseña</MainH1>
          <p className="mx-auto">Asegurate de elegir una contraseña segura.</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nueva contraseña *"
              name="nueva"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={IconLock}
              value={form.nueva}
              onChange={handleChange}
              required
              disabled={loading}
              loading={loading}
              isInvalid={
                alerta.tipo === "error" &&
                alerta.mensaje.toLowerCase().includes("contraseña")
              }
            />

            <Input
              label="Repetir contraseña *"
              name="repetir"
              type="password"
              placeholder="Debe coincidir con la anterior"
              icon={IconLock}
              value={form.repetir}
              onChange={handleChange}
              required
              disabled={loading}
              loading={loading}
              isInvalid={
                alerta.tipo === "error" &&
                alerta.mensaje.toLowerCase().includes("coinciden")
              }
            />

            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </MainButton>
          </form>
        </div>

        {/* Alerta flotante */}
        {alerta.mensaje && (
          <div className="absolute left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <Alerta
              tipo={alerta.tipo}
              mensaje={alerta.mensaje}
              onCerrar={() => setAlerta({ tipo: "", mensaje: "" })}
              flotante={true}
            />
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6 max-w-md mx-auto">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-fondo text-white/60">
              Opciones de cuenta
            </span>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-row flex-wrap justify-center gap-3 max-w-md mx-auto">
          <MainLinkButton
            to="/editar-perfil"
            disabled={loading}
            variant="secondary"
            className="px-4 py-2"
          >
            Ir a <span className="text-acento">Editar Perfil</span>
          </MainLinkButton>
          <MainLinkButton
            to="/cuenta"
            disabled={loading}
            variant="secondary"
            className="px-4 py-2"
          >
            Ir a <span className="text-acento">Mi Cuenta</span>
          </MainLinkButton>
        </div>
      </div>
    </div>
  );
};

export default CambiarContraseña;
