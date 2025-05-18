import { useEffect } from "react";
import HeroSection from "../components/Inicio/HeroSection";
import Caracteristicas from "../components/Inicio/Caracteristicas";
import CTASection from "../components/Inicio/CTASection";
import ComoFunciona from "../components/Inicio/ComoFunciona";
import ReseñasDestacadas from "../components/Inicio/ReseñasDestacadas";

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
