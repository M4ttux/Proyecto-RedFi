import React from "react";
import classNames from "classnames";
import { IconLoader2 } from "@tabler/icons-react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  icon: Icon = null,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition focus:outline-none duration-300";

  const variants = {
    primary: "bg-primario text-white hover:bg-acento",
    accent: "bg-acento text-white hover:bg-primario",
    secondary: "bg-white/10 text-texto hover:bg-white/20",
    danger: "bg-red-600 text-white hover:bg-red-700",
    disabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
  };

  const disabledStyles = "opacity-50 pointer-events-none"; // solo visual y bloqueo

  const finalClass = classNames(
    baseStyles,
    variants[variant],
    {
      [disabledStyles]: disabled || loading,
    },
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={finalClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <IconLoader2 size={20} className="animate-spin" />
      ) : (
        Icon && <Icon size={20} />
      )}
      {children}
    </button>
  );
};

export default Button;
