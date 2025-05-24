import { useState } from "react";
import { supabase } from "../../supabase/client";
import ModalEditarBoleta from "./ModalEditarBoleta";

const BoletaHistorial = ({ boletas, onActualizar }) => {
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);

  const eliminarBoleta = async (boleta) => {
    const confirmacion = confirm("¿Estás seguro de eliminar esta boleta?");
    if (!confirmacion) return;

    const { error: deleteError } = await supabase
      .from("boletas")
      .delete()
      .eq("id", boleta.id);

    if (deleteError) {
      alert("Error al eliminar la boleta.");
      console.error(deleteError);
      return;
    }

    if (boleta.url_imagen) {
      const fileName = boleta.url_imagen.split("/").pop();
      await supabase.storage.from("boletas").remove([fileName]);
    }

    alert("Boleta eliminada correctamente.");
    if (onActualizar) onActualizar();
  };

  const descargarBoleta = async (boleta) => {
    const fileName = boleta.url_imagen.split("/").pop();

    const { data, error } = await supabase.storage
      .from("boletas")
      .createSignedUrl(fileName, 60);

    if (error) {
      alert("Error al generar enlace de descarga.");
      return;
    }

    const link = document.createElement("a");
    link.href = data.signedUrl;
    link.download = `boleta-${boleta.mes}-${boleta.anio}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = boletas.reduce((acc, b) => acc + parseFloat(b.monto), 0);

  // ✅ Mapeo de nombres de mes a número
  const meses = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };

  const getFechaOrden = (boleta) => {
    const mesNum = meses[boleta.mes.toLowerCase()] || 0;
    return new Date(`${boleta.anio}-${String(mesNum).padStart(2, "0")}-01`);
  };

  // ✅ Ordenar correctamente por fecha
  const boletasOrdenadas = [...boletas].sort((a, b) => {
    return getFechaOrden(b) - getFechaOrden(a); // más reciente primero
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 mt-0 text-center w-full">
        Historial de Boletas
      </h2>

      {boletas.length === 0 ? (
        <p className="text-white/60 text-center">No cargaste boletas aún.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {boletasOrdenadas.map((b, index) => {
              const actual = parseFloat(b.monto);
              const anterior = boletasOrdenadas[index + 1]
                ? parseFloat(boletasOrdenadas[index + 1].monto)
                : null;

              let diferenciaTexto = "";
              if (index === 0 && anterior !== null) {
                const diferencia = actual - anterior;
                if (diferencia > 0) {
                  diferenciaTexto = `📈 Subió $${diferencia.toFixed(
                    2
                  )} respecto al mes anterior`;
                } else if (diferencia < 0) {
                  diferenciaTexto = `📉 Bajó $${Math.abs(diferencia).toFixed(
                    2
                  )} respecto al mes anterior`;
                } else {
                  diferenciaTexto = `🟰 Se mantuvo igual al mes anterior`;
                }
              }

              return (
                <li
                  key={b.id}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 text-white"
                >
                  <div className="flex justify-between">
                    <span>
                      {b.mes} {b.anio}
                    </span>
                    <span className="font-semibold text-green-400">
                      ${actual.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-sm text-white/60 mb-1">
                    {b.proveedor} — vence el{" "}
                    {new Date(b.vencimiento).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {diferenciaTexto && (
                    <div className="text-sm mb-2 italic text-white/80">
                      {diferenciaTexto}
                    </div>
                  )}

                  {b.url_imagen && (
                    <div className="mt-3">
                      <img
                        src={b.url_imagen}
                        alt="Boleta"
                        className="max-w-xs rounded border border-white/10 mb-2"
                      />
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={b.url_imagen}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ver boleta"
                        >
                          <button className="p-2 bg-blue-600 rounded hover:bg-blue-700">
                            Ver
                          </button>
                        </a>

                        <button
                          onClick={() => descargarBoleta(b)}
                          title="Descargar boleta"
                          className="p-2 bg-green-600 rounded hover:bg-green-700"
                        >
                          Descargar
                        </button>

                        <button
                          onClick={() => eliminarBoleta(b)}
                          title="Eliminar boleta"
                          className="p-2 bg-red-600 rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>

                        <button
                          onClick={() => setBoletaSeleccionada(b)}
                          title="Modificar boleta"
                          className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 text-black"
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ✅ Total al final */}
          <p className="text-center text-white mt-8 mb-16 font-semibold">
            💰 Total gastado: ${total.toFixed(2)}
          </p>
        </>
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
