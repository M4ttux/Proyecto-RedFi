import { useRef, useState, useEffect } from "react";
import MainButton from "./MainButton";
import { IconX } from "@tabler/icons-react";

const FileInput = ({
  id = "archivo",
  label = "Seleccionar imagen",
  accept = "image/*, application/pdf",
  onChange,
  value = null,
  previewUrl = null,
  setPreviewUrl = null,
  onClear,
  disabled = false,
  loading = false,
  existingImage = null,
  sinPreview = false,
}) => {
  const inputRef = useRef(null);
  const [internalPreview, setInternalPreview] = useState(null);

  // Mostrar preview inicial si viene externa
  useEffect(() => {
    if (previewUrl) {
      setInternalPreview(previewUrl);
    } else if (existingImage) {
      setInternalPreview(existingImage);
    }
  }, [previewUrl, existingImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resetear el value para permitir volver a elegir el mismo archivo
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(file);

    if (!sinPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInternalPreview(reader.result);
        setPreviewUrl?.(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
    setInternalPreview(null);
    if (!sinPreview) setPreviewUrl?.(null);
    onClear?.();
  };

  const hayPreview = internalPreview;
  const mostrarPreview = !sinPreview && hayPreview;
  const mostrarBotonQuitar = value || hayPreview;

  return (
    <div className="space-y-2 text-center text-texto">
      {label && (
        <label htmlFor={id} className="block font-medium">
          {label}
        </label>
      )}

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />

      {/* Preview */}
      {mostrarPreview && (
        <div className="mt-2 flex flex-col items-center gap-2">
          <img
            src={internalPreview}
            alt="Imagen seleccionada"
            className="max-h-25 border border-texto/15 rounded-lg object-contain"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {mostrarBotonQuitar && (
            <div>
              <MainButton
                type="button"
                variant="danger"
                onClick={handleClear}
                className="flex-1"
                disabled={disabled || loading}
              >
                <IconX size={18} /> Quitar imagen
              </MainButton>
            </div>
          )}
          <label htmlFor={id}>
            <MainButton
              as="span"
              variant="accent"
              loading={loading}
              disabled={disabled}
              className="cursor-pointer flex-1"
            >
              {value || hayPreview ? "Cambiar imagen" : "Seleccionar imagen"}
            </MainButton>
          </label>
      </div>
      {/* Botón de quitar */}
    </div>
  );
};

export default FileInput;
