import { useState } from "react";
import { supabase } from "../../supabase/client";
import ModalEditarBoleta from "./ModalEditarBoleta";
import Modal from "./ModalVerBoleta";
import MainH2 from "../ui/MainH2";
import MainButton from "../ui/MainButton";


const BoletaHistorial = ({ boletas, recargarBoletas }) => {
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [boletaParaVer, setBoletaParaVer] = useState(null);

  const eliminarBoleta = async (boleta) => {
    if (!confirm("¿Estás seguro de eliminar esta boleta?")) return;
    const { error } = await supabase
      .from("boletas")
      .delete()
      .eq("id", boleta.id);
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
    recargarBoletas?.();
  };

  const boletasOrdenadas = [...boletas].sort(
    (a, b) => new Date(b.fecha_carga) - new Date(a.fecha_carga)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <MainH2 className="text-center">Historial de boletas</MainH2>

      {boletas.length === 0 ? (
        <p className="text-white/60 text-center">No cargaste boletas aún.</p>
      ) : (
        <>
          {/* 🖥️ Tabla en escritorio */}
          <div className="w-full overflow-x-auto hidden md:block">
            <table className="min-w-[1000px] table-auto border-collapse bg-white/5 text-white text-base">
              <thead>
                <tr className="bg-white/10 text-white uppercase text-sm">
                  <th className="px-6 py-4 border border-white/10">#</th>
                  <th className="px-6 py-4 border border-white/10">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 border border-white/10">Mes</th>
                  <th className="px-6 py-4 border border-white/10">Monto</th>
                  <th className="px-6 py-4 border border-white/10">Carga</th>
                  <th className="px-6 py-4 border border-white/10">
                    Vencimiento
                  </th>
                  <th className="px-6 py-4 border border-white/10">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {boletasOrdenadas.map((b, index) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 border border-white/10 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 border border-white/10">
                      {b.proveedor}
                    </td>
                    <td className="px-6 py-4 border border-white/10">
                      {b.mes}{/*  {b.anio} */}
                    </td>
                    <td className="px-6 py-4 border border-white/10">
                      ${parseFloat(b.monto).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 border border-white/10">
                      {b.fecha_carga
                        ? new Date(b.fecha_carga).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 border border-white/10">
                      {new Date(b.vencimiento + "T12:00:00").toLocaleDateString(
                        "es-AR"
                      )}
                    </td>
                    <td className="px-4 py-4 border border-white/10">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <MainButton
                          onClick={() => setBoletaParaVer(b)}
                          title="Ver boleta"
                          variant="see"
                        >
                          Ver
                        </MainButton>
                        <MainButton
                          onClick={() => setBoletaSeleccionada(b)}
                          title="Editar boleta"
                          variant="edit"
                        >
                          Editar
                        </MainButton>
                        <MainButton
                          onClick={() => eliminarBoleta(b)}
                          title="Eliminar boleta"
                          variant="delete"
                        >
                          Eliminar
                        </MainButton>
                      </div>

                      {/* <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setBoletaParaVer(b)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-bold"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => setBoletaSeleccionada(b)}
                          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded text-sm text-black font-bold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarBoleta(b)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold"
                        >
                          Eliminar
                        </button>
                      </div> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Tarjetas en mobile */}
          <div className="md:hidden flex flex-col gap-4">
            {boletasOrdenadas.map((b) => (
              <div
                key={b.id}
                className="bg-white/10 rounded-lg p-4 text-white shadow"
              >
                <p>
                  <strong>Proveedor:</strong> {b.proveedor}
                </p>
                <p>
                  <strong>Mes:</strong> {b.mes} {b.anio}
                </p>
                <p>
                  <strong>Monto:</strong> ${parseFloat(b.monto).toFixed(2)}
                </p>
                <p>
                  <strong>Carga:</strong>{" "}
                  {new Date(b.fecha_carga).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <strong>Vencimiento:</strong>{" "}
                  {new Date(b.vencimiento + "T12:00:00").toLocaleDateString(
                    "es-AR"
                  )}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => setBoletaParaVer(b)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => setBoletaSeleccionada(b)}
                    className="bg-yellow-400 text-black px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarBoleta(b)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL VER */}
      {boletaParaVer &&
        (() => {
          const indexActual = boletasOrdenadas.findIndex(
            (b) => b.id === boletaParaVer.id
          );
          const boletaAnterior = boletasOrdenadas[indexActual + 1] || null;

          return (
            <Modal
              boleta={boletaParaVer}
              boletaAnterior={boletaAnterior}
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
          );
        })()}

      {/* MODAL EDITAR */}
      {boletaSeleccionada && (
        <ModalEditarBoleta
          boleta={boletaSeleccionada}
          onClose={() => setBoletaSeleccionada(null)}
          onActualizar={recargarBoletas}
        />
      )}
    </div>
  );
};

export default BoletaHistorial;
