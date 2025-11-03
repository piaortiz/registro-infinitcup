/**
 * Función para cerrar la página v4.3
 * Muestra un mensaje de despedida y cierra la ventana
 */
function closePage() {
    // Mostrar un mensaje de despedida
    const body = document.body;
    const originalContent = body.innerHTML;
    
    body.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    display: flex; justify-content: center; align-items: center; 
                    background-color: #f8f9fa; flex-direction: column; text-align: center;">
            <div style="font-size: 72px; margin-bottom: 20px;">👋</div>
            <h1>¡Gracias por utilizar el sistema!</h1>
            <p style="margin: 15px 0; font-size: 1.2em;">La aplicación se cerrará en 3 segundos...</p>
        </div>
    `;
    
    // Esperar 3 segundos y luego cerrar la ventana
    setTimeout(() => {
        try {
            window.close(); // Intenta cerrar la ventana
        } catch (e) {
            console.log('No se pudo cerrar la ventana automáticamente');
        }
        
        // Fallback: Si no se pudo cerrar, restaurar y resetear
        setTimeout(() => {
            if (!document.hidden) {
                // Restaurar contenido original
                body.innerHTML = originalContent;
                
                // Si existe la función resetApplicationToStart, usarla
                if (typeof resetApplicationToStart === 'function') {
                    resetApplicationToStart();
                } else {
                    // Fallback básico: recargar la página
                    window.location.reload();
                }
            }
        }, 1000);
    }, 3000);
}
