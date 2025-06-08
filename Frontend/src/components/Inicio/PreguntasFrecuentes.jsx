import { useState } from "react";

const preguntas = [
  {
    titulo: "¿Necesito habilitar la ubicación?",
    contenido:
      "No es obligatorio. También podés buscar proveedores escribiendo manualmente tu zona.",
  },
  {
    titulo: "¿Los datos de velocidad son reales?",
    contenido:
      "Sí, los resultados provienen de tests realizados por usuarios en tiempo real usando nuestras herramientas integradas.",
  },
  {
    titulo: "¿Red-Fi cobra por el servicio?",
    contenido:
      "No. Red-Fi es totalmente gratuito. Nuestro objetivo es ayudarte a encontrar la mejor conexión en Corrientes.",
  },
  {
    titulo: "¿Qué puedo hacer con las boletas?",
    contenido:
      "Podés guardarlas para recibir notificaciones antes del vencimiento y ver si hubo aumentos en el monto mes a mes.",
  },
  {
    titulo: "¿Quiénes pueden dejar opiniones?",
    contenido:
      "Cualquier usuario registrado puede dejar una reseña sobre su experiencia con un proveedor de internet.",
  },
  {
    titulo: "¿Qué tipo de proveedores aparecen?",
    contenido:
      "Aparecen tanto grandes empresas como ISPs locales que operan en Corrientes. Vos decidís cuál te conviene más.",
  },
];

const PreguntasFrecuentes = () => {

  return (
    <section className="py-16 px-4 sm:px-6 bg-white/5 text-texto">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-texto text-center">Preguntas Frecuentes</h2>

        <div className="grid gap-10 sm:grid-cols-2">
          {preguntas.map((item, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-bold text-acento">{item.titulo}</h3>
              <p className="leading-relaxed">
                {item.contenido}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreguntasFrecuentes;
