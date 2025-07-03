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
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition focus:outline-none duration-300";

  const variants = {
    primary: "bg-primario text-white hover:bg-acento",
    accent: "bg-acento text-white hover:bg-primario",
    secondary: "bg-white/10 text-texto hover:bg-white/20",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const finalClass = classNames(
    baseStyles,
    variants[variant],
    className,
    {
      "pointer-events-none opacity-50": loading,
    }
  );

  return (
    <Link to={to} className={finalClass} {...props}>
      {loading ? (
        <IconLoader2 size={20} className="animate-spin" />
      ) : (
        Icon && <Icon size={20} />
      )}
      {children}
    </Link>
  );
};

export default LinkButton;
