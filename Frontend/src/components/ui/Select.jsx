import classNames from "classnames";
import { IconLoader2, IconChevronDown } from "@tabler/icons-react";

const Select = ({
  label,
  value,
  onChange,
  options = [],
  getOptionValue = (opt) => opt,
  getOptionLabel = (opt) => opt,
  renderOption,
  className = "",
  disabled = false,
  loading = false,
  name,
  required = false,
  isInvalid = false, // ✅ NUEVO
}) => {
  return (
    <div className="space-y-1 relative">
      {label && (
        <label htmlFor={name} className="block text-texto mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          required={required}
          className={classNames(
            "w-full px-3 py-2 bg-white/5 text-texto rounded-lg border transition",
            "appearance-none pr-10 max-w-full truncate",
            "focus:outline-none focus:ring-1",
            (disabled || loading) && "cursor-not-allowed opacity-70",
            isInvalid
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-white/20 focus:border-acento focus:ring-1 focus:ring-acento",
            className
          )}
        >
          {loading ? (
            <option>Cargando...</option>
          ) : (
            options.map((opt, i) =>
              renderOption ? (
                renderOption(opt)
              ) : (
                <option key={i} value={getOptionValue(opt)}>
                  {getOptionLabel(opt)}
                </option>
              )
            )
          )}
        </select>

        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          {loading ? (
            <IconLoader2 size={20} className="animate-spin text-white/60" />
          ) : (
            <IconChevronDown size={20} className="text-white/60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;
