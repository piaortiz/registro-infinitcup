/**
 * Sistema de Registro por DNI - GITHUB PAGES v4.3
 * Casino Magic - Eventos
 * 
 * FLUJO NUEVO:
 * 1. Pantalla DNI → Validación argentina local
 * 2. Pantalla Formulario → Completar datos  
 * 3. Al enviar → Una sola llamada que verifica duplicados Y registra
 * 
 * MEJORAS: Sin verificación previa, una sola llamada API, carga más rápida
 */

// Usar configuración global o fallback
const CONFIG = window.APP_CONFIG || {
    apiUrl: 'https://script.google.com/macros/s/AKfycbwf-1NsI6gyUqR9_Bk_N5B06R9CiY05Rfn9K2xHao7UfZJS2e3OLlmAqONzBc9noo4A/exec',
    demoMode: false
};

// Variables esenciales
let currentDni = null;
let elements = {};

// Pantallas
const SCREENS = {
    DNI_CHECK: 'dniScreen',
    REGISTRATION: 'registrationScreen',
    ALREADY_REGISTERED: 'alreadyRegisteredScreen'
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    showScreen(SCREENS.DNI_CHECK);
    elements.dniInput?.focus();
});

// Elementos del DOM
function initializeElements() {
    elements = {
        dniInput: document.getElementById('dniInput'),
        checkDniBtn: document.getElementById('checkDniBtn'),
        displayDni: document.getElementById('displayDni'),
        registrationForm: document.getElementById('registrationForm'),
        nombreCompletoInput: document.getElementById('nombreCompletoInput'),
        fechaNacimientoInput: document.getElementById('fechaNacimientoInput'),
        emailInput: document.getElementById('emailInput'),
        telefonoInput: document.getElementById('telefonoInput'),
        participantConfirms: document.getElementById('participantConfirms'),
        submitBtn: document.getElementById('submitBtn'),
        backBtn: document.getElementById('backBtn'),
        existingParticipantName: document.getElementById('existingParticipantName'),
        existingParticipantDni: document.getElementById('existingParticipantDni'),
        backToStartBtn: document.getElementById('backToStartBtn'),
        message: document.getElementById('message')
    };
}

// ===== NAVEGACIÓN =====
function showScreen(screenName) {
    // Ocultar todas las pantallas
    Object.values(SCREENS).forEach(screen => {
        const element = document.getElementById(screen);
        if (element) element.style.display = 'none';
    });
    
    // Mostrar pantalla solicitada
    const targetScreen = document.getElementById(screenName);
    if (targetScreen) targetScreen.style.display = 'block';
    
    // Control del header
    document.body.classList.toggle('hide-header', screenName !== SCREENS.DNI_CHECK);
    
    clearMessage();
}

function goToRegistrationForm(dni) {
    currentDni = dni;
    elements.displayDni.textContent = dni;
    showScreen(SCREENS.REGISTRATION);
    setTimeout(() => elements.nombreCompletoInput?.focus(), 100);
}

function goToAlreadyRegistered(data) {
    elements.existingParticipantName.textContent = data.nombre || data.nombreCompleto || '';
    elements.existingParticipantDni.textContent = `DNI: ${data.dni}`;
    showScreen(SCREENS.ALREADY_REGISTERED);
}

function goBackToDniCheck() {
    elements.registrationForm?.reset();
    if (elements.dniInput) elements.dniInput.value = '';
    currentDni = null;
    showScreen(SCREENS.DNI_CHECK);
    setTimeout(() => elements.dniInput?.focus(), 100);
}

// ===== EVENTOS =====
function setupEventListeners() {
    // DNI input - solo números
    elements.dniInput?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    });
    
    // Enter en DNI input
    elements.dniInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCheckDni();
    });
    
    // Botón continuar con DNI
    elements.checkDniBtn?.addEventListener('click', handleCheckDni);
    
    // Formulario de registro
    elements.registrationForm?.addEventListener('submit', handleRegistrationSubmit);
    
    // Botones de navegación
    elements.backBtn?.addEventListener('click', goBackToDniCheck);
    elements.backToStartBtn?.addEventListener('click', goBackToDniCheck);
}

// ===== VERIFICACIÓN DNI (SOLO VALIDACIÓN LOCAL) =====
async function handleCheckDni() {
    const dni = elements.dniInput?.value?.trim();
    
    if (!validateDniArgentino(dni)) {
        showMessage('Ingresá un DNI argentino válido (7-8 números).', 'error');
        return;
    }
    
    elements.checkDniBtn.disabled = true;
    elements.checkDniBtn.textContent = 'VALIDANDO...';
    
    // Simulamos un pequeño delay para UX
    setTimeout(() => {
        elements.checkDniBtn.disabled = false;
        elements.checkDniBtn.textContent = 'CONTINUAR';
        goToRegistrationForm(dni);
    }, 500);
}

