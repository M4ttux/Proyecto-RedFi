import { useState } from "react";
import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FileInput from "../ui/FileInput";
import { IconCalendar, IconCurrencyDollar, IconWifi } from "@tabler/icons-react";
import { obtenerUsuarioActual } from "../../services/boletas/auth";
import { subirImagenBoleta } from "../../services/boletas/upload";
import { guardarBoleta } from "../../services/boletas/crud";
import { useAlerta } from "../../context/AlertaContext";

const BoletaForm = ({
  onBoletaAgregada,
  onActualizarNotificaciones,
  setVista,
}) => {
  const [form, setForm] = useState({
    mes: "",
    anio: "",
    monto: "",
    proveedor: "",
    vencimiento: "",
    promoHasta: "",
    proveedorOtro: "",
  });

  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { mostrarExito, mostrarError } = useAlerta();

  const meses = [
    { label: "Seleccionar mes", value: "" },
    { label: "Enero", value: "Enero" },
    { label: "Febrero", value: "Febrero" },
    { label: "Marzo", value: "Marzo" },
    { label: "Abril", value: "Abril" },
    { label: "Mayo", value: "Mayo" },
    { label: "Junio", value: "Junio" },
    { label: "Julio", value: "Julio" },
    { label: "Agosto", value: "Agosto" },
    { label: "Septiembre", value: "Septiembre" },
    { label: "Octubre", value: "Octubre" },
    { label: "Noviembre", value: "Noviembre" },
    { label: "Diciembre", value: "Diciembre" },
  ];

  const proveedores = [
    { label: "Seleccionar proveedor", value: "" },
    { label: "Fibertel", value: "Fibertel" },
    { label: "Telecentro", value: "Telecentro" },
    { label: "Claro", value: "Claro" },
    { label: "Movistar", value: "Movistar" },
    { label: "Otro", value: "Otro" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones manuales
      if (!form.mes) {
        mostrarError("Debés seleccionar un mes válido.");
        return;
      }
      if (!form.proveedor) {
        mostrarError("Debés seleccionar un proveedor válido.");
        return;
      }

      if (form.proveedor === "Otro" && !form.proveedorOtro.trim()) {
        mostrarError("Debés ingresar el nombre del proveedor.");
        return;
      }

      const user = await obtenerUsuarioActual();
      if (!user) {
        mostrarError("Debés iniciar sesión.");
        return;
      }

      let url_imagen = null;
      if (archivo) {
        url_imagen = await subirImagenBoleta(archivo);
      }

      const vencimientoAjustado = new Date(
        form.vencimiento + "T12:00:00"
      ).toISOString();

      const promoHastaAjustado = form.promoHasta
        ? new Date(form.promoHasta + "T12:00:00").toISOString()
        : null;

      const proveedorFinal =
        form.proveedor === "Otro" ? form.proveedorOtro : form.proveedor;

      await guardarBoleta({
        mes: form.mes,
        anio: form.anio,
        monto: form.monto,
        proveedor: proveedorFinal,
        user_id: user.id,
        vencimiento: vencimientoAjustado,
        promo_hasta: promoHastaAjustado,
        url_imagen,
      });

      mostrarExito("Boleta guardada correctamente.");

      setForm({
        mes: "",
        anio: "",
        monto: "",
        proveedor: "",
        vencimiento: "",
        promoHasta: "",
        proveedorOtro: "",
      });
      setArchivo(null);
      setPreviewUrl(null);

      onBoletaAgregada?.();
      onActualizarNotificaciones?.();
      window.dispatchEvent(new Event("nueva-boleta"));

      setVista?.("historial");
    } catch (error) {
      console.error(error);
      mostrarError("Error al guardar la boleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainH2 className="text-center">Carga de boletas</MainH2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select de mes */}
          <Select
            label="Mes *"
            name="mes"
            value={form.mes}
            onChange={handleSelectChange("mes")}
            options={meses}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label}
            required
          />

          <Input
            label="Año *"
            name="anio"
            type="number"
            value={form.anio}
            onChange={handleChange}
            placeholder="Ej. 2025"
            min={2020}
            max={2035}
            maxLength={4}
            required
          />

          <Input
            label="Monto *"
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto"
            required
            min="0"
            step="0.01"
            icon={IconCurrencyDollar}
          />

          {/* Select de proveedor */}
          <Select
            label="Proveedor *"
            name="proveedor"
            value={form.proveedor}
            onChange={handleSelectChange("proveedor")}
            options={proveedores}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label}
            required
            icon={IconWifi}
          />

          {/* Solo se muestra si elige "Otro" */}
          {form.proveedor === "Otro" && (
            <Input
              label="Nombre del proveedor"
              name="proveedorOtro"
              value={form.proveedorOtro}
              onChange={handleChange}
              placeholder="Ej. Red Fibra Z"
              required
            />
          )}

          <Input
            label="Fecha de vencimiento *"
            name="vencimiento"
            type="date"
            value={form.vencimiento}
            onChange={handleChange}
            required
            icon={IconCalendar}
          />

          <Input
            label="Fin de promoción (opcional)"
            name="promoHasta"
            type="date"
            value={form.promoHasta}
            onChange={handleChange}
            icon={IconCalendar}
          />
        </div>
        <div className="flex justify-center text-center">
          <FileInput
            id="archivo"
            label="Imagen de la boleta (opcional)"
            value={archivo}
            onChange={setArchivo}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            accept="image/*"
          />
        </div>

        <div className="flex justify-center">
          <MainButton
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Guardar boleta
          </MainButton>
        </div>
      </form>
    </div>
  );
};

export default BoletaForm;
