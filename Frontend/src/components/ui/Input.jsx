// src/components/ui/Input.jsx
import classNames from "classnames";
import { IconLoader2 } from "@tabler/icons-react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = "",
  isInvalid = false,
  errorMessage = "",
}) => {
  return (
    <div className="space-y-1 relative">
      {label && (
        <label htmlFor={name} className="block text-texto mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={20} className="text-white/40" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled || loading}
          className={classNames(
            "w-full bg-white/5 text-texto rounded-lg border transition",
            "focus:outline-none focus:ring-1",
            Icon ? "pl-10 pr-10" : "px-3",
            "py-2",
            loading ? "pr-10" : "",
            isInvalid
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-white/20 focus:border-acento focus:ring-acento",
            className
          )}
        />

        {(loading || isInvalid) && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {loading ? (
              <IconLoader2 size={20} className="animate-spin text-white/60" />
            ) : null}
          </div>
        )}
      </div>

    </div>
  );
};

export default Input;