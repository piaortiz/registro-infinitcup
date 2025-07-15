/**
 * Función para cerrar la página
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
    
    // Esperar 3 segundos y luego cerrar la ventana o redirigir
    setTimeout(() => {
        try {
            window.close(); // Intenta cerrar la ventana (puede no funcionar en todos los navegadores)
        } catch (e) {
            // Si no se puede cerrar, restauramos el contenido original
            body.innerHTML = originalContent;
            alert('Por favor, cierre esta ventana manualmente.');
        }
    }, 3000);
}

/**
 * Función para cancelar el registro y volver a la búsqueda
 * Restaura la interfaz a su estado inicial
 */
function handleCancel() {
    // Obtener referencias a los elementos
    const searchSection = document.querySelector('.search-section');
    const selectedSection = document.getElementById('selectedSection');
    const message = document.getElementById('message');
    const searchInput = document.getElementById('searchInput');
    const registrationForm = document.getElementById('registrationForm');
    
    if (searchSection) searchSection.style.display = 'block';
    if (selectedSection) selectedSection.style.display = 'none';
    if (message) message.style.display = 'none';
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    if (registrationForm) registrationForm.style.display = 'block';
    
    // Reiniciar variables globales (si están disponibles en el ámbito global)
    if (typeof selectedColaborador !== 'undefined') {
        selectedColaborador = null;
    }
    
    console.log('🔄 Cancelado - Volviendo a búsqueda');
}
