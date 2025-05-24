import { useEffect } from "react";
import HeroSection from "../components/Inicio/HeroSection";
import Caracteristicas from "../components/inicio/Caracteristicas";
import CTASection from "../components/inicio/CTASection";
import ComoFunciona from "../components/inicio/ComoFunciona";
import ReseñasDestacadas from "../components/inicio/ReseñasDestacadas";

const Inicio = () => {
  useEffect(() => {
    document.title = "Red-Fi | Inicio";
  }, []);
  return (
    <div className="w-full">
      <HeroSection />
      <Caracteristicas />
      <ComoFunciona />
      <ReseñasDestacadas />
      <CTASection />
    </div>
  );
};

export default Inicio;
