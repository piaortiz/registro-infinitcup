/**
 * Sistema de Registro de Asistencia - Versión Simplificada
 * Solo funciones esenciales para debugging
 */

console.log('🔄 INICIANDO VERSIÓN SIMPLIFICADA 2.0.1');

// Configuración
const CONFIG = {
    apiUrl: 'https://script.google.com/macros/s/AKfycbxY09Lg1dskwOdKy9ZEVOrfwWVJlqRa9iXhCGbrYDGb98ymfjt2enKEFvlOhRh576kc/exec',
    version: '2.0.1'
};

// Variables globales
let colaboradores = [];
let selectedColaborador = null;
let elements = {};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Aplicación versión:', CONFIG.version);
    
    // Inicializar elementos
    elements = {
        searchInput: document.getElementById('searchInput'),
        searchResults: document.getElementById('searchResults'),
        selectedSection: document.getElementById('selectedSection'),
        selectedName: document.getElementById('selectedName'),
        selectedLegajo: document.getElementById('selectedLegajo'),
        registrationForm: document.getElementById('registrationForm'),
        guestCount: document.getElementById('guestCount'),
        guestsSection: document.getElementById('guestsSection'),
        submitBtn: document.getElementById('submitBtn'),
        message: document.getElementById('message'),
        loading: document.getElementById('loading')
    };
    
    // Cargar colaboradores
    try {
        await loadColaboradores();
        
        // Solo continuar si la carga fue exitosa
        // Event listeners
        setupEventListeners();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        // No continuar con la inicialización si hay error
        return;
    }
    
    // Inicializar tema
    initializeTheme();
});

// Cargar colaboradores
async function loadColaboradores() {
    try {
        console.log('📥 Cargando colaboradores...');
        showInitialLoading();
        
        const response = await fetchWithJSONP(CONFIG.apiUrl);
        
        if (response.colaboradores && Array.isArray(response.colaboradores)) {
            colaboradores = response.colaboradores;
        } else if (Array.isArray(response)) {
            colaboradores = response;
        } else {
            throw new Error('Formato de respuesta inválido');
        }
        
        console.log(`✅ Cargados ${colaboradores.length} colaboradores`);
        
        // Mostrar mensaje de éxito temporal
        setTimeout(() => {
            const message = elements.message;
            if (message) {
                message.innerHTML = `✅ ${colaboradores.length} colaboradores cargados correctamente`;
                message.className = 'message success';
                message.style.display = 'block';
                
                setTimeout(() => {
                    message.style.display = 'none';
                }, 3000);
            }
        }, 500);
        
        hideInitialLoading();
        
    } catch (error) {
        console.error('❌ Error cargando colaboradores:', error);
        showLoadingError();
        throw error; // Re-lanzar el error para que se maneje en la inicialización
    }
}

// JSONP fetch
function fetchWithJSONP(url, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Date.now();
        
        const cleanup = () => {
            if (window[callbackName]) delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        };
        
        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };
        
        const script = document.createElement('script');
        script.src = url + '?callback=' + callbackName;
        script.onerror = () => {
            cleanup();
            reject(new Error('Error en JSONP'));
        };
        
        setTimeout(() => {
            cleanup();
            reject(new Error('Timeout'));
        }, timeout);
        
        document.head.appendChild(script);
    });
}

// Event listeners
function setupEventListeners() {
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }
    
    if (elements.registrationForm) {
        elements.registrationForm.addEventListener('submit', handleSubmit);
    }
    
    if (elements.guestCount) {
        elements.guestCount.addEventListener('input', handleGuestCountChange);
    }
}

// Búsqueda simple
function handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
        elements.searchResults.innerHTML = '';
        elements.searchResults.style.display = 'none';
        return;
    }
    
    const results = colaboradores.filter(col => 
        col.nombreCompleto.toLowerCase().includes(query) ||
        col.legajo.includes(query)
    ).slice(0, 10);
    
    displayResults(results);
}

