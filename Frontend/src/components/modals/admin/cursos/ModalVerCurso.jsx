import { useState, useEffect } from "react";
import { IconX, IconExternalLink, IconPlayerPlay, IconClipboardCheck } from "@tabler/icons-react";
import MainH2 from "../../../ui/MainH2";
import MainButton from "../../../ui/MainButton";
import ModalContenedor from "../../../ui/ModalContenedor";
import { useAlerta } from "../../../../context/AlertaContext";
import { obtenerQuizPorCurso } from "../../../../services/cursos";

const ModalVerCurso = ({ curso, onClose }) => {
  const [quiz, setQuiz] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // info, video, quiz
  const { mostrarError } = useAlerta();

  // Cargar quiz del curso
  useEffect(() => {
    const cargarQuiz = async () => {
      if (!curso?.id) return;
      
      setLoadingQuiz(true);
      try {
        const quizData = await obtenerQuizPorCurso(curso.id);
        setQuiz(quizData);
      } catch (error) {
        mostrarError("Error al cargar el quiz del curso");
      } finally {
        setLoadingQuiz(false);
      }
    };

    cargarQuiz();
  }, [curso?.id, mostrarError]);

  // Función para extraer el ID del video de YouTube
  const extraerIdYoutube = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = extraerIdYoutube(curso?.video_youtube_url);

  if (!curso) {
    return null;
  }

  return (
    <ModalContenedor onClose={onClose} className="max-w-4xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0 flex-1 pr-4">{curso.titulo}</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Navegación por tabs */}
      <div className="flex border-b border-texto/15 mb-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "info"
              ? "border-acento text-acento font-medium"
              : "border-transparent text-texto/70 hover:text-texto"
          }`}
        >
          Información
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "video"
              ? "border-acento text-acento font-medium"
              : "border-transparent text-texto/70 hover:text-texto"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "quiz"
              ? "border-acento text-acento font-medium"
              : "border-transparent text-texto/70 hover:text-texto"
          }`}
        >
          Quiz ({quiz.length} preguntas)
        </button>
      </div>

      {/* Contenido según tab activo */}
      <div className="space-y-6">
        {activeTab === "info" && (
          <>
            {/* Miniatura y datos básicos */}
            <div className="flex flex-col md:flex-row gap-6">
              {curso.miniatura_url && (
                <div className="md:w-64 flex-shrink-0">
                  <img
                    src={curso.miniatura_url}
                    alt={curso.titulo}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              )}
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-texto/70 uppercase tracking-wide mb-2">
                    Descripción
                  </h3>
                  <p className="text-texto leading-relaxed">{curso.descripcion}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-texto/70 uppercase tracking-wide mb-2">
                    Video de YouTube
                  </h3>
                  <div className="flex items-center gap-2">
                    <IconPlayerPlay size={20} className="text-red-500 flex-shrink-0" />
                    <a
                      href={curso.video_youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-acento hover:underline truncate"
                    >
                      {curso.video_youtube_url}
                    </a>
                    <IconExternalLink size={16} className="text-texto/50 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "video" && (
          <div className="space-y-4">
            {videoId ? (
              <>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={curso.titulo}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-texto/70">
                  <span>Video incrustado desde YouTube</span>
                  <MainButton
                    as="a"
                    href={curso.video_youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    iconSize={16}
                  >
                    <IconExternalLink />
                    Ver en YouTube
                  </MainButton>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <IconPlayerPlay size={48} className="mx-auto text-texto/30 mb-4" />
                <p className="text-texto/70 mb-4">No se pudo cargar el video</p>
                <MainButton
                  as="a"
                  href={curso.video_youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  iconSize={16}
                >
                  <IconExternalLink />
                  Ver en YouTube
                </MainButton>
              </div>
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-6">
            {loadingQuiz ? (
              <div className="text-center py-8">
                <p className="text-texto/70">Cargando quiz...</p>
              </div>
            ) : quiz.length === 0 ? (
              <div className="text-center py-8">
                <IconClipboardCheck size={48} className="mx-auto text-texto/30 mb-4" />
                <p className="text-texto/70">Este curso no tiene quiz configurado</p>
              </div>
            ) : (
              <>
                <div className="bg-fondo-secundario/50 rounded-lg p-4 border border-texto/10">
                  <div className="flex items-center gap-2 mb-2">
                    <IconClipboardCheck size={20} className="text-acento" />
                    <h3 className="font-medium">Información del Quiz</h3>
                  </div>
                  <p className="text-sm text-texto/70">
                    Este curso incluye un quiz de {quiz.length} pregunta{quiz.length !== 1 ? "s" : ""} para
                    evaluar los conocimientos adquiridos.
                  </p>
                </div>

                {quiz.map((pregunta, index) => (
                  <div key={pregunta.id || index} className="border border-texto/15 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-acento text-fondo w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-3">{pregunta.pregunta}</h4>
                        
                        <div className="space-y-2">
                          {pregunta.opciones.map((opcion, opcionIndex) => (
                            <div
                              key={opcion.id || opcionIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                opcion.es_correcta
                                  ? "border-green-500/30 bg-green-500/10"
                                  : "border-texto/10 bg-fondo-secundario/30"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                opcion.es_correcta
                                  ? "border-green-500 bg-green-500"
                                  : "border-texto/30"
                              }`}>
                                {opcion.es_correcta && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={
                                opcion.es_correcta
                                  ? "font-medium text-green-700 dark:text-green-300"
                                  : "text-texto/80"
                              }>
                                {opcion.texto}
                              </span>
                              {opcion.es_correcta && (
                                <span className="ml-auto text-xs text-green-600 dark:text-green-400 font-medium">
                                  Correcta
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-6 border-t border-texto/15">
        <MainButton
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerCurso;