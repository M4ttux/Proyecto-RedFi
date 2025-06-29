import { IconFileDescription } from '@tabler/icons-react';
const BoletasLayout = ({ children }) => {
  return (
    <section className="py-20 px-6 text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="flex text-4xl lg:text-5xl text-center justify-center font-extrabold mb-4">
          <IconFileDescription size={48} className="inline-block mr-2 text-acento" />
          Mis boletas
        </h1>
        {children}
      </div>
    </section>
  );
};

export default BoletasLayout;
