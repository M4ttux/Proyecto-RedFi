import { useEffect, useState } from "react";
import { eliminarBoletaConImagen } from "../../services/boletasService";
import { IconLoader2, IconCalendar } from "@tabler/icons-react";
import ModalEditarBoleta from "../modals/boletas/ModalEditarBoleta";
import ModalVerBoleta from "../modals/boletas/ModalVerBoleta";
import ModalEliminar from "../modals/ModalEliminar";
import MainH2 from "../ui/MainH2";
import MainButton from "../ui/MainButton";
import Table from "../ui/Table";

const BoletaHistorial = ({ boletas, recargarBoletas, setAlerta }) => {
  const [cargando, setCargando] = useState(true);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [boletaParaVer, setBoletaParaVer] = useState(null);
  const [boletaAEliminar, setBoletaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 300);
    return () => clearTimeout(timer);
  }, [boletas]);

  const confirmarEliminacion = async () => {
    if (!boletaAEliminar) return;
    try {
      setEliminando(true);
      await eliminarBoletaConImagen(boletaAEliminar);
      setAlerta({ tipo: "exito", mensaje: "Boleta eliminada correctamente." });
      window.dispatchEvent(new Event("nueva-boleta"));
      recargarBoletas?.();
    } catch (error) {
      setAlerta({ tipo: "error", mensaje: "Error al eliminar la boleta." });
      console.error(error);
    } finally {
      setEliminando(false);
      setBoletaAEliminar(null);
    }
  };

  const boletasOrdenadas = [...boletas].sort(
    (a, b) => new Date(b.fecha_carga) - new Date(a.fecha_carga)
  );

  const columnas = [
    {
      id: "numero",
      label: "#",
      renderCell: (_, index) => (
        <span className="text-center">{index + 1}</span>
      ),
    },
    {
      id: "proveedor",
      label: "Proveedor",
    },
    {
      id: "mes",
      label: "Mes",
    },
    {
      id: "monto",
      label: "Monto",
      renderCell: (b) => `$${parseFloat(b.monto).toFixed(2)}`,
    },
    {
      id: "fecha_carga",
      label: "Carga",
      renderCell: (b) => (
        <div className="flex items-center text-sm text-white/60">
          <IconCalendar size={16} className="mr-2" />
          {b.fecha_carga
            ? new Date(b.fecha_carga).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—"}
        </div>
      ),
    },
    {
      id: "vencimiento",
      label: "Vencimiento",
      renderCell: (b) => (
        <div className="flex items-center text-sm text-white/60">
          <IconCalendar size={16} className="mr-2" />
          {new Date(b.vencimiento + "T12:00:00").toLocaleDateString("es-AR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      ),
    },

    {
      id: "acciones",
      label: "Acciones",
      renderCell: (b) => (
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
            onClick={() => setBoletaAEliminar(b)}
            title="Eliminar boleta"
            variant="delete"
          >
            Eliminar
          </MainButton>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto relative">
      <MainH2 className="text-center">Historial de boletas</MainH2>

      {cargando ? (
        <div className="flex justify-center items-center text-white/60 gap-2 mt-10">
          <IconLoader2 className="animate-spin" size={24} />
          Cargando boletas...
        </div>
      ) : boletas.length === 0 ? (
        <p className="text-white/60 text-center mt-6">
          No cargaste boletas aún.
        </p>
      ) : (
        <>
          {/* 🖥️ Tabla en escritorio */}
          <div className="hidden md:block">
            <Table columns={columnas} data={boletasOrdenadas} />
          </div>

          {/* 📱 Tarjetas en mobile */}
          <div className="md:hidden flex flex-col gap-4 mt-6">
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
                    onClick={() => setBoletaAEliminar(b)}
                    title="Eliminar boleta"
                    variant="delete"
                  >
                    Eliminar
                  </MainButton>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODALES */}
      {boletaParaVer &&
        (() => {
          const indexActual = boletasOrdenadas.findIndex(
            (b) => b.id === boletaParaVer.id
          );
          const boletaAnterior = boletasOrdenadas[indexActual + 1] || null;
          return (
            <ModalVerBoleta
              boleta={boletaParaVer}
              boletaAnterior={boletaAnterior}
              onClose={() => setBoletaParaVer(null)}
            />
          );
        })()}

      {boletaSeleccionada && (
        <ModalEditarBoleta
          boleta={boletaSeleccionada}
          onClose={() => setBoletaSeleccionada(null)}
          onActualizar={recargarBoletas}
          setAlerta={setAlerta}
        />
      )}

      {boletaAEliminar && (
        <ModalEliminar
          titulo="Eliminar boleta"
          descripcion="¿Estás seguro que querés eliminar esta boleta? Esta acción no se puede deshacer."
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setBoletaAEliminar(null)}
          loading={eliminando}
        />
      )}
    </div>
  );
};

export default BoletaHistorial;
