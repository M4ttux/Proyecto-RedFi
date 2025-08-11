import { useNavigate } from "react-router-dom";
import { IconX, IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainButton from "../../ui/MainButton";
import Avatar from "../../ui/Avatar";
import ModalContenedor from "../../ui/ModalContenedor";
import MainLinkButton from "../../ui/MainLinkButton";

const ModalReseña = ({ reseña, onClose }) => {
  const navigate = useNavigate();
  const userId = reseña?.usuario_id;
  if (!reseña) return null;

  const estrellasLlenas = Math.round(reseña.estrellas);

  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

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
    <ModalContenedor onClose={onClose}>
      {/* Botón cerrar */}
      <MainButton
        onClick={onClose}
        variant="cross"
        title="Cerrar"
        className="absolute top-3 right-3"
      >
        <IconX size={24} />
      </MainButton>
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <Avatar fotoUrl={fotoUrl} nombre={nombre} size={20} />
      </div>
      {/* Nombre */}
      <MainH2
        className="text-center justify-center"
      >
        {nombre}
      </MainH2>
      {/* Proveedor */}
      <span className="block text-center bg-texto/5 px-3 py-1 rounded-full border border-texto/15 mb-4 w-fit mx-auto">
        Proveedor: <span className="font-bold">{proveedor}</span>
      </span>
      {/* Estrellas */}
      <div className="flex justify-center gap-1 text-yellow-600 text-2xl mb-4 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15 w-fit mx-auto">
        {Array.from({ length: 5 }).map((_, i) =>
          i < estrellasLlenas ? (
            <IconCarambolaFilled key={i} size={24} />
          ) : (
            <IconCarambola key={i} size={24} className="text-texto/75"/>
          )
        )}
      </div>
      {/* Comentario */}
      <p className="text-texto bg-texto/5 border border-texto/15 rounded-lg px-4 py-4 text-center leading-relaxed mb-6">
        {reseña.comentario}
      </p>

      {/* Botón "Ver perfil" */}
      <MainLinkButton
        onClick={() => navigate(`/usuarios/${userId}`)}
        className="w-full px-4 py-2"
      >
        Ver perfil
      </MainLinkButton>
    </ModalContenedor>
  );
};

export default ModalReseña;
