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
      "Sí, se obtienen en tiempo real mediante herramientas de test integradas en la plataforma.",
  },
  {
    titulo: "¿Red-Fi cobra por el servicio?",
    contenido:
      "No. Red-Fi es una plataforma gratuita pensada para ayudarte a tomar decisiones informadas.",
  },
];

const ComoFunciona = () => {
  const [abierta, setAbierta] = useState(null);

  const toggle = (index) => {
    setAbierta(abierta === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-[#101010] to-[#1a1a1a] text-texto">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Texto a la izquierda */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold">¿Cómo funciona Red-Fi?</h2>
          <p className="text-texto/80 text-lg leading-relaxed">
            Usamos tu ubicación (o la que elijas) para mostrarte los
            proveedores disponibles en tu zona. Además, accedés a opiniones
            verificadas, test de velocidad y herramientas útiles para tomar
            decisiones inteligentes sobre tu conexión.
          </p>
        </div>

        {/* Desplegables a la derecha */}
        <div className="lg:w-1/2 space-y-4">
          {preguntas.map((item, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-md"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-5 py-4 font-medium text-texto flex justify-between items-center hover:bg-white/10 transition"
              >
                {item.titulo}
                <span className="text-xl text-acento">
                  {abierta === i ? "−" : "+"}
                </span>
              </button>

              <div
                className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                  abierta === i ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="p-5 pb-4 text-sm text-texto/70">
                  {item.contenido}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