// Mostrar resultados
function displayResults(results) {
    elements.searchResults.innerHTML = '';
    
    if (results.length === 0) {
        elements.searchResults.innerHTML = '<div class="search-result-item">No se encontraron colaboradores</div>';
        elements.searchResults.style.display = 'block';
        return;
    }
    
    results.forEach(colaborador => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
            <div class="result-name">${colaborador.nombreCompleto}</div>
            <div class="result-legajo">Legajo: ${colaborador.legajo}</div>
        `;
        
        div.addEventListener('click', () => selectColaborador(colaborador));
        elements.searchResults.appendChild(div);
    });
    
    elements.searchResults.style.display = 'block';
}

// Seleccionar colaborador
function selectColaborador(colaborador) {
    console.log('✅ Colaborador seleccionado:', colaborador);
    selectedColaborador = colaborador;
    
    // Mostrar información
    elements.selectedName.textContent = colaborador.nombreCompleto;
    elements.selectedLegajo.textContent = `Legajo: ${colaborador.legajo}`;
    
    // Mostrar sección
    elements.selectedSection.style.display = 'block';
    elements.searchResults.style.display = 'none';
    elements.searchInput.value = '';
    
    // Limpiar formulario
    elements.guestCount.value = '0';
    elements.guestsSection.innerHTML = '';
}

// Manejar cambio de invitados
function handleGuestCountChange(event) {
    const count = parseInt(event.target.value) || 0;
    
    if (count < 0) {
        event.target.value = 0;
        return;
    }
    
    if (count > 10) {
        event.target.value = 10;
        return;
    }
    
    generateGuestFields(count);
}

// Generar campos de invitados
function generateGuestFields(count) {
    elements.guestsSection.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'guest-item';
        div.innerHTML = `
            <h4>👤 Invitado ${i}</h4>
            <input type="text" id="guestName${i}" placeholder="Nombre completo" required>
            <input type="text" id="guestVinculo${i}" placeholder="Relación (ej: esposo/a)" required>
        `;
        elements.guestsSection.appendChild(div);
    }
}

// Manejar envío
async function handleSubmit(event) {
    event.preventDefault();
    
    console.log('🚀 ENVIANDO REGISTRO - Versión:', CONFIG.version);
    console.log('🚀 Colaborador seleccionado:', selectedColaborador);
    
    if (!selectedColaborador) {
        showMessage('❌ Por favor selecciona un colaborador', 'error');
        return;
    }
    
    const guestCount = parseInt(elements.guestCount.value) || 0;
    const invitados = [];
    
    // Validar y recopilar invitados
    for (let i = 1; i <= guestCount; i++) {
        const nameInput = document.getElementById(`guestName${i}`);
        const vinculoInput = document.getElementById(`guestVinculo${i}`);
        
        if (!nameInput || !nameInput.value.trim()) {
            showMessage(`❌ Falta nombre del invitado ${i}`, 'error');
            return;
        }
        
        if (!vinculoInput || !vinculoInput.value.trim()) {
            showMessage(`❌ Falta relación del invitado ${i}`, 'error');
            return;
        }
        
        invitados.push({
            nombre: nameInput.value.trim(),
            vinculo: vinculoInput.value.trim()
        });
    }
    
    // Preparar datos
    const currentDate = new Date();
    const formData = {
        legajo: selectedColaborador.legajo,
        nombreCompleto: selectedColaborador.nombreCompleto,
        cantidadInvitados: guestCount,
        invitados: invitados,
        fecha: currentDate.toISOString().split('T')[0],
        hora: currentDate.toTimeString().split(' ')[0],
        lugar: 'Evento de Empresa',
        timestamp: currentDate.toISOString()
    };
    
    console.log('📤 Datos a enviar:', formData);
    
    // Iniciar secuencia de envío
    showSubmissionProcess();
    
    // Enviar datos
    try {
        const response = await sendRegistration(formData);
        console.log('✅ Respuesta:', response);
        
        if (response.status === 'SUCCESS' || response.status === 'success') {
            showSuccessConfirmation(selectedColaborador.nombreCompleto, guestCount);
        } else {
            showErrorConfirmation('Error al procesar el registro en el servidor');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        showErrorConfirmation('Error de conexión al enviar el registro');
    }
}

// Enviar registro - SOLO JSONP
async function sendRegistration(data) {
    console.log('📡 ENVIANDO CON JSONP - NO IFRAME');
    
    return new Promise((resolve, reject) => {
        const callbackName = 'register_callback_' + Date.now();
        
        const cleanup = () => {
            if (window[callbackName]) delete window[callbackName];
            const script = document.getElementById('register-script');
            if (script) script.remove();
        };
        
        window[callbackName] = (response) => {
            console.log('📨 Respuesta del servidor:', response);
            cleanup();
            resolve(response);
        };
        
        // Crear URL con parámetros
        const params = new URLSearchParams({
            callback: callbackName,
            action: 'register',
            legajo: data.legajo,
            nombreCompleto: data.nombreCompleto,
            cantidadInvitados: data.cantidadInvitados,
            invitados: JSON.stringify(data.invitados),
            fecha: data.fecha,
            hora: data.hora,
            lugar: data.lugar,
            timestamp: data.timestamp
        });
        
        const url = `${CONFIG.apiUrl}?${params.toString()}`;
        console.log('🔗 URL de envío:', url);
        
        const script = document.createElement('script');
        script.id = 'register-script';
        script.src = url;
        script.onerror = () => {
            console.error('❌ Error en script');
            cleanup();
            resolve({
                status: 'ERROR',
                message: 'Error de conexión',
                error: 'SCRIPT_ERROR'
            });
        };
        
        document.head.appendChild(script);
        
        // Timeout
        setTimeout(() => {
            if (window[callbackName]) {
                console.log('⏱️ Timeout en envío');
                cleanup();
                resolve({
                    status: 'SUCCESS',
                    message: 'Registro enviado (timeout)',
                    warning: true
                });
            }
        }, 15000);
    });
}

// Utilidades
function showMessage(text, type = 'info') {
    if (elements.message) {
        elements.message.textContent = text;
        elements.message.className = `message ${type}`;
        elements.message.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                elements.message.style.display = 'none';
            }, 5000);
        }
    }
}

function showLoading(show) {
    if (elements.loading) {
        elements.loading.style.display = show ? 'block' : 'none';
    }
}

function resetForm() {
    selectedColaborador = null;
    elements.selectedSection.style.display = 'none';
    elements.searchInput.value = '';
    elements.guestCount.value = '0';
    elements.guestsSection.innerHTML = '';
}

// Theme management
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(theme);
    
    // Add theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
        console.log('🌙 Modo oscuro activado');
    } else {
        body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
        console.log('☀️ Modo claro activado');
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(isDark ? 'light' : 'dark');
    
    // Add a small animation feedback
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
}

// Loading state management
function showInitialLoading() {
    // Crear popup de carga inicial
    let loadingContainer = document.getElementById('initialLoading');
    
    if (!loadingContainer) {
        loadingContainer = document.createElement('div');
        loadingContainer.id = 'initialLoading';
        loadingContainer.className = 'submission-loading';
        loadingContainer.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>📡 Cargando Base de Datos</h2>
                <p>Obteniendo lista de colaboradores...</p>
            </div>
        `;
        
        document.body.appendChild(loadingContainer);
    }
    
    loadingContainer.style.display = 'flex';
    
    // Deshabilitar campo de búsqueda como fallback
    const searchInput = elements.searchInput;
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.placeholder = '⏳ Cargando colaboradores...';
        searchInput.style.cursor = 'not-allowed';
        searchInput.style.opacity = '0.6';
    }
    
    console.log('⏳ Estado de carga inicial activado');
}

