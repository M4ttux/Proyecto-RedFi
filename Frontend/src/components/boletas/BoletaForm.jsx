import { useState } from "react";
import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";
import { IconX } from "@tabler/icons-react";
import { supabase } from "../../supabase/client";

const BoletaForm = ({ onBoletaAgregada, onActualizarNotificaciones }) => {
  const [form, setForm] = useState({
    mes: "",
    anio: "",
    monto: "",
    proveedor: "",
    vencimiento: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Debes iniciar sesión.");

    let url_imagen = null;

    if (archivo) {
      const fileName = `boleta-${Date.now()}-${archivo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("boletas")
        .upload(fileName, archivo);

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError.message);
        alert("Error al subir la imagen.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("boletas")
        .getPublicUrl(fileName);

      url_imagen = publicUrlData.publicUrl;
    }

    // 💡 Corregimos desfase horario sumando hora media
    const vencimientoAjustado = new Date(form.vencimiento + "T12:00:00").toISOString();

    const { error } = await supabase.from("boletas").insert({
      ...form,
      user_id: user.id,
      vencimiento: vencimientoAjustado,
      url_imagen,
    });

    if (error) {
      console.error(error);
      alert("Error al guardar la boleta.");
    } else {
      alert("Boleta guardada correctamente.");
      setForm({
        mes: "",
        anio: "",
        monto: "",
        proveedor: "",
        vencimiento: "",
      });
      setArchivo(null);
      setPreviewUrl(null);

      if (onBoletaAgregada) onBoletaAgregada();
      if (onActualizarNotificaciones) onActualizarNotificaciones();
      window.dispatchEvent(new Event("nueva-boleta"));
    }
  };

  return (
    <div>
      <MainH2 className="text-center">Carga de boletas</MainH2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/5 p-6 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <label className="block text-white mb-1">Mes *</label>
            <input
              name="mes"
              value={form.mes}
              onChange={handleChange}
              placeholder="Ej. Abril"
              required
              className="px-4 py-2 rounded bg-white text-black w-full"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Año *</label>
            <input
              name="anio"
              value={form.anio}
              onChange={handleChange}
              placeholder="Ej. 2025"
              required
              className="px-4 py-2 rounded bg-white text-black w-full"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Monto *</label>
            <input
              name="monto"
              type="number"
              value={form.monto}
              onChange={handleChange}
              placeholder="Monto $"
              required
              className="px-4 py-2 rounded bg-white text-black w-full"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Proveedor *</label>
            <input
              name="proveedor"
              value={form.proveedor}
              onChange={handleChange}
              placeholder="Ej. Fibertel"
              required
              className="px-4 py-2 rounded bg-white text-black w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-white mb-1">
              Fecha de vencimiento *
            </label>
            <input
              name="vencimiento"
              type="date"
              value={form.vencimiento}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded bg-white text-black w-full"
            />
          </div>

          <div className="md:col-span-2 text-center">
            <label className="block text-white mb-1">Imagen de la boleta *</label>
            <label className="inline-block bg-white text-black font-semibold px-6 py-2 rounded cursor-pointer hover:bg-gray-200 transition">
              Seleccionar imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {archivo && (
              <div className="mt-2 text-white flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span>{archivo.name}</span>
                  <MainButton
                    type="button"
                    variant="cross"
                    onClick={() => {
                      setArchivo(null);
                      setPreviewUrl(null);
                    }}
                    title="Eliminar imagen"
                  >
                    <IconX size={24} />
                  </MainButton>
                </div>

                {previewUrl && (
                  <div className="mt-3">
                    <img
                      src={previewUrl}
                      alt="Previsualización"
                      className="max-h-48 rounded border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <MainButton
            type="button"
            variant="primary"
          >
            Guardar boleta
          </MainButton>
        </div>
      </form>
    </div>
  );
};

export default BoletaForm;
