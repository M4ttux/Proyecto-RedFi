import { useState, useRef, useEffect } from "react";
import { IconMessageChatbot } from '@tabler/icons-react';

const flujoConversacion = {
  inicio: {
    mensaje: "Hola 👋, soy el asistente de Red-Fi. ¿Cómo estás?",
    opciones: [
      { texto: "Tengo dudas", siguiente: "dudas" },
      { texto: "Tengo problemas", siguiente: "problemas" },
    ],
  },
  dudas: {
    mensaje: "Claro, ¿sobre qué quieres saber más?",
    opciones: [
      {
        texto: "¿Qué es Red-Fi?",
        respuesta:
          "Red-Fi es una plataforma que te ayuda a conocer la cobertura y calidad de proveedores de Internet en tu zona. Te permite comparar servicios y mejorar tu conexión.",
      },
      {
        texto: "¿Qué herramientas tiene Red-Fi?",
        respuesta:
          "Red-Fi ofrece un mapa interactivo, test de velocidad, reseñas de usuarios y buscador de proveedores.",
      },
      {
        texto: "¿Cómo puedo registrarme?",
        respuesta:
          "Registrarte es fácil: solo necesitas tu correo electrónico y una contraseña. ¡Es gratis!",
      },
      { texto: "Volver al inicio", siguiente: "inicio" },
    ],
  },
  problemas: {
    mensaje: "Entiendo, ¿qué problema estás teniendo?",
    opciones: [
      {
        texto: "Internet lento",
        respuesta:
          "Si tu internet está lento, reinicia el router, desconecta dispositivos innecesarios y prueba usar un cable de red si es posible.",
      },
      {
        texto: "Sin conexión",
        respuesta:
          "Verifica cables, luces del router y prueba reiniciarlo. Si sigue sin funcionar, contacta a tu proveedor.",
      },
      {
        texto: "Problemas con el WiFi",
        respuesta:
          "Intenta reiniciar el router. Si el problema persiste, acércate al router, prueba cambiar la banda (2.4GHz/5GHz) o revisa interferencias.",
      },
      {
        texto: "Mejorar señal WiFi",
        respuesta:
          "Ubica el router en un lugar alto y central. Evita paredes gruesas o electrodomésticos cerca. Considera un repetidor o un sistema Mesh.",
      },
      {
        texto: "Corte de servicio",
        respuesta:
          "Consulta la página de tu proveedor o llama al soporte. También puedes preguntar a vecinos si están sin servicio.",
      },
      { texto: "Volver al inicio", siguiente: "inicio" },
    ],
  },
};

const Soporte = () => {
  useEffect(() => {
    document.title = "Red-Fi | Soporte";
  }, []);

  const [mensajes, setMensajes] = useState([
    { autor: "bot", texto: flujoConversacion.inicio.mensaje },
  ]);
  const [opciones, setOpciones] = useState(flujoConversacion.inicio.opciones);
  const [escribiendo, setEscribiendo] = useState(false);
  const chatRef = useRef(null);

  const manejarSeleccion = (opcion) => {
    setMensajes((prev) => [...prev, { autor: "user", texto: opcion.texto }]);
    setOpciones(null); // Ocultar botones temporalmente
    setEscribiendo(true);

    setTimeout(() => {
      if (opcion.siguiente) {
        const siguientePaso = flujoConversacion[opcion.siguiente];
        setMensajes((prev) => [
          ...prev,
          { autor: "bot", texto: siguientePaso.mensaje },
        ]);
        setOpciones(siguientePaso.opciones);
      } else if (opcion.respuesta) {
        setMensajes((prev) => [
          ...prev,
          { autor: "bot", texto: opcion.respuesta },
        ]);
        setOpciones([
          { texto: "Volver al inicio", siguiente: "inicio" },
          { texto: "Tengo otra duda", siguiente: "dudas" },
          { texto: "Tengo otro problema", siguiente: "problemas" },
        ]);
      }
      setEscribiendo(false);
    }, 800); // Tiempo de espera simulado
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajes, escribiendo]);

  return (
    <div className="w-full max-w-lg mx-auto bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg p-2 sm:p-4 flex flex-col h-[70vh] sm:h-[700px]">
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center justify-center">
        <IconMessageChatbot size={48} className="inline-block mr-2 text-acento" />
        Asistente Red-Fi
      </h1>

      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 p-2">
        {mensajes.map((m, index) => (
          <div
            key={index}
            className={`flex ${
              m.autor === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                m.autor === "bot"
                  ? "bg-neutral-800 text-texto text-left"
                  : "bg-blue-700 text-white text-right"
              }`}
            >
              {m.texto}
            </div>
          </div>
        ))}

        {escribiendo && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-neutral-800 text-texto text-left animate-pulse">
              Escribiendo...
            </div>
          </div>
        )}
      </div>

      {opciones && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {opciones.map((op, index) => (
            <button
              key={index}
              onClick={() => manejarSeleccion(op)}
              className={`py-2 px-3 rounded-lg ${
                op.texto === "Volver al inicio"
                  ? "bg-gray-700 hover:bg-gray-800 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {op.texto}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Soporte;
