import { IconMap2 } from '@tabler/icons-react';

const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-acento to-primario text-texto py-20 text-center px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
          ¿Listo para mejorar tu conexión?
        </h2>
        <p className="text-lg text-texto/90">
          Explorá el mapa interactivo y descubrí qué proveedor se adapta mejor a tu zona.
        </p>
        <a
          href="/mapa"
          className="inline-flex items-center gap-2 bg-white text-acento font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-opacity-90 transition"
        >
          <IconMap2 />
          Ir al mapa
        </a>
      </div>
    </section>
  );
};

export default CTASection;
