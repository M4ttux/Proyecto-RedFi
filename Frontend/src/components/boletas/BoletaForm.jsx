import { useState } from "react";
import { supabase } from "../../supabase/client";

const BoletaForm = ({ onBoletaAgregada }) => {
  const [form, setForm] = useState({
    mes: "",
    anio: "",
    monto: "",
    proveedor: "",
    vencimiento: "",
  });

  const [archivo, setArchivo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Debés iniciar sesión.");

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

    const { error } = await supabase.from("boletas").insert({
      ...form,
      user_id: user.id,
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
      if (onBoletaAgregada) onBoletaAgregada();
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/5 p-6 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <label className="block text-white mb-1">Mes</label>
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
            <label className="block text-white mb-1">Año</label>
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
            <label className="block text-white mb-1">Monto</label>
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
            <label className="block text-white mb-1">Proveedor</label>
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
              Fecha de vencimiento
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
            <label className="block text-white mb-1">Imagen de la boleta</label>

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
              <p className="text-white text-sm mt-2">{archivo.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-primario hover:bg-acento text-white px-6 py-2 rounded font-semibold">
            Guardar boleta
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoletaForm;