function hideInitialLoading() {
    // Ocultar popup de carga
    const loadingContainer = document.getElementById('initialLoading');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    // Habilitar campo de búsqueda
    const searchInput = elements.searchInput;
    if (searchInput) {
        searchInput.disabled = false;
        searchInput.placeholder = 'Ingresa nombre o legajo del colaborador';
        searchInput.style.cursor = 'text';
        searchInput.style.opacity = '1';
        searchInput.focus(); // Hacer foco para mejor UX
    }
    
    console.log('✅ Estado de carga inicial completado');
}

function showLoadingError() {
    // Ocultar popup de carga
    const loadingContainer = document.getElementById('initialLoading');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    // Crear popup de error de carga
    let errorContainer = document.getElementById('loadingError');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'loadingError';
        errorContainer.className = 'error-confirmation';
        
        document.body.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `
        <div class="error-content">
            <div class="error-icon">❌</div>
            <h2>Error de Conexión</h2>
            <div class="error-details">
                <p>No se pudo cargar la base de datos de colaboradores</p>
                <p class="error-time">Intento fallido el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}</p>
            </div>
            <div class="error-actions">
                <button id="reloadBtn" class="btn btn-primary">
                    🔄 Recargar Página
                </button>
                <button id="closePageBtn" class="btn btn-secondary">
                    🚪 Cerrar Aplicación
                </button>
            </div>
        </div>
    `;
    
    errorContainer.style.display = 'flex';
    
    // Agregar event listeners
    document.getElementById('reloadBtn').addEventListener('click', () => {
        window.location.reload();
    });
    document.getElementById('closePageBtn').addEventListener('click', closePage);
    
    console.log('❌ Error en carga inicial');
}

// Estados de confirmación
function showSubmissionProcess() {
    // Limpiar pantalla
    clearScreen();
    
    // Mostrar estado de carga
    showSubmissionLoading();
    
    console.log('🔄 Iniciando proceso de envío...');
}

