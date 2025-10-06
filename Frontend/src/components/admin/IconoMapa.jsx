import { IconMap } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";

const IconoMapa = ({ zona, onClick, className = "" }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick && zona) {
      onClick(zona);
    }
  };

  if (!zona) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-texto/75 text-xs">Sin zona</span>
      </div>
    );
  }

  return (
    <MainButton
      onClick={handleClick}
      variant="secondary"
      className={`px-2 py-1 ${className}`}
      title={`Ver zona ${zona.departamento} en el mapa`}
      icon={IconMap}
      iconSize={16}
    />
  );
};

export default IconoMapa;