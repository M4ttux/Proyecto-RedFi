// src/components/boletas/BoletasLayout.jsx
const BoletasLayout = ({ children }) => {
  return (
    <section className="py-20 px-6 text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl lg:text-5xl text-center font-extrabold mb-4">
          📄 Mis Boletas
        </h1>
        {children}
      </div>
    </section>
  );
};

export default BoletasLayout;
