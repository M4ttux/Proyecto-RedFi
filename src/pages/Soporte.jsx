import { Link } from "react-router-dom";

const faqs = [
  {
    titulo: "Mi internet es lento, ¿qué hago?",
    descripcion:
      "Reiniciá tu módem, asegurate de que no haya descargas activas, y realizá un test de velocidad. Si persiste, contactá a tu proveedor.",
  },
  {
    titulo: "No tengo conexión",
    descripcion:
      "Verificá que los cables estén bien conectados. Si tenés luz roja en el módem, llamá a soporte técnico de tu ISP.",
  },
  {
    titulo: "¿Cómo saber si me están dando la velocidad contratada?",
    descripcion:
      "Usá la herramienta de test de velocidad en la sección 'Herramientas'. Compará el resultado con el plan que contrataste.",
  },
];

const Soporte = () => {
  return (
    <div className="min-h-screen text-texto px-6 py-12 max-w-4xl mx-auto space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-primario mb-6">Soporte técnico</h2>
        <p className="mb-4">
          Si estás teniendo problemas con tu conexión, podés revisar nuestras preguntas frecuentes
          o contactar al proveedor directamente.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-secundario p-4 rounded shadow">
              <h3 className="font-semibold text-lg text-acento">{faq.titulo}</h3>
              <p className="text-sm mt-2">{faq.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <p className="mb-4">¿No encontraste tu problema?</p>
        <Link
          to="/proveedores"
          className="inline-block px-6 py-3 bg-primario text-white rounded hover:bg-acento transition"
        >
          Contactar al proveedor
        </Link>
      </section>
    </div>
  );
};

export default Soporte;
