import { useEffect, useState } from "react";

const NotificacionAlerta = ({ mensaje, tipo, onClose }) => {
  const colores = {
    vencimiento: "bg-yellow-600",
    aumento: "bg-red-600",
    info: "bg-blue-600",
  };

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 10000); // 6 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`text-white px-4 py-3 rounded mb-4 relative ${colores[tipo]}`}>
      {mensaje}
      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="absolute top-1 right-2 text-white text-xl font-bold leading-none"
        title="Cerrar"
      >
        &times;
      </button>
    </div>
  );
};

export default NotificacionAlerta;
