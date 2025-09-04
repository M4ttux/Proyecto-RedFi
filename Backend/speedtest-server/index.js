const cors = require('cors')
const express = require("express");
const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 8000
const { testSpeedHandler } = require( './api-handlers' )

require('dotenv').config();

// CORS más restrictivo para producción
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, /\.vercel\.app$/, /\.railway\.app$/]
        : '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));

// Middleware para parsing JSON
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Speedtest endpoint
app.get("/", async ( req, res ) => { 
    try {
        const speedTestData = await testSpeedHandler()
        res.status( speedTestData.status )
        res.send( speedTestData.data )    
    } catch (error) {
        console.error('Speedtest error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen( PORT, () => {
    console.log( `🚀 Red-Fi Speedtest Server listening on port ${ PORT }` );
    console.log( `Environment: ${process.env.NODE_ENV || 'development'}` );
});