const reseñas = [
  { nombre: "Juan P.", comentario: "Excelente velocidad y atención.", estrellas: 5 },
  { nombre: "Ana G.", comentario: "Funciona bien pero a veces se corta.", estrellas: 3 },
];

const ReseñasDestacadas = () => {
  return (
    <section className="py-16 px-6 bg-fondo">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        <h2 className="text-3xl font-bold text-texto">Reseñas destacadas</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {reseñas.map((r, i) => (
            <div key={i} className="bg-secundario p-6 rounded shadow">
              <p className="text-texto italic">“{r.comentario}”</p>
              <p className="mt-3 text-sm text-gray-400">— {r.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReseñasDestacadas;
