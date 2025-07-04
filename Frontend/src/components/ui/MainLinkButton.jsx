import { Link } from "react-router-dom";
import { IconLoader2 } from "@tabler/icons-react";
import classNames from "classnames";

const LinkButton = ({
  to,
  children,
  icon: Icon = null,
  loading = false,
  variant = "primary",
  className = "",
  disabled = false,
  iconSize = 24,
  ...props
}) => {
  const hasCustomPadding = /\bp[trblxy]?-\d+\b/.test(className);

  const baseStyles = classNames(
    variant === "card"
      ? "block text-center rounded-lg transition" // para los cards del perfil
      : "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus:outline-none duration-300", // para los botones
    !hasCustomPadding &&
      (variant === "card" ? "p-4" : "px-6 py-3")
  );

  const variants = {
    primary: "bg-primario text-white hover:bg-acento",
    accent: "bg-acento text-white hover:bg-primario",
    secondary: "bg-white/10 text-texto hover:bg-white/20",
    danger: "bg-red-600 text-white hover:bg-red-700",
    disabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
    card: "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-acento/30 text-white min-h-[130px] flex flex-col justify-center",
    curso: "flex flex-col bg-white/10 rounded-lg overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg text-white block",
  };

  const loadingStyles = "bg-gray-400 text-gray-700 cursor-not-allowed";

  const finalClass = classNames(
    baseStyles,
    loading ? loadingStyles : variants[variant],
    {
      "opacity-50 pointer-events-none": disabled || loading,
    },
    className
  );

  return (
    <Link to={to} className={finalClass} {...props}>
      {loading ? (
        <IconLoader2 size={iconSize} className="animate-spin" />
      ) : (
        Icon && <Icon size={iconSize} />
      )}
      {children}
    </Link>
  );
};

export default LinkButton;
