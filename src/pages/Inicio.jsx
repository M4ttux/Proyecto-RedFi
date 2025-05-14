import HeroSection from "../components/HeroSection";
import CaracteristaCard from "../components/CaracteristaCard";
import IconMap from "../icons/Map";
import IconOpinion from "../icons/Opinion";
import IconTool from "../icons/Tool";

const Inicio = () => {
  return (
    <div>
      <HeroSection />

      <section className="text-texto py-16 px-6 max-w-6xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-center text-texto">
          ¿Por qué usar Red-Fi?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Característica 1 */}
          <CaracteristaCard
            icono={<IconMap width={80} height={80} />}
            titulo="Mapa Interactivo"
            descripcion="Visualizá qué proveedores están disponibles en tu zona con un mapa fácil de usar y visualmente claro."
          />
          {/* Característica 2 */}
          <CaracteristaCard
            icono={<IconOpinion width={80} height={80} />}
            titulo="Opiniones Reales"
            descripcion="Leé reseñas de usuarios reales y descubrí qué tan bien funciona cada proveedor en tu barrio."
          />
          {/* Característica 3 */}
          <CaracteristaCard
            icono={<IconTool width={80} height={80} />}
            titulo="Herramientas Útiles"
            descripcion="Usá nuestro test de velocidad y análisis Wi-Fi para entender el estado de tu conexión actual."
          />
        </div>

      </section>

      <section className="text-texto py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-primario mb-10">
          Lo que dicen nuestros usuarios
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Reseña 1 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">
              "Desde que uso Red-Fi, pude encontrar un proveedor mucho más
              rápido y confiable."
            </p>
            <p className="mt-4 text-sm text-gray-400">— Juan P., Corrientes</p>
          </div>

          {/* Reseña 2 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">
              "La visualización en el mapa me ayudó a ver claramente qué zonas
              están mejor conectadas."
            </p>
            <p className="mt-4 text-sm text-gray-400">— Ana G., Capital</p>
          </div>

          {/* Reseña 3 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">
              "Las reseñas reales de usuarios me evitaron elegir mal. ¡Muy
              útil!"
            </p>
            <p className="mt-4 text-sm text-gray-400">
              — Marcos L., Resistencia
            </p>
          </div>

          {/* Reseña 4 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">
              "Ideal para recomendar a quienes no saben qué proveedor
              contratar."
            </p>
            <p className="mt-4 text-sm text-gray-400">— Camila F., Goya</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
