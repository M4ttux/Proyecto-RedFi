import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";
import { IconX } from "@tabler/icons-react";

const ModalEliminar = ({
  titulo = "¿Estás seguro?",
  descripcion = "Esta acción no se puede deshacer.",
  onConfirmar,
  onCancelar,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#222222] text-white p-6 rounded-lg w-full max-w-xl border border-white/10">
      <div className="flex justify-between mb-4">
          <MainH2 className="mb-0">{titulo}</MainH2>
          <MainButton
            onClick={onCancelar}
            type="button"
            variant="cross"
            title="Cerrar modal"
            className="px-0"
            disabled={loading}
          >
            <IconX size={24} />
          </MainButton>
        </div>
        <p className="text-center">{descripcion}</p>

        <div className="flex justify-center gap-4 pt-4">
          <MainButton
            onClick={onCancelar}
            variant="secondary"
            className="px-4 py-2"
            disabled={loading}
          >
            Cancelar
          </MainButton>
          <MainButton
            onClick={onConfirmar}
            variant="danger"
            className="px-4 py-2"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminar;
