const ModalReseña = ({ reseña, onClose }) => {
  if (!reseña) return null;

  const estrellasLlenas = Math.round(reseña.estrellas);

  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

  // Limpieza si viene como string tipo "Usuario {\"nombre\":\"Matías\"}"
  let nombre;
  try {
    if (nombreBruto?.includes("{")) {
      const match = nombreBruto.match(/Usuario (.*)/);
      const json = match ? JSON.parse(match[1]) : null;
      nombre = json?.nombre || nombreBruto;
    } else {
      nombre = nombreBruto;
    }
  } catch {
    nombre = nombreBruto;
  }

  const proveedor =
    reseña.nombre_proveedor ||
    reseña.proveedores?.nombre ||
    reseña.proveedor?.nombre ||
    `Proveedor ID: ${reseña.proveedor_id}`;
  
  const fotoUrl =
  reseña?.user_profiles?.foto_url ||
  reseña?.user_profiles?.user?.foto_perfil ||
  null;

  const iniciales = nombre
    ? nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center animate-fadeIn">
      <div className="bg-secundario text-white p-6 rounded-2xl w-full max-w-sm shadow-2xl relative border border-white/10">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-400 transition"
        >
          ✖
        </button>

         {/* Avatar */}
        <div className="flex justify-center mb-4">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              className="w-20 h-20 rounded-full border-2 border-acento shadow-md object-cover"
              alt="Avatar del usuario"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-acento shadow-md bg-white/10 flex items-center justify-center text-xl font-bold text-white">
              {iniciales}
            </div>
          )}
        </div>

        {/* Nombre */}
        <h2 className="text-center text-lg font-semibold mb-1">{nombre}</h2>

        {/* Proveedor */}
        <p className="text-center text-xs text-texto/60 mb-3">
          Proveedor: {proveedor}
        </p>

        {/* Estrellas */}
        <div className="flex justify-center gap-1 text-yellow-400 text-2xl mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < estrellasLlenas ? "★" : "☆"}</span>
          ))}
        </div>

        {/* Comentario */}
        <p className="text-sm text-texto/90 bg-white/5 rounded-md px-4 py-3 text-center leading-relaxed">
          “{reseña.comentario}”
        </p>
      </div>
    </div>
  );
};

export default ModalReseña;
