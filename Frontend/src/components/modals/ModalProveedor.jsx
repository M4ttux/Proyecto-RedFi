const ModalProveedor = ({ proveedor, onClose, navigate }) => {
  if (!proveedor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center animate-fadeIn">
      <div className="bg-secundario p-6 rounded-xl max-w-md w-full relative shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-400 transition"
        >
          ✖
        </button>

        <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4 text-center border-b border-white/10 pb-2">
          {proveedor.nombre}
        </h2>

        <div className="space-y-2 text-texto/90 text-sm">
          <p>
            <span className="font-semibold text-acento">Tecnología:</span>{" "}
            {proveedor.tecnologia}
          </p>
          <p>
            <span className="font-semibold text-acento">Color:</span>{" "}
            <span className="inline-block align-middle">
              {proveedor.color}
              <span
                className="inline-block w-4 h-4 rounded-full ml-2 border border-white/20"
                style={{ backgroundColor: proveedor.color }}
              />
            </span>
          </p>
        </div>

        <button
          className="mt-6 w-full bg-primario hover:bg-acento text-white py-2 px-4 rounded-lg transition font-medium"
          onClick={() => {
            onClose();
            navigate(`/proveedores/${proveedor.id}`);
          }}
        >
          Más información
        </button>
      </div>
    </div>
  );
};

export default ModalProveedor;
