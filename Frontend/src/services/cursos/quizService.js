import { supabase } from "../../supabase/client";

/**
 * Obtiene todas las preguntas de un quiz por curso ID
 */
export const obtenerQuizPorCurso = async (cursoId) => {
  try {
    console.log("Buscando quiz para curso ID:", cursoId);
    const { data, error } = await supabase
      .from("quiz_preguntas")
      .select(`
        *,
        quiz_opciones(*)
      `)
      .eq("curso_id", cursoId);

    console.log("Respuesta obtenerQuizPorCurso - data:", data, "error:", error);
    
    // Debug: mostrar estructura exacta
    if (data && data.length > 0) {
      console.log("Estructura de la primera pregunta:", data[0]);
      console.log("Opciones de la primera pregunta:", data[0].quiz_opciones);
    }

    if (error) {
      // Si la tabla no existe, devolver array vacío
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Tabla 'quiz_preguntas' no existe, devolviendo array vacío");
        return [];
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error al obtener quiz:", error);
    // En lugar de lanzar error, devolver array vacío para evitar que se rompa la app
    console.warn("Devolviendo array vacío debido a error en obtenerQuizPorCurso");
    return [];
  }
};

/**
 * Crea o actualiza un quiz completo para un curso
 */
export const guardarQuiz = async (cursoId, preguntas) => {
  try {
    // Iniciar transacción eliminando preguntas existentes
    await eliminarQuizPorCurso(cursoId);

    // Crear nuevas preguntas
    for (const pregunta of preguntas) {
      const { data: nuevaPregunta, error: errorPregunta } = await supabase
        .from("quiz_preguntas")
        .insert([{
          curso_id: cursoId,
          pregunta: pregunta.pregunta
        }])
        .select()
        .single();

      if (errorPregunta) throw errorPregunta;

      // Crear opciones para esta pregunta
      const opciones = pregunta.opciones.map(opcion => ({
        pregunta_id: nuevaPregunta.id,
        opcion: opcion.texto,
        es_correcta: opcion.es_correcta
      }));

      const { error: errorOpciones } = await supabase
        .from("quiz_opciones")
        .insert(opciones);

      if (errorOpciones) throw errorOpciones;
    }

    return true;
  } catch (error) {
    console.error("Error al guardar quiz:", error);
    throw new Error("Error al guardar el quiz");
  }
};

/**
 * Elimina todas las preguntas y opciones de un curso
 */
export const eliminarQuizPorCurso = async (cursoId) => {
  try {
    // Las opciones se eliminan automáticamente por CASCADE
    const { error } = await supabase
      .from("quiz_preguntas")
      .delete()
      .eq("curso_id", cursoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al eliminar quiz:", error);
    throw new Error("Error al eliminar el quiz");
  }
};

/**
 * Valida la estructura de un quiz
 */
export const validarQuiz = (preguntas) => {
  const errors = [];

  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    errors.push("Debe haber al menos una pregunta");
    return errors;
  }

  if (preguntas.length > 10) {
    errors.push("Máximo 10 preguntas permitidas");
  }

  preguntas.forEach((pregunta, index) => {
    const preguntaNum = index + 1;

    // Validar pregunta
    if (!pregunta.pregunta || pregunta.pregunta.trim() === "") {
      errors.push(`La pregunta ${preguntaNum} no puede estar vacía`);
    }

    // Validar opciones
    if (!Array.isArray(pregunta.opciones) || pregunta.opciones.length !== 3) {
      errors.push(`La pregunta ${preguntaNum} debe tener exactamente 3 opciones`);
      return;
    }

    // Validar que todas las opciones tengan texto
    pregunta.opciones.forEach((opcion, opcionIndex) => {
      if (!opcion.texto || opcion.texto.trim() === "") {
        errors.push(`La opción ${opcionIndex + 1} de la pregunta ${preguntaNum} no puede estar vacía`);
      }
    });

    // Validar que haya exactamente una respuesta correcta
    const correctas = pregunta.opciones.filter(opcion => opcion.es_correcta);
    if (correctas.length !== 1) {
      errors.push(`La pregunta ${preguntaNum} debe tener exactamente una respuesta correcta`);
    }
  });

  return errors;
};

/**
 * Crea una pregunta vacía con estructura base
 */
export const crearPreguntaVacia = () => ({
  pregunta: "",
  opciones: [
    { texto: "", es_correcta: false },
    { texto: "", es_correcta: false },
    { texto: "", es_correcta: false }
  ]
});

/**
 * Valida URL de YouTube
 */
export const validarUrlYoutube = (url) => {
  if (!url || url.trim() === "") {
    return "La URL de YouTube es requerida";
  }

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}$/;
  
  if (!youtubeRegex.test(url)) {
    return "URL de YouTube no válida. Formatos permitidos: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID";
  }

  return null;
};