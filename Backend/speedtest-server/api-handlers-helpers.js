const { exec } = require('child_process');

class os_func{
    execCommand( cmd, timeout = 90000 ) // 90 segundos de timeout (más tiempo para speedtest)
    {
        return new Promise( ( resolve, reject ) => {
            console.log('🔧 Executing command:', cmd);
            const process = exec( cmd, { 
                timeout,
                env: { ...process.env, CI: 'true', NODE_ENV: 'production' } // Variables para evitar prompts interactivos
            }, ( err, stdout, stderr ) => {   
                
                if ( err ) 
                {
                    console.error('❌ Command error:', err.message);
                    reject( err )
                    return
                }

                if ( stderr && !stderr.includes('warning') ) // Ignorar warnings comunes
                {
                    console.error('❌ Command stderr:', stderr);
                    reject( new Error(stderr) )
                    return
                }
                
                console.log('✅ Command success, output length:', stdout.length);
                resolve( stdout)
            });

            // Manejo manual del timeout
            const timeoutId = setTimeout(() => {
                console.log('⏰ Command timeout, killing process...');
                process.kill('SIGTERM');
                reject(new Error(`Command timeout after ${timeout/1000} seconds`));
            }, timeout);

            // Limpiar timeout si el comando termina antes
            process.on('exit', () => {
                clearTimeout(timeoutId);
            });
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