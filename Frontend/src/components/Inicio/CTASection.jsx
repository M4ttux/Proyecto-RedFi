import { Link } from "react-router-dom";
import { IconMap2 } from "@tabler/icons-react";

const CTASection = () => {
  return (
    <section className="bg-secundario text-texto py-20 text-center px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
          ¿Listo para mejorar tu conexión?
        </h2>
        <p className="text-lg text-texto/90">
          Explora el mapa interactivo y descubre qué proveedor se adapta mejor a
          tu zona.
        </p>
        <Link
          to="/mapa"
          className="inline-flex items-center gap-2 px-6 py-3 bg-acento rounded-lg hover:bg-primario hover:scale-110 transition font-bold ease-in-out duration-300"
        >
          <IconMap2 />
          Ver mapa
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