// ===== REGISTRO (VERIFICACIÓN Y REGISTRO EN UNA SOLA LLAMADA) =====
async function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    if (!validatePersonalData()) return;
    
    // Obtener nombre completo sin separar
    const nombreCompleto = elements.nombreCompletoInput.value.trim();
    
    console.log('📝 Datos a enviar - nombreCompleto:', nombreCompleto);
    
    const data = {
        dni: currentDni,
        nombreCompleto: nombreCompleto,
        fechaNacimiento: elements.fechaNacimientoInput.value,
        email: elements.emailInput.value.trim(),
        telefono: elements.telefonoInput.value.trim(),
        confirma: elements.participantConfirms.checked
    };
    
    elements.submitBtn.disabled = true;
    elements.submitBtn.textContent = 'REGISTRANDO...';
    
    // Mostrar modal de carga
    showLoadingModal('Verificando tu DNI...', 'Validando que no esté registrado previamente.', 'verifying');
    
    try {
        // Esperar un momento para mostrar el primer estado
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Cambiar a estado de procesamiento
        updateLoadingModal('Procesando registro...', 'Guardando tu información en el sistema.', 'processing');
        
        // Una sola llamada que verifica duplicados Y registra
        const response = await sendRegistration(data);
        console.log('🔍 Respuesta del servidor:', response);
        console.log('🔍 Respuesta completa:', JSON.stringify(response, null, 2));
        
        // Ocultar modal de carga
        hideLoadingModal();
        
        if (response.success || response.status === 'SUCCESS') {
            console.log('✅ Registro exitoso');
            clearMessage();
            showSuccessMessage(nombreCompleto);
        } else if (response.status === 'DUPLICATE') {
            // DNI ya registrado
            console.log('⚠️ DNI duplicado');
            showMessage('Este DNI ya está registrado. Recordá que el ganador debe estar presente en el evento.', 'warning');
            goToAlreadyRegistered(response.existingData);
        } else {
            console.log('❌ Error en registro:', response);
            console.log('❌ Error mensaje:', response.message);
            console.log('❌ Error status:', response.status);
            showMessage(response.message || 'Error al procesar el registro.', 'error');
        }
    } catch (error) {
        console.log('❌ Error de conexión:', error);
        
        // Mostrar estado de error en el modal antes de ocultar
        updateLoadingModal('Error de conexión', 'No se pudo conectar con el servidor.', 'error');
        
        // Esperar un momento para que el usuario vea el error
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Ocultar modal de carga
        hideLoadingModal();
        
        showMessage('Error al procesar. Intentá nuevamente.', 'error');
    } finally {
        // Restaurar estado del botón
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'REGISTRARSE';
    }
}

// ===== VALIDACIONES MEJORADAS =====
function validateDniArgentino(dni) {
    if (!dni || !/^\d{7,8}$/.test(dni)) return false;
    
    // Validación específica para DNI argentino
    const dniNum = parseInt(dni);
    
    // Rango válido para DNI argentino
    if (dniNum < 1000000 || dniNum > 99999999) return false;
    
    // Validaciones adicionales para DNI argentino
    // DNIs muy bajos o secuenciales suelen ser inválidos
    if (dniNum < 3000000) return false;
    
    // DNI no puede ser todos números iguales
    if (/^(\d)\1+$/.test(dni)) return false;
    
    return true;
}

function validatePersonalData() {
    const fields = [
        { element: elements.nombreCompletoInput, message: 'Ingresá tu nombre y apellido.' },
        { element: elements.fechaNacimientoInput, message: 'Ingresá tu fecha de nacimiento.' },
        { element: elements.emailInput, message: 'Ingresá un email válido.' },
        { element: elements.telefonoInput, message: 'Ingresá tu teléfono.' }
    ];
    
    for (const field of fields) {
        if (!field.element?.value?.trim()) {
            showMessage(field.message, 'error');
            field.element?.focus();
            return false;
        }
    }
    
    // Validar que tenga al menos nombre y apellido (mínimo 2 palabras)
    const nombreCompleto = elements.nombreCompletoInput.value.trim();
    if (nombreCompleto.split(' ').filter(word => word.length > 0).length < 2) {
        showMessage('Ingresá tu nombre y apellido completos.', 'error');
        elements.nombreCompletoInput.focus();
        return false;
    }
    
    if (!validateEmail(elements.emailInput.value)) {
        showMessage('Ingresá un email válido.', 'error');
        elements.emailInput.focus();
        return false;
    }
    
    if (!elements.participantConfirms?.checked) {
        showMessage('Debés confirmar tu participación.', 'error');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== COMUNICACIÓN API SIMPLIFICADA =====
async function makeRequest(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        // Extraer el nombre del callback de la URL
        const callbackMatch = url.match(/callback=([^&]+)/);
        if (!callbackMatch) {
            reject(new Error('No se encontró callback en la URL'));
            return;
        }
        
        const callbackName = callbackMatch[1];
        const script = document.createElement('script');
        
        console.log('🔗 Creando callback:', callbackName);
        
        const cleanup = () => {
            if (script.parentNode) {
                document.head.removeChild(script);
            }
            delete window[callbackName];
        };
        
        window[callbackName] = function(response) {
            console.log('✅ Callback ejecutado:', callbackName, response);
            cleanup();
            resolve(response);
        };
        
        script.onerror = () => {
            console.error('❌ Error cargando script:', url);
            cleanup();
            reject(new Error('Error de red'));
        };
        
        script.src = url;
        document.head.appendChild(script);
        
        setTimeout(() => {
            if (window[callbackName]) {
                console.error('⏰ Timeout en callback:', callbackName);
                cleanup();
                reject(new Error('Timeout'));
            }
        }, timeout);
    });
}

