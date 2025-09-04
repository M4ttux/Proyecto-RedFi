const { getExecOutput } = require( './api-handlers-helpers' );
var os = require('os');

exports.testSpeedHandler = async() => {
    console.log('🔄 Starting speedtest with fast-cli...');
    
    try {
        const testCommandOutput = await getExecOutput( 'fast --upload --json' )
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
        return {
            status: 500,
            data: {
                error: 'Speedtest failed',
                message: error.message,
                server: os.hostname(),
                os: process.platform,
                timestamp: new Date().toISOString()
            }
        }
    }
}