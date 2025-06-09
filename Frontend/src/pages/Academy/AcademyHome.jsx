import React from "react";
import { Link } from "react-router-dom";

const AcademyHome = () => {
  const cursos = [
    {
      id: 1,
      titulo: "Solucioná problemas de Wi-Fi en casa",
      descripcion:
        "Aprendé a resolver fallas de conexión y mejorar la señal en tu hogar.",
      imagen:
        "https://d3puay5pkxu9s4.cloudfront.net/curso/12814/800_imagen.jpg",
    },
    {
      id: 2,
      titulo: "Velocidad y Latencia",
      descripcion:
        "Conocé cómo interpretar megas, ping y jitter en un test de velocidad.",
      imagen:
        "https://bitbr.tech/wp-content/uploads/2023/07/Tec-em-rede-de-computadores-1.jpg",
    },
    {
      id: 3,
      titulo: "Elegí el mejor proveedor",
      descripcion:
        "Compará cobertura, atención y estabilidad para elegir bien.",
      imagen:
        "https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/1/2020/10/redes_de_computadores-2048x1365-1.jpeg",
    },
  ];

  const testimonios = [
    {
      nombre: "Ethan Carter",
      fecha: "2025-03-15",
      mensaje:
        "¡Los cursos de Red-Fi Academy son excelentes! Me ayudaron a entender mi red y aplicar mejoras reales en casa.",
      estrellas: 5,
      likes: 12,
      comentarios: 1,
    },
    {
      nombre: "Sofía Benítez",
      fecha: "2025-03-22",
      mensaje:
        "Pude estudiar a mi ritmo y aplicar todo en mi trabajo como técnica de soporte. Súper claro y útil.",
      estrellas: 4,
      likes: 8,
      comentarios: 2,
    },
    {
      nombre: "Lucas Herrera",
      fecha: "2025-04-10",
      mensaje:
        "El curso de ciberseguridad fue muy completo. Me dio herramientas clave para arrancar en redes.",
      estrellas: 5,
      likes: 15,
      comentarios: 3,
    },
  ];

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 Cursos Destacados</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {cursos.map((curso) => (
          <Link to={`/academy/curso${curso.id}`} key={curso.id}>
            <div className="bg-white/10 rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
              <img
                src={curso.imagen}
                alt={curso.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-texto mb-1">
                  {curso.titulo}
                </h3>
                <p className="text-sm text-gray-300">{curso.descripcion}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl font-bold mb-2">
          ¿Por qué elegir Red-Fi Academy?
        </h2>
        <p className="text-gray-300">
          En Red-Fi Academy te brindamos formación práctica y de calidad para
          que puedas mejorar tu experiencia con internet y redes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12 text-sm">
        <div className="bg-white/10 p-4 rounded">
          <h4 className="font-semibold text-texto">👨‍🏫 Instructores expertos</h4>
          <p>Aprendé con profesionales con experiencia real en la industria.</p>
        </div>
        <div className="bg-white/10 p-4 rounded">
          <h4 className="font-semibold text-texto">📅 Aprendizaje flexible</h4>
          <p>
            Estudiá a tu ritmo desde cualquier dispositivo, en cualquier
            momento.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded">
          <h4 className="font-semibold text-texto">🛠 Contenido práctico</h4>
          <p>Aplicá lo aprendido con ejercicios reales y casos concretos.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Historias de estudiantes
      </h2>
      <div className="space-y-6 mb-12">
        {testimonios.map((t, i) => (
          <div
            key={i}
            className="bg-white/5 p-4 rounded-lg border border-white/10"
          >
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold text-texto">{t.nombre}</span>
              <span className="text-gray-400">{t.fecha}</span>
            </div>
            <div className="text-yellow-400 mb-2">
              {"★".repeat(t.estrellas)}
              {"☆".repeat(5 - t.estrellas)}
            </div>
            <p className="text-gray-200">{t.mensaje}</p>
            <div className="mt-2 text-sm text-gray-400 flex gap-4">
              <span>👍 {t.likes}</span>
              <span>💬 {t.comentarios}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔙 Botón volver al perfil */}
      <div className="text-center mt-8">
        <Link
          to="/cuenta"
          className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2 rounded transition"
        >
          ← Volver al perfil
        </Link>
      </div>
    </section>
  );
};

export default AcademyHome;
