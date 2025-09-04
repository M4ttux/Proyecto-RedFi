// src/services/speedtestService.js

// Leemos la URL del test de velocidad desde el .env
const SPEEDTEST_URL = import.meta.env.VITE_SPEEDTEST_API_URL;

console.log('🔧 Speedtest service initialized with URL:', SPEEDTEST_URL);

// Esta función llama al servidor y devuelve los datos del test usando fetch
export async function ejecutarSpeedtest() {
  console.log('🚀 Starting speedtest request...');
  
  try {
    console.log('📡 Fetching from:', SPEEDTEST_URL);
    
    const response = await fetch(SPEEDTEST_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Agregar timeout más largo para speedtest
      signal: AbortSignal.timeout(120000) // 2 minutos (120 segundos)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response not OK:', errorText);
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Speedtest data received:', data);
    
    // data contendrá uploadSpeed, downloadSpeed, latency, etc.
    return data;
  } catch (error) {
    console.error('💥 Error al obtener la prueba de velocidad:', error);
    
    if (error.name === 'TimeoutError') {
      throw new Error('El test de velocidad tardó demasiado tiempo (más de 2 minutos)');
    }
    
    throw new Error(`No se pudo ejecutar el test de velocidad: ${error.message}`);
  }
}

// Función de prueba simple
export async function probarConexion() {
  const testUrl = SPEEDTEST_URL.replace('/', '/test');
  console.log('🧪 Testing connection to:', testUrl);
  
  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    console.log('✅ Connection test successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    throw error;
  }
}
