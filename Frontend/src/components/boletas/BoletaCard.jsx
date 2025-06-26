const BoletaCard = ({ boleta, onEditar, onVer, onEliminar, diferenciaTexto }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-md max-w-full">
      <table className="w-full text-sm mb-3">
        <tbody>
          <tr>
            <td className="font-semibold pr-2">Proveedor:</td>
            <td>{boleta.proveedor}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-2">Mes:</td>
            <td>{boleta.mes} {boleta.anio}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-2">Monto:</td>
            <td>${parseFloat(boleta.monto).toFixed(2)}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-2">Vencimiento:</td>
            <td>{new Date(boleta.vencimiento).toLocaleDateString("es-AR")}</td>
          </tr>
          {diferenciaTexto && (
            <tr>
              <td className="font-semibold pr-2">Variación:</td>
              <td className="italic">{diferenciaTexto}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => onVer(boleta)}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-bold"
        >
          Ver
        </button>
        <button
          onClick={() => onEditar(boleta)}
          className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm text-black font-bold"
        >
          Modificar
        </button>
        <button
          onClick={() => onEliminar(boleta)}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-bold"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default BoletaCard;
