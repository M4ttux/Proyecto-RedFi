import { IconFileDescription } from '@tabler/icons-react';
import MainH1 from '../ui/MainH1';
const BoletasLayout = ({ children }) => {
  return (
    <section className="py-20 px-6 text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <MainH1 icon={IconFileDescription}>Mis boletas</MainH1>
        {children}
      </div>
    </section>
  );
};

export default BoletasLayout;
