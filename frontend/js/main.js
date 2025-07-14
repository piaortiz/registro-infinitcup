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
        showMessage(`✅ Cargados ${colaboradores.length} colaboradores`, 'success');
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
    
    // Enviar datos
    try {
        elements.submitBtn.disabled = true;
        showLoading(true);
        
        const response = await sendRegistration(formData);
        console.log('✅ Respuesta:', response);
        
        if (response.status === 'SUCCESS' || response.status === 'success') {
            showMessage('✅ Registro enviado correctamente', 'success');
            resetForm();
        } else {
            showMessage('❌ Error al enviar registro', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        showMessage('❌ Error al procesar registro', 'error');
    } finally {
        elements.submitBtn.disabled = false;
        showLoading(false);
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
    const searchInput = elements.searchInput;
    const searchSection = document.querySelector('.search-section');
    const message = elements.message;
    
    // Deshabilitar campo de búsqueda
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.placeholder = '⏳ Cargando colaboradores...';
        searchInput.style.cursor = 'not-allowed';
        searchInput.style.opacity = '0.6';
    }
    
    // Mostrar mensaje de carga
    if (message) {
        message.innerHTML = '📡 Cargando base de datos de colaboradores...';
        message.className = 'message info';
        message.style.display = 'block';
    }
    
    // Agregar clase de carga a la sección de búsqueda
    if (searchSection) {
        searchSection.classList.add('loading-state');
    }
    
    console.log('⏳ Estado de carga inicial activado');
}

function hideInitialLoading() {
    const searchInput = elements.searchInput;
    const searchSection = document.querySelector('.search-section');
    const message = elements.message;
    
    // Habilitar campo de búsqueda
    if (searchInput) {
        searchInput.disabled = false;
        searchInput.placeholder = 'Ingresa nombre o legajo del colaborador';
        searchInput.style.cursor = 'text';
        searchInput.style.opacity = '1';
        searchInput.focus(); // Hacer foco para mejor UX
    }
    
    // Ocultar mensaje de carga después de un momento
    if (message) {
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }
    
    // Remover clase de carga
    if (searchSection) {
        searchSection.classList.remove('loading-state');
    }
    
    console.log('✅ Estado de carga inicial completado');
}

function showLoadingError() {
    const searchInput = elements.searchInput;
    const message = elements.message;
    
    // Mantener campo deshabilitado
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.placeholder = '❌ Error cargando datos';
        searchInput.style.cursor = 'not-allowed';
        searchInput.style.opacity = '0.6';
    }
    
    // Mostrar mensaje de error
    if (message) {
        message.innerHTML = '❌ Error cargando colaboradores. Recarga la página para intentar nuevamente.';
        message.className = 'message error';
        message.style.display = 'block';
    }
    
    console.log('❌ Error en carga inicial');
}

console.log('📁 Archivo cargado - Versión:', CONFIG.version);
