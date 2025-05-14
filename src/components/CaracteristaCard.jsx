const CaracteristaCard = ({ titulo, descripcion, icono}) => {
  return (
    <div className="bg-secundario/40 p-6 rounded shadow text-center">
        {icono && <div className="flex justify-center mb-3 text-acento">{icono}</div>}
      <h3 className="text-xl font-semibold text-acento mb-2">
        {titulo}
      </h3>
      <p>
        {descripcion}
      </p>
    </div>
  );
};

export default CaracteristaCard;