function clearScreen() {
    // Ocultar todas las secciones principales
    const searchSection = document.querySelector('.search-section');
    const selectedSection = elements.selectedSection;
    const message = elements.message;
    
    if (searchSection) {
        searchSection.style.display = 'none';
    }
    
    if (selectedSection) {
        selectedSection.style.display = 'none';
    }
    
    if (message) {
        message.style.display = 'none';
    }
    
    console.log('🧹 Pantalla limpiada');
}

function showSubmissionLoading() {
    // Crear o mostrar el contenedor de carga de envío
    let loadingContainer = document.getElementById('submissionLoading');
    
    if (!loadingContainer) {
        loadingContainer = document.createElement('div');
        loadingContainer.id = 'submissionLoading';
        loadingContainer.className = 'submission-loading';
        loadingContainer.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>📤 Enviando Registro</h2>
                <p>Por favor espera mientras procesamos tu confirmación...</p>
            </div>
        `;
        
        document.querySelector('.content').appendChild(loadingContainer);
    }
    
    loadingContainer.style.display = 'flex';
    console.log('⏳ Mostrando carga de envío');
}

function hideSubmissionLoading() {
    const loadingContainer = document.getElementById('submissionLoading');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    console.log('✅ Ocultando carga de envío');
}

function showSuccessConfirmation(collaboratorName, guestCount) {
    // Ocultar carga
    hideSubmissionLoading();
    
    // Crear o mostrar confirmación de éxito
    let successContainer = document.getElementById('successConfirmation');
    
    if (!successContainer) {
        successContainer = document.createElement('div');
        successContainer.id = 'successConfirmation';
        successContainer.className = 'success-confirmation';
        
        document.querySelector('.content').appendChild(successContainer);
    }
    
    const invitadosText = guestCount === 0 ? 'sin invitados' : 
                         guestCount === 1 ? 'con 1 invitado' : 
                         `con ${guestCount} invitados`;
    
    successContainer.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h2>¡Registro Exitoso!</h2>
            <div class="success-details">
                <p><strong>${collaboratorName}</strong></p>
                <p>Confirmación registrada ${invitadosText}</p>
                <p class="success-time">Registrado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}</p>
            </div>
            <div class="success-actions">
                <button id="closePageBtn" class="btn btn-primary">
                    🚪 Cerrar Aplicación
                </button>
            </div>
        </div>
    `;
    
    successContainer.style.display = 'flex';
    
    // Agregar event listeners
    document.getElementById('closePageBtn').addEventListener('click', closePage);
    
    console.log('🎉 Mostrando confirmación de éxito');
}

function showErrorConfirmation(errorMessage) {
    // Ocultar carga
    hideSubmissionLoading();
    
    // Crear o mostrar confirmación de error
    let errorContainer = document.getElementById('errorConfirmation');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'errorConfirmation';
        errorContainer.className = 'error-confirmation';
        
        document.querySelector('.content').appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `
        <div class="error-content">
            <div class="error-icon">❌</div>
            <h2>Error en el Registro</h2>
            <div class="error-details">
                <p>${errorMessage}</p>
                <p class="error-time">Intento fallido el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}</p>
            </div>
            <div class="error-actions">
                <button id="retryBtn" class="btn btn-primary">
                    🔄 Intentar Nuevamente
                </button>
                <button id="closePageBtn" class="btn btn-secondary">
                    🚪 Cerrar Aplicación
                </button>
            </div>
        </div>
    `;
    
    errorContainer.style.display = 'flex';
    
    // Agregar event listeners
    document.getElementById('retryBtn').addEventListener('click', restoreForm);
    document.getElementById('closePageBtn').addEventListener('click', closePage);
    
    console.log('❌ Mostrando confirmación de error');
}

function closePage() {
    // Intentar cerrar la ventana/tab
    if (window.close) {
        window.close();
    }
    
    // Fallback: redirigir o mostrar mensaje
    setTimeout(() => {
        window.location.href = 'about:blank';
    }, 500);
    
    console.log('🚪 Cerrando aplicación');
}

function restoreForm() {
    // Ocultar confirmación de error
    const errorContainer = document.getElementById('errorConfirmation');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
    
    // Restaurar formulario
    restoreInitialScreen();
    
    console.log('🔄 Restaurando formulario');
}

function restoreInitialScreen() {
    // Mostrar secciones principales
    const searchSection = document.querySelector('.search-section');
    const selectedSection = elements.selectedSection;
    
    if (searchSection) {
        searchSection.style.display = 'block';
    }
    
    if (selectedSection && selectedColaborador) {
        selectedSection.style.display = 'block';
    }
    
    // Resetear formulario
    resetForm();
    
    console.log('🔄 Pantalla inicial restaurada');
}

console.log('📁 Archivo cargado - Versión:', CONFIG.version);
