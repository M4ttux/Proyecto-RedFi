import MainH1 from "../components/ui/MainH1";
import { IconSearch } from "@tabler/icons-react";
import GlosarioBuscador from "../components/glosario/GlosarioBuscador";

const Glosario = () => {
  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconSearch}>Glosario de Redes</MainH1>
          <p className="text-texto/70 text-lg">
            Encuentra lo que buscas en nuestro glosario de redes.
          </p>
        </div>
        <GlosarioBuscador />
      </div>
    </section>
  );
};

export default Glosario;
