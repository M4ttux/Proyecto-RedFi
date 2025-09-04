const { getExecOutput } = require( './api-handlers-helpers' );
var os = require('os');

exports.testSpeedHandler = async() => {
    console.log('🔄 Starting speedtest with fast-cli...');
    
    try {
        // Usar comando más específico y no-interactivo
        const testCommandOutput = await getExecOutput( 'npx fast-cli --upload --json --no-interaction' )
        console.log('📊 Fast-cli raw output:', testCommandOutput);

        //Handle no internet error
        if ( testCommandOutput.data == '› Please check your internet connection\n\n\n' ) 
        {    
            console.log('❌ No internet connection detected');
            testCommandOutput.status = 400
        }

        if ( testCommandOutput.status !== 200 ) 
        {    
            console.log('❌ Speedtest failed with status:', testCommandOutput.status);
            console.log('❌ Error data:', testCommandOutput.data);
            
            // Si es timeout, usar datos mock como fallback
            if (testCommandOutput.data.includes('timeout')) {
                console.log('🎭 Using mock data due to timeout');
                return {
                    status: 200,
                    data: {
                        downloadSpeed: Math.floor(Math.random() * 100) + 50,
                        uploadSpeed: Math.floor(Math.random() * 50) + 10,
                        latency: Math.floor(Math.random() * 30) + 10,
                        server: os.hostname(),
                        os: process.platform,
                        timestamp: new Date().toISOString(),
                        isMock: true,
                        reason: 'fast-cli timeout, using mock data'
                    }
                }
            }
            
            return testCommandOutput
        }

        console.log('✅ Speedtest successful, parsing JSON...');
        const parsedData = JSON.parse( testCommandOutput.data );
        
        return {
            ...testCommandOutput,
            data: {
                ...parsedData,
                server: os.hostname(),
                os: process.platform,
                timestamp: new Date().toISOString()
            }
        }
    } catch (error) {
        console.error('💥 Speedtest handler error:', error);
        
        // Fallback a datos mock si fast-cli falla completamente
        console.log('🎭 Fast-cli failed, using mock data as fallback');
        return {
            status: 200,
            data: {
                downloadSpeed: Math.floor(Math.random() * 100) + 50,
                uploadSpeed: Math.floor(Math.random() * 50) + 10,
                latency: Math.floor(Math.random() * 30) + 10,
                server: os.hostname(),
                os: process.platform,
                timestamp: new Date().toISOString(),
                isMock: true,
                reason: 'fast-cli error, using mock data'
            }
        }
    }
}