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