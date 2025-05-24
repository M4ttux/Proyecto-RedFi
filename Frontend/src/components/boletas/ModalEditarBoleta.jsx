import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";

const ModalEditarBoleta = ({ boleta, onClose, onActualizar }) => {
  const [form, setForm] = useState({ ...boleta });
  const [archivoNuevo, setArchivoNuevo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setArchivoNuevo(e.target.files[0]);
  };

  const handleGuardarCambios = async () => {
    let url_imagen = boleta.url_imagen;

    if (archivoNuevo) {
      // 1. Eliminar imagen anterior si existía
      if (boleta.url_imagen) {
        const oldPath = boleta.url_imagen.split("/").pop();
        await supabase.storage.from("boletas").remove([oldPath]);
      }

      // 2. Subir imagen nueva
      const nuevoNombre = `boleta-${Date.now()}-${archivoNuevo.name}`;
      const { data: subida, error: errorSubida } = await supabase.storage
        .from("boletas")
        .upload(nuevoNombre, archivoNuevo);

      if (errorSubida) {
        alert("Error al subir la nueva imagen.");
        console.error(errorSubida);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("boletas")
        .getPublicUrl(nuevoNombre);

      url_imagen = publicUrlData.publicUrl;
    }

    // 3. Actualizar en la tabla
    const { error } = await supabase
      .from("boletas")
      .update({ ...form, url_imagen })
      .eq("id", boleta.id);

    if (error) {
      alert("Error al guardar cambios.");
      console.error(error);
    } else {
      alert("Boleta modificada correctamente.");
      if (onActualizar) onActualizar();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold text-center">Modificar Boleta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="mes"
            value={form.mes}
            onChange={handleChange}
            placeholder="Mes"
            className="border p-2 rounded"
          />
          <input
            name="anio"
            value={form.anio}
            onChange={handleChange}
            placeholder="Año"
            className="border p-2 rounded"
          />
          <input
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto"
            className="border p-2 rounded"
          />
          <input
            name="proveedor"
            value={form.proveedor}
            onChange={handleChange}
            placeholder="Proveedor"
            className="border p-2 rounded"
          />
          <input
            name="vencimiento"
            type="date"
            value={form.vencimiento}
            onChange={handleChange}
            className="border p-2 rounded col-span-1 md:col-span-2"
          />
          <div className="md:col-span-2 text-center">
            <label className="block text-black mb-1">
              Nueva imagen (opcional)
            </label>

            <label className="inline-block bg-gray-200 text-black font-semibold px-6 py-2 rounded cursor-pointer hover:bg-gray-300 transition">
              Seleccionar imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {archivoNuevo && (
              <p className="text-sm mt-2 text-black/80">{archivoNuevo.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardarCambios}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white font-semibold"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarBoleta;
