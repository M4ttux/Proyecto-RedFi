import { useEffect } from "react";
import DetectorProveedor from "../components/DetectorProveedor";
import { IconTool } from '@tabler/icons-react';

const Herramientas = () => {

  useEffect(() => {
    document.title = "Red-Fi | Herramientas";
  }, []);

  return (
    <div className="w-full">
      <section className="py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        {/* Encabezado */}
        <div className="w-full text-center">
          <h1 className="flex text-4xl lg:text-5xl font-extrabold mb-4 text-center justify-center">
            <IconTool size={48} className="inline-block mr-2 text-acento" />
            Herramientas Red-Fi
          </h1>
          <p className="mx-auto">
            Ejecute pruebas clave y obtenga información útil sobre su red actual.
          </p>
        </div>

        {/* Contenedor flex o grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Detector de proveedor */}
          <div className="w-full bg-white/5 border-t border-white/10 p-8 rounded-lg self-start">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Información de tu red
            </h2>
            <DetectorProveedor />
          </div>
          {/* Test de velocidad */}
          <div className="w-full bg-white/5 border-t border-white/10 p-8 rounded-lg">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Test de velocidad
            </h2>
            <iframe
              src="https://librespeed.org/"
              className="w-full h-[400px] lg:h-[700px] rounded-lg shadow-xl border border-white/10"
              title="Test de Velocidad"
            />
          </div>

          {/* </div> */}
        </div>
      </section>
    </div>
  );
};

export default Herramientas;
