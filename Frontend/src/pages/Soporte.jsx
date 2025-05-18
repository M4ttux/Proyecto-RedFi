import { useEffect, useRef, useState } from "react";

const Soporte = () => {
  const [mensajes, setMensajes] = useState([]);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [modoEntradaLibre, setModoEntradaLibre] = useState(false);
  const [inputUsuario, setInputUsuario] = useState("");
  const [dialogoActivo, setDialogoActivo] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    document.title = "Red-Fi | Soporte";
    const mensajeInicial = {
      emisor: "bot",
      texto:
        "¡Hola! Soy Juan, tu asistente virtual de Red-Fi. ¿En qué puedo ayudarte hoy?",
      opciones: [
        "Ver proveedores disponibles",
        "Reportar un problema",
        "Contactar con soporte humano",
        "Saber más sobre Red-Fi",
      ],
    };
    setMensajes([mensajeInicial]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const manejarOpcion = (opcion) => {
    agregarMensaje("usuario", opcion);
    setEsperandoRespuesta(true);

    setTimeout(() => {
      let respuesta = "";

      switch (opcion) {
        case "Ver proveedores disponibles":
          respuesta = "Podés ver los proveedores desde la sección Mapa.";
          break;
        case "Reportar un problema":
          respuesta =
            "Entiendo. Vamos a ayudarte paso a paso. Primero, ¿qué tipo de problema estás teniendo?";
          setModoEntradaLibre(true);
          setDialogoActivo({ paso: 1, datos: {} });
          break;
        case "Contactar con soporte humano":
          respuesta =
            "Un agente humano te contactará por correo en las próximas horas.";
          break;
        case "Saber más sobre Red-Fi":
          respuesta =
            "Red-Fi te ayuda a comparar proveedores de internet según tu zona, velocidad y experiencias de otros usuarios.";
          break;
        default:
          respuesta = "No entendí tu respuesta. ¿Podés intentar de nuevo?";
      }

      agregarMensaje("bot", respuesta);
      setEsperandoRespuesta(false);
    }, 800);
  };

  const agregarMensaje = (emisor, texto) => {
    setMensajes((prev) => [...prev, { emisor, texto }]);
  };

  const enviarMensajeLibre = () => {
    if (!inputUsuario.trim()) return;
    const texto = inputUsuario.trim();
    agregarMensaje("usuario", texto);
    setInputUsuario("");
    setEsperandoRespuesta(true);

    setTimeout(() => {
      if (dialogoActivo) {
        const { paso, datos } = dialogoActivo;

        if (paso === 1) {
          agregarMensaje("bot", "¿Desde cuándo tenés este problema?");
          setDialogoActivo({ paso: 2, datos: { ...datos, tipo: texto } });
        } else if (paso === 2) {
          agregarMensaje(
            "bot",
            "¿Querés dejar tu correo para que te contactemos?"
          );
          setDialogoActivo({
            paso: 3,
            datos: { ...datos, desdeCuándo: texto },
          });
        } else if (paso === 3) {
          agregarMensaje(
            "bot",
            "¡Gracias! Registramos tu problema y te contactaremos pronto. 🙌"
          );
          setDialogoActivo(null);
          setModoEntradaLibre(false);
        }
      } else {
        agregarMensaje(
          "bot",
          "Gracias por tu mensaje. Si querés reportar un problema, seleccioná esa opción."
        );
      }

      setEsperandoRespuesta(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col bg-secundario text-texto mx-auto w-[400px] rounded-2xl">
      <div className="bg-primario px-4 py-3 text-lg font-semibold shadow text-texto">
        Soporte - Chat con Juan 🤖
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`flex mt-3 ${
              msg.emisor === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            {msg.emisor === "bot" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-400 mr-2" />
            )}

            <div className="max-w-xs">
              <div
                className={`p-3 text-sm ${
                  msg.emisor === "bot"
                    ? "bg-gray-300 text-black rounded-r-lg rounded-bl-lg"
                    : "bg-primario text-texto rounded-l-lg rounded-br-lg"
                }`}
              >
                <p>{msg.texto}</p>

                {msg.opciones && (
                  <div className="mt-3 space-y-2">
                    {msg.opciones.map((op, idx) => (
                      <button
                        key={idx}
                        disabled={esperandoRespuesta}
                        onClick={() => manejarOpcion(op)}
                        className="block w-full bg-white text-gray-900 text-left px-3 py-1 rounded hover:bg-gray-200 text-sm disabled:opacity-50 transition"
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 leading-none mt-1 block text-right">
                {msg.emisor === "bot" ? "Juan" : "Vos"}
              </span>
            </div>

            {msg.emisor === "usuario" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-500 ml-2" />
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {modoEntradaLibre && (
        <div className="bg-gray-800 p-3 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensajeLibre()}
            placeholder="Escribí tu mensaje..."
            className="flex-1 px-3 py-2 rounded-full border border-gray-600 bg-gray-900 text-texto placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={enviarMensajeLibre}
            className="bg-primario text-texto px-4 py-2 rounded-full hover:bg-acento disabled:opacity-50 transition"
            disabled={!inputUsuario.trim() || esperandoRespuesta}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default Soporte;
