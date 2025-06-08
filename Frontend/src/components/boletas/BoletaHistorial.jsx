import { useState } from "react";
import { supabase } from "../../supabase/client";
import ModalEditarBoleta from "./ModalEditarBoleta";
import Modal from "./ModalVerBoleta";

const BoletaHistorial = ({ boletas, onActualizar }) => {
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [boletaParaVer, setBoletaParaVer] = useState(null);

  const eliminarBoleta = async (boleta) => {
    if (!confirm("¿Estás seguro de eliminar esta boleta?")) return;
    const { error } = await supabase.from("boletas").delete().eq("id", boleta.id);
    if (error) {
      alert("Error al eliminar la boleta.");
      console.error(error);
      return;
    }
    if (boleta.url_imagen) {
      const fileName = boleta.url_imagen.split("/").pop();
      await supabase.storage.from("boletas").remove([fileName]);
    }
    alert("Boleta eliminada correctamente.");
    onActualizar?.();
  };

  const meses = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
    julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  };

  const getFechaOrden = (boleta) => {
    const mesNum = meses[boleta.mes.toLowerCase()] || 0;
    return new Date(`${boleta.anio}-${String(mesNum).padStart(2, "0")}-01`);
  };

  const boletasOrdenadas = [...boletas].sort((a, b) => getFechaOrden(b) - getFechaOrden(a));

  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-semibold mb-6 text-center text-white">
        Historial de Boletas
      </h2>

      {boletas.length === 0 ? (
        <p className="text-white/60 text-center">No cargaste boletas aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {boletasOrdenadas.map((b, index) => {
            const actual = parseFloat(b.monto);
            const anterior = boletasOrdenadas[index + 1]
              ? parseFloat(boletasOrdenadas[index + 1].monto)
              : null;

            let diferenciaTexto = "";
            if (index === 0 && anterior !== null) {
              const diferencia = actual - anterior;
              if (diferencia > 0) {
                diferenciaTexto = `📈 Subió $${diferencia.toFixed(2)}`;
              } else if (diferencia < 0) {
                diferenciaTexto = `📉 Bajó $${Math.abs(diferencia).toFixed(2)}`;
              } else {
                diferenciaTexto = `🟰 Sin cambios`;
              }
            }

            return (
              <div key={b.id} className="bg-white/5 text-white p-5 rounded-lg border border-white/10 max-w-2xl w-full">
                <div className="flex justify-between text-base mb-2">
                  <span className="font-semibold">{b.mes} {b.anio}</span>
                  <span className="text-green-400 font-bold">${actual.toFixed(2)}</span>
                </div>

                <p className="text-white/70 mb-1">
                  Proveedor: <span className="text-white">{b.proveedor}</span>
                </p>
                <p className="text-white/70 mb-1">
                  Vence el: {new Date(b.vencimiento).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {diferenciaTexto && (
                  <p className="italic text-white/80 mb-3">{diferenciaTexto}</p>
                )}

                <div className="flex justify-start gap-3 mt-2">
                  <button onClick={() => setBoletaParaVer(b)} className="bg-blue-600 p-2 rounded hover:bg-blue-700 font-semibold" title="Ver">
                    Ver
                  </button>

                  <button onClick={() => eliminarBoleta(b)} className="bg-red-600 p-2 rounded hover:bg-red-700 font-semibold" title="Eliminar">
                    Eliminar
                  </button>
                  <button onClick={() => setBoletaSeleccionada(b)} className="bg-yellow-500 p-2 rounded hover:bg-yellow-600 text-black font-semibold" title="Modificar">
                    Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {boletaParaVer && (
        <Modal
          boleta={boletaParaVer}
          onClose={() => setBoletaParaVer(null)}
          onEditar={(b) => {
            setBoletaSeleccionada(b);
            setBoletaParaVer(null);
          }}
          onEliminar={(b) => {
            eliminarBoleta(b);
            setBoletaParaVer(null);
          }}
        />
      )}

      {boletaSeleccionada && (
        <ModalEditarBoleta
          boleta={boletaSeleccionada}
          onClose={() => setBoletaSeleccionada(null)}
          onActualizar={onActualizar}
        />
      )}
    </div>
  );
};

export default BoletaHistorial;
