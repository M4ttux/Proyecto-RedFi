import React from "react";
import MainLinkButton from "../../components/ui/MainLinkButton";
import MainH1 from "../../components/ui/MainH1";
import MainH2 from "../../components/ui/MainH2";
import MainH3 from "../../components/ui/MainH3";
import { IconTool, IconArrowLeft } from "@tabler/icons-react";
import DetectorProveedor from "../../components/tools/DetectorProveedor";
import { useTheme } from "../../context/ThemeContext";

const DetectorProveedorv2 = () => {
  const { currentTheme } = useTheme();
  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconTool}>Detector de Proveedor</MainH1>
          <p className="text-lg">
            En esta herramienta podrás ver la información de tu red, al igual
            que tu ubicación.
          </p>
        </div>
        <div
          className={`w-full p-8 rounded-lg self-start ${
            currentTheme === "light"
              ? "bg-secundario border border-secundario/50 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
          <MainH2 className="text-center justify-center">
            Información de tu red
          </MainH2>
          <DetectorProveedor />
        </div>
        <div
          className={`w-full p-8 rounded-lg ${
            currentTheme === "light"
              ? "bg-secundario border border-secundario/50 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
            <MainH3>¿Que es la IP pública?</MainH3>
            <p>La dirección IP pública que ves es la que tu proveedor de internet asignó a tu conexión. Esta IP permite que te identifiquen en internet y cambia dependiendo de tu tipo de plan (hogar, móvil, empresa) o si reiniciás el módem. También se usa para determinar tu ubicación aproximada.</p>
        </div>
        <div
          className={`w-full p-8 rounded-lg ${
            currentTheme === "light"
              ? "bg-secundario border border-secundario/50 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
            <MainH3>¿Que es el proveedor (ISP)?</MainH3>
            <p>El proveedor que aparece es quien te brinda el acceso a internet. Este puede ser una empresa nacional, local o incluso un operador móvil. Identificar correctamente tu ISP permite comparar velocidad, estabilidad y calidad del servicio con otros usuarios en tu zona.</p>
        </div>
        <div
          className={`w-full p-8 rounded-lg ${
            currentTheme === "light"
              ? "bg-secundario border border-secundario/50 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
            <MainH3>Ciudad y región</MainH3>
            <p>Estos datos indican dónde se encuentra geográficamente la conexión, según la IP pública. Aunque no es 100% exacto, puede ayudar a detectar si tu proveedor está usando un nodo fuera de tu ciudad, lo cual puede afectar el rendimiento en aplicaciones sensibles como videojuegos o videollamadas.</p>
        </div>
        <div
          className={`w-full p-8 rounded-lg ${
            currentTheme === "light"
              ? "bg-secundario border border-secundario/50 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
            <MainH3>País</MainH3>
            <p>El país registrado es útil para saber si tu tráfico está saliendo por servidores nacionales o internacionales. En algunos casos, tener una IP extranjera (por VPN o error del proveedor) puede afectar el acceso a servicios locales o alterar resultados en plataformas de streaming, comercio, etc.</p>
        </div>
        {/* Botón volver a herramientas */}
        <div className="text-center">
          <MainLinkButton to="/herramientas" variant="secondary">
            <IconArrowLeft />
            Volver a herramientas
          </MainLinkButton>
        </div>
      </div>
    </section>
  );
};

export default DetectorProveedorv2;
