import { useState } from "react";
import { IconX } from "@tabler/icons-react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import ModalContenedor from "../../../ui/ModalContenedor";
import { agregarTecnologia } from "../../../../services/tecnologiaService";
import { useAlerta } from "../../../../context/AlertaContext";

const ModalAgregarTecnologia = ({ onClose, onActualizar }) => {
  const [formData, setFormData] = useState({
    tecnologia: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const { mostrarExito, mostrarError } = useAlerta();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await agregarTecnologia(formData, mostrarError);
      mostrarExito("Tecnología agregada correctamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      console.error("Error al agregar tecnología:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Agregar tecnología</MainH2>
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
          name="tecnologia"
          label="Nombre de la tecnología *"
          value={formData.tecnologia}
          onChange={handleChange}
          placeholder="Ej. Fibra óptica"
          required
          disabled={loading}
        />

        <Textarea
          name="descripcion"
          label="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          placeholder="Descripción de la tecnología"
          disabled={loading}
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
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Creando..." : "Crear tecnología"}
          </MainButton>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalAgregarTecnologia;
