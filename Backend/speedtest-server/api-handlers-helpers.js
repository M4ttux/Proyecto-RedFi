const { exec } = require('child_process');

class os_func{
    execCommand( cmd, timeout = 30000 ) // 30 segundos de timeout
    {
        return new Promise( ( resolve, reject ) => {
            console.log('🔧 Executing command:', cmd);
            const process = exec( cmd, { timeout }, ( err, stdout, stderr ) => {   
                
                if ( err ) 
                {
                    console.error('❌ Command error:', err.message);
                    reject( err )
                    return
                }

                if ( stderr ) 
                {
                    console.error('❌ Command stderr:', stderr);
                    reject( new Error(stderr) )
                    return
                }
                
                console.log('✅ Command success, output length:', stdout.length);
                resolve( stdout)
            });

            // Manejo manual del timeout
            setTimeout(() => {
                process.kill();
                reject(new Error('Command timeout after 30 seconds'));
            }, timeout);
        })
    }
}

exports.getExecOutput = async function( command ){
    console.log('⚡ Getting exec output for:', command);
    
    let execOutput
    const osFunction = new os_func()
    
    try {
        const result = await osFunction.execCommand( command );
        execOutput = { 'status': 200, 'data': result }
        console.log('✅ Exec output success');
    } catch ( err ) {
        console.error('❌ Exec output failed:', err.message);
        execOutput = { 'status': 400, 'data': err.message }
    }

    return execOutput
}