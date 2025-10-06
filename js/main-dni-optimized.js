/**
 * Sistema de Registro por DNI - OPTIMIZADO v4.2
 * Casino Magic - Eventos
 */

// Configuración mínima
const CONFIG = {
    apiUrl: 'https://script.google.com/macros/s/AKfycbxxZ_auFNBLDyfp1s721eo6bxcx39X1sB3t1Bi_zxv5bncYikwmYv2AcuaPAcxY0P-N/exec'
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
        nombreInput: document.getElementById('nombreInput'),
        apellidoInput: document.getElementById('apellidoInput'),
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
    setTimeout(() => elements.nombreInput?.focus(), 100);
}

function goToAlreadyRegistered(data) {
    elements.existingParticipantName.textContent = `${data.nombre} ${data.apellido}`;
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
    
    // Botón verificar DNI
    elements.checkDniBtn?.addEventListener('click', handleCheckDni);
    
    // Formulario de registro
    elements.registrationForm?.addEventListener('submit', handleRegistrationSubmit);
    
    // Botones de navegación
    elements.backBtn?.addEventListener('click', goBackToDniCheck);
    elements.backToStartBtn?.addEventListener('click', goBackToDniCheck);
}

// ===== VERIFICACIÓN DNI =====
async function handleCheckDni() {
    const dni = elements.dniInput?.value?.trim();
    
    if (!validateDni(dni)) {
        showMessage('Ingresa un DNI válido (7-8 números)', 'error');
        return;
    }
    
    elements.checkDniBtn.disabled = true;
    elements.checkDniBtn.textContent = 'VERIFICANDO...';
    
    try {
        const response = await checkDniInServer(dni);
        
        if (response.exists) {
            showMessage('Recorda que el ganador debe estar presente en el evento', 'warning');
            goToAlreadyRegistered(response.participant);
        } else {
            goToRegistrationForm(dni);
        }
    } catch (error) {
        showMessage('Error al verificar DNI. Intenta nuevamente.', 'error');
    } finally {
        elements.checkDniBtn.disabled = false;
        elements.checkDniBtn.textContent = 'VERIFICAR';
    }
}

// ===== REGISTRO =====
async function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    if (!validatePersonalData()) return;
    
    const data = {
        dni: currentDni,
        nombre: elements.nombreInput.value.trim(),
        apellido: elements.apellidoInput.value.trim(),
        fechaNacimiento: elements.fechaNacimientoInput.value,
        email: elements.emailInput.value.trim(),
        telefono: elements.telefonoInput.value.trim(),
        confirma: elements.participantConfirms.checked
    };
    
    elements.submitBtn.disabled = true;
    elements.submitBtn.textContent = 'REGISTRANDO...';
    showMessage('Enviando registro...', 'info');
    
    try {
        const response = await sendInscription(data);
        
        if (response.success) {
            showSuccessMessage(data.nombre, data.apellido);
        } else {
            showMessage(response.message || 'Error al procesar registro', 'error');
        }
    } catch (error) {
        showMessage('Error al enviar registro. Intenta nuevamente.', 'error');
    } finally {
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'REGISTRARSE';
    }
}

// ===== VALIDACIONES =====
function validateDni(dni) {
    return dni && /^\d{7,8}$/.test(dni);
}

function validatePersonalData() {
    const fields = [
        { element: elements.nombreInput, message: 'Ingresa tu nombre' },
        { element: elements.apellidoInput, message: 'Ingresa tu apellido' },
        { element: elements.fechaNacimientoInput, message: 'Ingresa tu fecha de nacimiento' },
        { element: elements.emailInput, message: 'Ingresa un email válido' },
        { element: elements.telefonoInput, message: 'Ingresa tu teléfono' }
    ];
    
    for (const field of fields) {
        if (!field.element?.value?.trim()) {
            showMessage(field.message, 'error');
            field.element?.focus();
            return false;
        }
    }
    
    if (!validateEmail(elements.emailInput.value)) {
        showMessage('Ingresa un email válido', 'error');
        elements.emailInput.focus();
        return false;
    }
    
    if (!elements.participantConfirms?.checked) {
        showMessage('Debes confirmar tu participación', 'error');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== COMUNICACIÓN API =====
async function checkDniInServer(dni) {
    return new Promise((resolve, reject) => {
        const callbackName = 'callback_' + Date.now();
        const script = document.createElement('script');
        
        window[callbackName] = function(response) {
            document.head.removeChild(script);
            delete window[callbackName];
            resolve(response);
        };
        
        script.onerror = () => reject(new Error('Error de red'));
        script.src = `${CONFIG.apiUrl}?action=checkDni&dni=${dni}&callback=${callbackName}`;
        document.head.appendChild(script);
        
        setTimeout(() => {
            if (window[callbackName]) {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('Timeout'));
            }
        }, 10000);
    });
}

async function sendInscription(data) {
    return new Promise((resolve, reject) => {
        const callbackName = 'callback_' + Date.now();
        const script = document.createElement('script');
        
        window[callbackName] = function(response) {
            document.head.removeChild(script);
            delete window[callbackName];
            resolve(response);
        };
        
        const params = new URLSearchParams({
            action: 'processInscription',
            callback: callbackName,
            ...data
        });
        
        script.onerror = () => reject(new Error('Error de red'));
        script.src = `${CONFIG.apiUrl}?${params}`;
        document.head.appendChild(script);
        
        setTimeout(() => {
            if (window[callbackName]) {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('Timeout'));
            }
        }, 15000);
    });
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
function showSuccessMessage(nombre, apellido) {
    document.body.classList.add('hide-header');
    
    const container = document.querySelector('.container');
    container.innerHTML = '';
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-final-screen';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h2>Registro Exitoso</h2>
            <p><strong>${nombre} ${apellido}</strong></p>
            <p>Tu registro ha sido completado correctamente. Recorda que el ganador tiene que estar presente en el evento</p>
            <div class="success-actions">
                <button type="button" class="btn btn-primary" id="closeSuccessBtn">CERRAR</button>
            </div>
        </div>
    `;
    
    container.appendChild(successDiv);
    
    successDiv.querySelector('#closeSuccessBtn').addEventListener('click', () => {
        if (window.close) window.close();
        else successDiv.remove();
    });
}