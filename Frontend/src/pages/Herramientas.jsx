import DetectorProveedor from "../components/DetectorProveedor";

const Herramientas = () => {
  return (
    <div className="w-full">
      <section className="py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        {/* Encabezado */}
        <div className="w-full text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4">🔧 Herramientas Red-Fi</h1>
          <p className="mx-auto">
            Ejecutá pruebas clave y obtené información útil sobre tu red actual.
          </p>
        </div>

        {/* Contenedor flex o grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Detector de proveedor */}
            <div className="w-full bg-white/5 border-t border-white/10 p-8 rounded-lg self-start">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Información de tu Red</h2>
              <DetectorProveedor />
            </div>
            {/* Test de velocidad */}
            <div className="w-full bg-white/5 border-t border-white/10 p-8 rounded-lg">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Test de Velocidad</h2>
              <iframe
                src="https://librespeed.org"
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
