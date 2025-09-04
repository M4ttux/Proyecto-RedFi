const cors = require('cors')
const express = require("express");
const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 8000
const { testSpeedHandler } = require( './api-handlers' )

require('dotenv').config();

// CORS configurado para permitir Vercel y debugging
const corsOptions = {
    origin: true, // Temporalmente permitir todos los orígenes para debugging
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}
app.use(cors(corsOptions));

// Middleware para parsing JSON
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test endpoint simple (sin fast-cli)
app.get("/test", (req, res) => {
    console.log('🧪 Test endpoint called');
    res.status(200).json({ 
        message: "Server is working!", 
        server: require('os').hostname(),
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Mock speedtest endpoint para testing
app.get("/mock", (req, res) => {
    console.log('🎭 Mock speedtest called');
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
        res.status(200).json({
            downloadSpeed: Math.floor(Math.random() * 100) + 50, // 50-150 Mbps
            uploadSpeed: Math.floor(Math.random() * 50) + 10,    // 10-60 Mbps  
            latency: Math.floor(Math.random() * 30) + 10,       // 10-40 ms
            server: require('os').hostname(),
            os: process.platform,
            timestamp: new Date().toISOString(),
            isMock: true
        });
    }, 2000); // 2 segundos de delay
});

// Speedtest endpoint
app.get("/", async ( req, res ) => { 
    console.log('🚀 Speedtest request received from:', req.get('origin') || 'unknown origin');
    console.log('🚀 User-Agent:', req.get('user-agent'));
    
    try {
        console.log('⏳ Starting speedtest...');
        const speedTestData = await testSpeedHandler()
        console.log('✅ Speedtest completed:', speedTestData.status);
        
        res.status( speedTestData.status )
        res.send( speedTestData.data )    
    } catch (error) {
        console.error('❌ Speedtest error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen( PORT, () => {
    console.log( `🚀 Red-Fi Speedtest Server listening on port ${ PORT }` );
    console.log( `Environment: ${process.env.NODE_ENV || 'development'}` );
});