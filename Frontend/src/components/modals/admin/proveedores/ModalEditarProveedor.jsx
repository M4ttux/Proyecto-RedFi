import { useEffect, useState } from "react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import Select from "../../../ui/Select";
import { IconX } from "@tabler/icons-react";
import {
  editarProveedor,
  obtenerTecnologiasDisponibles,
  obtenerZonasDisponibles,
} from "../../../../services/proveedorService";
import { useAlerta } from "../../../../context/AlertaContext";

const ModalEditarProveedor = ({ proveedor, onClose, onActualizar }) => {
  const [form, setForm] = useState({ ...proveedor });
  const [loading, setLoading] = useState(false);
  const [tecnologias, setTecnologias] = useState([]);
  const [zonas, setZonas] = useState([]);

  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        const [tec, zon] = await Promise.all([
          obtenerTecnologiasDisponibles(),
          obtenerZonasDisponibles(),
        ]);
        setTecnologias(tec);
        setZonas(zon);
      } catch (error) {
        mostrarError("Error al cargar tecnologías o zonas disponibles");
      }
    };
    cargarOpciones();
  }, [mostrarError]);

  useEffect(() => {
    if (proveedor) {
      setForm({
        ...proveedor,
        tecnologias:
          proveedor.ProveedorTecnologia?.map((t) =>
            String(t.tecnologias?.id)
          ) || [],
        zonas: proveedor.ZonaProveedor?.map((z) => String(z.zonas?.id)) || [],
      });
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (campo, valores) => {
    setForm((prev) => ({ ...prev, [campo]: valores }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editarProveedor(proveedor.id, form);
      mostrarExito("Proveedor actualizado correctamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      mostrarError("Error al actualizar proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-secundario border border-white/20 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-white">
        <div className="flex justify-between mb-4">
          <MainH2 className="mb-0">Editar proveedor</MainH2>
          <MainButton
            onClick={onClose}
            type="button"
            variant="cross"
            title="Cerrar modal"
            disabled={loading}
          >
            <IconX size={24} />
          </MainButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre *"
            name="nombre"
            value={form.nombre || ""}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <Input
            label="Sitio web"
            name="sitio_web"
            value={form.sitio_web || ""}
            onChange={handleChange}
            disabled={loading}
          />

          <Textarea
            label="Descripción"
            name="descripcion"
            value={form.descripcion || ""}
            onChange={handleChange}
            rows={3}
            disabled={loading}
          />

          <Input
            label="Color *"
            name="color"
            value={form.color || ""}
            onChange={handleChange}
            required
            disabled={loading}
            type="color"
          />

          <Select
            label="Tecnologías"
            name="tecnologias"
            value={form.tecnologias || []}
            onChange={(val) => handleSelectChange("tecnologias", val)}
            options={tecnologias}
            getOptionLabel={(opt) => opt.tecnologia}
            getOptionValue={(opt) => String(opt.id)}
            disabled={loading}
            multiple={true}
          />

          <Select
            label="Zonas"
            name="zonas"
            value={form.zonas || []}
            onChange={(val) => handleSelectChange("zonas", val)}
            options={zonas}
            getOptionLabel={(opt) => opt.departamento}
            getOptionValue={(opt) => String(opt.id)}
            disabled={loading}
            multiple={true}
          />

          <div className="flex gap-3 pt-4">
            <MainButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </MainButton>
            <MainButton
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              Guardar cambios
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProveedor;
