/* import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";

const Inicio = () => {
  return (
    <div>

      <HeroSection />

      <div className="p-6 max-w-6xl mx-auto space-y-16">
        <section className="text-center px-6 space-y-4">
          <h2 className="text-3xl font-bold text-primario">¿Qué es Red-Fi?</h2>
          <p className="text-lg text-texto">
            Red-Fi es una plataforma web que te ayuda a conocer qué proveedores de Internet están disponibles en tu zona,
            cómo funcionan realmente y qué opinan otros usuarios como vos.
          </p>
        </section>

        <section className="text-center space-y-10">
          <h2 className="text-2xl font-semibold text-primario">Características principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secundario p-6 rounded shadow space-y-2">
              <h3 className="text-lg font-bold text-primario">Mapa interactivo</h3>
              <p className="text-texto">Visualizá proveedores disponibles en tu zona con un mapa fácil de usar.</p>
            </div>
            <div className="bg-secundario p-6 rounded shadow space-y-2">
              <h3 className="text-lg font-bold text-primario">Reseñas reales</h3>
              <p className="text-texto">Conocé la experiencia de otros usuarios antes de decidir.</p>
            </div>
            <div className="bg-secundario p-6 rounded shadow space-y-2">
              <h3 className="text-lg font-bold text-primario">Herramientas útiles</h3>
              <p className="text-texto">Medí tu velocidad o analizá tu señal Wi-Fi directamente desde Red-Fi.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primario text-center">Reseñas destacadas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secundario p-4 rounded shadow">
              <p className="text-texto">"Excelente velocidad y atención al cliente. Desde que me cambié, no tuve problemas."</p>
              <p className="text-sm text-gray-500 mt-2">— Juan P.</p>
            </div>
            <div className="bg-secundario p-4 rounded shadow">
              <p className="text-texto">"Funciona bien pero a veces se corta. Ideal si no dependés del 100% de estabilidad."</p>
              <p className="text-sm text-gray-500 mt-2">— Ana G.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inicio;
 */

import HeroSection from "../components/HeroSection";

const Inicio = () => {
  return (
    <div>
      <HeroSection />
      <section className="bg-fondo text-texto py-16 px-6 max-w-6xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-center text-primario">¿Por qué usar Red-Fi?</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Característica 1 */}
          <div className="bg-secundario p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold text-primario mb-2">Mapa Interactivo</h3>
            <p>
              Visualizá qué proveedores están disponibles en tu zona con un mapa fácil de usar y visualmente claro.
            </p>
          </div>

          {/* Característica 2 */}
          <div className="bg-secundario p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold text-primario mb-2">Opiniones Reales</h3>
            <p>
              Leé reseñas de usuarios reales y descubrí qué tan bien funciona cada proveedor en tu barrio.
            </p>
          </div>

          {/* Característica 3 */}
          <div className="bg-secundario p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold text-primario mb-2">Herramientas Útiles</h3>
            <p>
              Usá nuestro test de velocidad y análisis Wi-Fi para entender el estado de tu conexión actual.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-fondo text-texto py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-primario mb-10">Lo que dicen nuestros usuarios</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Reseña 1 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">"Desde que uso Red-Fi, pude encontrar un proveedor mucho más rápido y confiable."</p>
            <p className="mt-4 text-sm text-gray-400">— Juan P., Corrientes</p>
          </div>

          {/* Reseña 2 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">"La visualización en el mapa me ayudó a ver claramente qué zonas están mejor conectadas."</p>
            <p className="mt-4 text-sm text-gray-400">— Ana G., Capital</p>
          </div>

          {/* Reseña 3 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">"Las reseñas reales de usuarios me evitaron elegir mal. ¡Muy útil!"</p>
            <p className="mt-4 text-sm text-gray-400">— Marcos L., Resistencia</p>
          </div>

          {/* Reseña 4 */}
          <div className="bg-secundario p-6 rounded shadow">
            <p className="italic text-texto">"Ideal para recomendar a quienes no saben qué proveedor contratar."</p>
            <p className="mt-4 text-sm text-gray-400">— Camila F., Goya</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Inicio;
