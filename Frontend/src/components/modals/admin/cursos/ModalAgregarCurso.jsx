import { useState } from "react";
import { IconX, IconPlus, IconTrash } from "@tabler/icons-react";
import MainH2 from "../../../ui/MainH2";
import MainH3 from "../../../ui/MainH3";
import MainButton from "../../../ui/MainButton";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import FileInput from "../../../ui/FileInput";
import Badge from "../../../ui/Badge";
import ModalContenedor from "../../../ui/ModalContenedor";
import { useAlerta } from "../../../../context/AlertaContext";
import { 
  crearCurso, 
  validarMiniatura, 
  validarDimensionesImagen, 
  guardarQuiz, 
  validarQuiz, 
  crearPreguntaVacia, 
  validarUrlYoutube 
} from "../../../../services/cursos";

const ModalAgregarCurso = ({ onClose, onActualizar }) => {
  // Estados del formulario principal
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [miniatura, setMiniatura] = useState(null);
  const [previewMiniatura, setPreviewMiniatura] = useState(null);

  // Estados del quiz
  const [preguntas, setPreguntas] = useState([crearPreguntaVacia()]);

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos básicos, 2: Quiz
  
  const { mostrarError, mostrarExito } = useAlerta();

  // Manejo de archivo de miniatura
  const handleFileChange = async (file) => {
    if (!file) return;

    // Validar archivo
    const fileErrors = validarMiniatura(file);
    if (fileErrors.length > 0) {
      mostrarError(fileErrors.join(", "));
      return;
    }

    // Validar dimensiones
    const dimensionErrors = await validarDimensionesImagen(file);
    if (dimensionErrors.length > 0) {
      mostrarError(dimensionErrors.join(", "));
      return;
    }

    setMiniatura(file);
    setPreviewMiniatura(URL.createObjectURL(file));
  };

  const handleFileClear = () => {
    setMiniatura(null);
    setPreviewMiniatura(null);
  };

  // Manejo de preguntas del quiz
  const agregarPregunta = () => {
    if (preguntas.length < 10) {
      setPreguntas([...preguntas, crearPreguntaVacia()]);
    }
  };

  const eliminarPregunta = (index) => {
    if (preguntas.length > 1) {
      setPreguntas(preguntas.filter((_, i) => i !== index));
    }
  };

  const actualizarPregunta = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const actualizarOpcion = (preguntaIndex, opcionIndex, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    
    if (campo === "es_correcta" && valor) {
      // Solo una opción puede ser correcta
      nuevasPreguntas[preguntaIndex].opciones.forEach(opcion => {
        opcion.es_correcta = false;
      });
    }
    
    nuevasPreguntas[preguntaIndex].opciones[opcionIndex][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  // Validación y envío
  const validarDatosBasicos = () => {
    if (!titulo.trim()) {
      mostrarError("El título es requerido");
      return false;
    }
    if (!descripcion.trim()) {
      mostrarError("La descripción es requerida");
      return false;
    }
    
    const urlError = validarUrlYoutube(videoUrl);
    if (urlError) {
      mostrarError(urlError);
      return false;
    }

    return true;
  };

  const handleSiguiente = () => {
    if (validarDatosBasicos()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validarDatosBasicos()) return;

    // Validar quiz
    const quizErrors = validarQuiz(preguntas);
    if (quizErrors.length > 0) {
      mostrarError(quizErrors.join(", "));
      return;
    }

    setLoading(true);
    try {
      // Crear curso
      const cursoData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        video_youtube_url: videoUrl.trim()
      };

      const nuevoCurso = await crearCurso(cursoData, miniatura);

      // Guardar quiz
      await guardarQuiz(nuevoCurso.id, preguntas);

      mostrarExito("Curso creado exitosamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      mostrarError(error.message || "Error al crear el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose} className="max-w-4xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">
          {step === 1 ? "Agregar curso - Datos básicos" : "Agregar curso - Quiz"}
        </MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={loading}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 ? (
          // Paso 1: Datos básicos
          <div className="space-y-6">
            {/* Título */}
            <Input
              label="Título del curso"
              name="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Cómo solucionar problemas de internet"
              required
              maxLength={100}
              showCounter
            />

            {/* Descripción */}
            <Textarea
              label="Descripción"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe de qué trata el curso..."
              required
              maxLength={500}
              showCounter
              rows={4}
            />

            {/* URL de YouTube */}
            <Input
              label="URL del video de YouTube"
              name="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />

            {/* Miniatura */}
            <FileInput
              label="Miniatura del curso"
              accept="image/*"
              onChange={handleFileChange}
              value={miniatura}
              previewUrl={previewMiniatura}
              setPreviewUrl={setPreviewMiniatura}
              onClear={handleFileClear}
              disabled={loading}
            />
          </div>
        ) : (
          // Paso 2: Quiz
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MainH3 className="mb-0">Quiz del curso</MainH3>
                <Badge variant="accent" size="sm">
                  {preguntas.length}/10 preguntas
                </Badge>
              </div>
              <MainButton
                type="button"
                variant="accent"
                onClick={agregarPregunta}
                disabled={preguntas.length >= 10}
                iconSize={16}
              >
                <IconPlus />
                Agregar pregunta
              </MainButton>
            </div>

            {preguntas.map((pregunta, preguntaIndex) => (
              <div key={preguntaIndex} className="border border-texto/15 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Pregunta {preguntaIndex + 1}</span>
                    <Badge variant="muted" size="xs">
                      {pregunta.pregunta.length}/200
                    </Badge>
                  </div>
                  {preguntas.length > 1 && (
                    <MainButton
                      type="button"
                      variant="delete"
                      onClick={() => eliminarPregunta(preguntaIndex)}
                      iconSize={16}
                    >
                      <IconTrash />
                    </MainButton>
                  )}
                </div>

                <Textarea
                  label="Pregunta"
                  value={pregunta.pregunta}
                  onChange={(e) => actualizarPregunta(preguntaIndex, "pregunta", e.target.value)}
                  placeholder="Escribe la pregunta..."
                  required
                  maxLength={200}
                  showCounter
                  rows={2}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-texto">
                    Opciones de respuesta
                  </label>
                  {pregunta.opciones.map((opcion, opcionIndex) => (
                    <div key={opcionIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correcta_${preguntaIndex}`}
                        checked={opcion.es_correcta}
                        onChange={() => actualizarOpcion(preguntaIndex, opcionIndex, "es_correcta", true)}
                        className="w-4 h-4 text-acento"
                      />
                      <Input
                        placeholder={`Opción ${opcionIndex + 1}`}
                        value={opcion.texto}
                        onChange={(e) => actualizarOpcion(preguntaIndex, opcionIndex, "texto", e.target.value)}
                        className="flex-1"
                        required
                        maxLength={100}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-texto/75">
                    Marca la opción correcta con el radio button
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-between pt-6 border-t border-texto/15">
          {step === 1 ? (
            <>
              <MainButton
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </MainButton>
              <MainButton
                type="button"
                variant="primary"
                onClick={handleSiguiente}
              >
                Siguiente: Quiz
              </MainButton>
            </>
          ) : (
            <>
              <MainButton
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Anterior
              </MainButton>
              <MainButton
                type="button"
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear curso"}
              </MainButton>
            </>
          )}
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalAgregarCurso;