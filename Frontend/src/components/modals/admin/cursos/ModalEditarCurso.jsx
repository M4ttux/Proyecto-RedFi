import { useState, useRef, useEffect } from "react";
import { IconX, IconUpload, IconPlus, IconTrash } from "@tabler/icons-react";
import MainH2 from "../../../ui/MainH2";
import MainButton from "../../../ui/MainButton";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import ModalContenedor from "../../../ui/ModalContenedor";
import { useAlerta } from "../../../../context/AlertaContext";
import { 
  actualizarCurso, 
  validarMiniatura, 
  validarDimensionesImagen, 
  obtenerQuizPorCurso, 
  guardarQuiz, 
  validarQuiz, 
  crearPreguntaVacia, 
  validarUrlYoutube 
} from "../../../../services/cursos";

const ModalEditarCurso = ({ curso, onClose, onActualizar }) => {
  // Estados del formulario principal
  const [titulo, setTitulo] = useState(curso?.titulo || "");
  const [descripcion, setDescripcion] = useState(curso?.descripcion || "");
  const [videoUrl, setVideoUrl] = useState(curso?.video_youtube_url || "");
  const [miniatura, setMiniatura] = useState(null);
  const [previewMiniatura, setPreviewMiniatura] = useState(curso?.miniatura_url || null);
  const [mantenerMiniaturaOriginal, setMantenerMiniaturaOriginal] = useState(true);

  // Estados del quiz
  const [preguntas, setPreguntas] = useState([]);
  const [quizCargado, setQuizCargado] = useState(false);

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [step, setStep] = useState(1); // 1: Datos básicos, 2: Quiz
  
  const fileInputRef = useRef(null);
  const { mostrarError, mostrarExito } = useAlerta();

  // Cargar quiz existente
  useEffect(() => {
    const cargarQuiz = async () => {
      if (!curso?.id) return;
      
      setLoadingQuiz(true);
      try {
        const quizExistente = await obtenerQuizPorCurso(curso.id);
        
        if (quizExistente.length > 0) {
          setPreguntas(quizExistente);
        } else {
          // Si no hay quiz, crear una pregunta vacía
          setPreguntas([crearPreguntaVacia()]);
        }
        setQuizCargado(true);
      } catch (error) {
        mostrarError("Error al cargar el quiz del curso");
        setPreguntas([crearPreguntaVacia()]);
      } finally {
        setLoadingQuiz(false);
      }
    };

    cargarQuiz();
  }, [curso?.id, mostrarError]);

  // Manejo de archivo de miniatura
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
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
    setMantenerMiniaturaOriginal(false);
  };

  const removerMiniatura = () => {
    setMiniatura(null);
    setPreviewMiniatura(null);
    setMantenerMiniaturaOriginal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const restaurarMiniaturaOriginal = () => {
    setMiniatura(null);
    setPreviewMiniatura(curso?.miniatura_url || null);
    setMantenerMiniaturaOriginal(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      // Actualizar curso
      const cursoData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        video_youtube_url: videoUrl.trim()
      };

      const archivoMiniatura = mantenerMiniaturaOriginal ? null : miniatura;
      await actualizarCurso(curso.id, cursoData, archivoMiniatura);

      // Guardar quiz actualizado
      await guardarQuiz(curso.id, preguntas);

      mostrarExito("Curso actualizado exitosamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      mostrarError(error.message || "Error al actualizar el curso");
    } finally {
      setLoading(false);
    }
  };

  if (!curso) {
    return null;
  }

  return (
    <ModalContenedor onClose={onClose} className="max-w-4xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">
          {step === 1 ? "Editar curso - Datos básicos" : "Editar curso - Quiz"}
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
            <div className="space-y-3">
              <label className="block text-sm font-medium text-texto">
                Miniatura del curso
              </label>
              
              {!previewMiniatura ? (
                <div className="border-2 border-dashed border-texto/30 rounded-lg p-6 text-center">
                  <IconUpload size={48} className="mx-auto text-texto/50 mb-3" />
                  <p className="text-sm text-texto/70 mb-3">
                    Sube una nueva miniatura para el curso
                  </p>
                  <p className="text-xs text-texto/50 mb-4">
                    Máximo 100KB • Resolución máxima 500x500px • JPG, PNG, WebP
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <MainButton
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Seleccionar imagen
                  </MainButton>
                </div>
              ) : (
                <div className="border border-texto/30 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={previewMiniatura}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      {mantenerMiniaturaOriginal ? (
                        <>
                          <p className="font-medium">Miniatura actual</p>
                          <p className="text-sm text-texto/70">Miniatura existente del curso</p>
                          <div className="flex gap-2 mt-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <MainButton
                              type="button"
                              variant="secondary"
                              onClick={() => fileInputRef.current?.click()}
                              iconSize={16}
                            >
                              <IconUpload />
                              Cambiar
                            </MainButton>
                            <MainButton
                              type="button"
                              variant="danger"
                              onClick={removerMiniatura}
                              iconSize={16}
                            >
                              <IconTrash />
                              Quitar
                            </MainButton>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">
                            {miniatura ? miniatura.name : "Sin miniatura"}
                          </p>
                          {miniatura && (
                            <p className="text-sm text-texto/70">
                              {(miniatura.size / 1024).toFixed(1)} KB
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <MainButton
                              type="button"
                              variant="secondary"
                              onClick={restaurarMiniaturaOriginal}
                              iconSize={16}
                            >
                              Restaurar original
                            </MainButton>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <MainButton
                              type="button"
                              variant="secondary"
                              onClick={() => fileInputRef.current?.click()}
                              iconSize={16}
                            >
                              <IconUpload />
                              Cambiar
                            </MainButton>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Paso 2: Quiz
          <div className="space-y-6">
            {loadingQuiz ? (
              <div className="text-center py-8">
                <p className="text-texto/70">Cargando quiz...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">
                    Quiz del curso ({preguntas.length}/10 preguntas)
                  </h3>
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
                      <h4 className="font-medium">Pregunta {preguntaIndex + 1}</h4>
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
                      <p className="text-xs text-texto/70">
                        Marca la opción correcta con el radio button
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
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
                disabled={loadingQuiz}
              >
                {loadingQuiz ? "Cargando..." : "Siguiente: Quiz"}
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
                disabled={loading || loadingQuiz}
              >
                {loading ? "Actualizando..." : "Actualizar curso"}
              </MainButton>
            </>
          )}
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalEditarCurso;