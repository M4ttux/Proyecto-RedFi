import { IconX, IconEye, IconTrash, IconEdit } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";

const ModalVerBoleta = ({
  boleta,
  onClose,
  onEditar,
  onEliminar,
  boletaAnterior,
}) => {
  if (!boleta) return null;

  const montoActual = parseFloat(boleta.monto);
  const montoAnterior = boletaAnterior
    ? parseFloat(boletaAnterior.monto)
    : null;

  let diferenciaTexto = "—";
  let diferenciaColor = "text-white";

  if (montoAnterior !== null) {
    const diferencia = montoActual - montoAnterior;
    if (diferencia > 0) {
      diferenciaTexto = `📈 Subió $${diferencia.toFixed(2)}`;
      diferenciaColor = "text-green-400";
    } else if (diferencia < 0) {
      diferenciaTexto = `📉 Bajó $${Math.abs(diferencia).toFixed(2)}`;
      diferenciaColor = "text-red-400";
    } else {
      diferenciaTexto = `🟰 Sin cambios`;
      diferenciaColor = "text-yellow-300";
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative transition transform duration-300 ease-out scale-95 animate-fadeIn">
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar"
          className="absolute top-3 right-3"
        >
          <IconX size={24} />
        </MainButton>

        <MainH2 className="text-center">Detalle de boleta</MainH2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 ml-10 mb-2 text-xl">
            <p>
              <strong>Mes:</strong> {boleta.mes}
            </p>
            <p>
              <strong>Año:</strong> {boleta.anio}
            </p>
            <p>
              <strong>Monto:</strong> ${montoActual.toFixed(2)}
            </p>
            <p className={diferenciaColor}>
              <strong>Diferencia:</strong> {diferenciaTexto}
            </p>
            <p>
              <strong>Proveedor:</strong> {boleta.proveedor}
            </p>
            <p>
              <strong>Vencimiento:</strong>{" "}
              {new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src={boleta.url_imagen}
              alt="Boleta"
              className="max-h-[300px] object-contain rounded border"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <a
            href={boleta.url_imagen}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver"
          >
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold">
              <IconEye size={20} /> Ver
            </button>
          </a>
          <button
            onClick={() => onEditar(boleta)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded font-bold"
          >
            <IconEdit size={20} /> Editar
          </button>
          <button
            onClick={() => onEliminar(boleta)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold"
          >
            <IconTrash size={20} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerBoleta;
