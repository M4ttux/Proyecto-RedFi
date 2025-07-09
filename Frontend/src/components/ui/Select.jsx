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
            "w-full px-3 py-2 bg-white/5 text-texto rounded-lg border border-white/20",
            "max-w-full truncate appearance-none pr-10", // quitamos flecha nativa y hacemos espacio
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
