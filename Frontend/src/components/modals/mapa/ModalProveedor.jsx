import { IconX, IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import MainButton from "../../ui/MainButton";
import MainLinkButton from "../../ui/MainLinkButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";
import Avatar from "../../ui/Avatar";

const ModalProveedor = ({ proveedor, onClose }) => {
  const navigate = useNavigate();
  if (!proveedor) return null;

  // Cálculo de reseñas (cantidad y promedio)
  const reseñas = proveedor.reseñas || [];
  const cantidadResenas = proveedor.reseñas?.length || 0;
  const promedioEstrellas = proveedor.reseñas?.length
    ? proveedor.reseñas.reduce((sum, r) => sum + r.estrellas, 0) /
      proveedor.reseñas.length
    : 0;

  // Obtener tecnologías desde relación
  const tecnologias =
    proveedor.ProveedorTecnologia?.map((rel) => rel.tecnologias?.tecnologia) ||
    [];

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

      {/* Logotipo o ícono del proveedor */}
      <div className="flex justify-center mb-4">
        {proveedor.logotipo ? (
          <Avatar
            fotoUrl={proveedor.logotipo}
            nombre={proveedor.nombre}
            size={20}
            className="rounded-full"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-texto/5 flex items-center justify-center text-3xl">
            🏢
          </div>
        )}
      </div>

      {/* Nombre */}
      <MainH2 className="text-center justify-center">{proveedor.nombre}</MainH2>

      {/* Estrellas */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 w-full">
        <div className="flex gap-1 text-yellow-600 text-2xl bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15">
          {Array.from({ length: 5 }).map((_, i) =>
            i < Math.round(promedioEstrellas) ? (
              <IconCarambolaFilled key={i} size={22} />
            ) : (
              <IconCarambola key={i} size={22} className="text-texto/75"/>
            )
          )}
        </div>
        <span className="text-sm text-texto/75 ml-1">
          ({promedioEstrellas.toFixed(1)})
        </span>
      </div>

      {/* Tecnologías */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tecnologias.length > 0 ? (
          tecnologias.map((tec, index) => (
            <span
              key={index}
              className="bg-texto/5 border border-texto/15 text-xs px-3 py-1 rounded-full"
            >
              {tec}
            </span>
          ))
        ) : (
          <span className="text-sm text-texto">
            Sin tecnologías asociadas
          </span>
        )}
      </div>

      {/* Descripción */}
      <p className="text-texto bg-texto/5 border border-texto/15 rounded-lg px-4 py-4 text-center leading-relaxed mb-6">
        {proveedor.descripcion || "Este proveedor aún no tiene descripción."}
      </p>

      {/* Botón "Más información" */}
      <MainLinkButton
        onClick={() => {
          onClose();
          navigate(`/proveedores/${proveedor.id}`);
        }}
        className="w-full px-4 py-2"
      >
        Más información
      </MainLinkButton>
    </ModalContenedor>
  );
};

export default ModalProveedor;