// Función principal para registrar (incluye verificación de duplicados)
async function sendRegistration(data, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const callbackName = 'callback_' + Date.now();
            
            // Preparar datos sin el callback primero
            const requestData = {
                action: 'registrar',
                ...data
            };
            
            console.log('📤 Datos a enviar:', JSON.stringify(requestData, null, 2));
            
            const params = new URLSearchParams(requestData);
            const url = `${CONFIG.apiUrl}?${params}&callback=${callbackName}`;
            
            console.log('🔍 URL de petición:', url);
            
            return await makeRequest(url, 15000);
        } catch (error) {
            console.error('❌ Error en intento', attempt + 1, ':', error);
            if (attempt === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// ===== MENSAJES =====
function showMessage(message, type = 'info') {
    if (elements.message) {
        elements.message.textContent = message;
        elements.message.className = `message ${type}`;
        elements.message.style.display = 'block';
    }
}

function clearMessage() {
    if (elements.message) {
        elements.message.style.display = 'none';
    }
}

// ===== PANTALLA DE ÉXITO =====
function showSuccessMessage(nombreCompleto) {
    console.log('🎉 Mostrando modal de éxito para:', nombreCompleto);
    
    // Ocultar header
    document.body.classList.add('hide-header');
    
    // Crear el modal y agregarlo al body directamente
    const successModal = document.createElement('div');
    successModal.className = 'success-final-screen';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <div class="checkmark-container">
                    <div class="checkmark">✓</div>
                </div>
            </div>
            <h2>Registro Exitoso</h2>
            <div class="success-details">
                <p><strong>${nombreCompleto}</strong></p>
                <p>Tu registro ha sido completado correctamente.<br>Recordá que el ganador debe estar presente en el evento.</p>
            </div>
            <div class="success-actions">
                <button type="button" class="btn btn-success-primary" id="closeSuccessBtn">CERRAR</button>
            </div>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(successModal);
    
    // Agregar event listener
    successModal.querySelector('#closeSuccessBtn').addEventListener('click', () => {
        successModal.remove();
        if (window.close) {
            window.close();
        }
    });
    
    // Auto-foco en el botón después de un momento
    setTimeout(() => {
        successModal.querySelector('#closeSuccessBtn').focus();
    }, 500);
}

// ===== MODAL DE CARGA =====
function showLoadingModal(title = 'Verificando datos...', message = 'Por favor espera mientras procesamos tu información', state = 'verifying') {
    const loadingModal = document.getElementById('loadingModal');
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingMessage = document.getElementById('loadingMessage');
    const loadingContent = loadingModal?.querySelector('.loading-content');
    
    if (loadingModal && loadingTitle && loadingMessage && loadingContent) {
        loadingTitle.textContent = title;
        loadingMessage.textContent = message;
        
        // Limpiar estados anteriores
        loadingContent.classList.remove('verifying', 'processing', 'error');
        // Agregar nuevo estado
        loadingContent.classList.add(state);
        
        loadingModal.style.display = 'flex';
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        console.log('🔄 Modal de carga mostrado:', title, `(${state})`);
    }
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    
    if (loadingModal) {
        loadingModal.style.display = 'none';
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        console.log('✅ Modal de carga oculto');
    }
}

function updateLoadingModal(title, message, state = 'processing') {
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingMessage = document.getElementById('loadingMessage');
    const loadingModal = document.getElementById('loadingModal');
    const loadingContent = loadingModal?.querySelector('.loading-content');
    
    if (loadingTitle && loadingMessage && loadingContent) {
        // Animación suave al cambiar
        loadingTitle.style.opacity = '0.5';
        loadingMessage.style.opacity = '0.5';
        
        setTimeout(() => {
            loadingTitle.textContent = title;
            loadingMessage.textContent = message;
            
            // Cambiar estado visual
            loadingContent.classList.remove('verifying', 'processing', 'error');
            loadingContent.classList.add(state);
            
            // Restaurar opacidad
            loadingTitle.style.opacity = '1';
            loadingMessage.style.opacity = '1';
        }, 150);
        
        console.log('🔄 Modal de carga actualizado:', title, `(${state})`);
    }
}