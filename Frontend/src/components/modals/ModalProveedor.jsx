const ModalProveedor = ({ proveedor, onClose, navigate }) => {
  if (!proveedor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-secundario p-6 rounded-lg max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg hover:text-acento transition-colors"
        >
          ✖
        </button>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">{proveedor.nombre}</h2>
        <p>
          <strong>Tecnología:</strong> {proveedor.tecnologia}
        </p>
        <p>
          <strong>Color:</strong> {proveedor.color}
        </p>
        <button
          className="mt-4 bg-primario px-4 py-2 rounded hover:bg-acento transition"
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
