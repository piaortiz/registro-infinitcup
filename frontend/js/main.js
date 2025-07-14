/**
 * Sistema de Registro de Asistencia para Eventos de Empresa
 * Utiliza Fuse.js para búsqueda difusa de colaboradores
 */

// Configuración de la aplicación
const CONFIG = {
    // URL del Web App de Google Apps Script
    apiUrl: 'https://script.google.com/macros/s/AKfycbxY09Lg1dskwOdKy9ZEVOrfwWVJlqRa9iXhCGbrYDGb98ymfjt2enKEFvlOhRh576kc/exec',
    maxGuests: 10,
    searchDelay: 300, // Retraso en ms para evitar demasiadas búsquedas
    
    // Configuración específica para Google Apps Script
    requestTimeout: 30000, // 30 segundos de timeout para Google Apps Script
    retryAttempts: 3, // Número de intentos en caso de error
    retryDelay: 1000 // Retraso entre intentos en ms
};

// Variables globales
let colaboradores = [];
let fuse = null;
let selectedColaborador = null;
let searchTimeout = null;
let elements = {}; // Objeto para almacenar referencias a elementos del DOM

/**
 * Inicializa la aplicación cuando el DOM está cargado
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Obtener referencias a elementos del DOM
    initializeElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos de colaboradores
    await loadColaboradores();
    
    // Inicializar Fuse.js para búsqueda
    initializeFuse();
    
    console.log('Aplicación inicializada correctamente');
});

/**
 * Inicializa las referencias a elementos del DOM
 */
function initializeElements() {
    const requiredElements = {
        searchInput: 'searchInput',
        searchResults: 'searchResults',
        selectedSection: 'selectedSection',
        selectedName: 'selectedName',
        selectedLegajo: 'selectedLegajo',
        registrationForm: 'registrationForm',
        guestCount: 'guestCount',
        guestsSection: 'guestsSection',
        submitBtn: 'submitBtn',
        cancelBtn: 'cancelBtn',
        message: 'message',
        loading: 'loading'
    };
    
    // Inicializar elementos requeridos
    for (const [key, id] of Object.entries(requiredElements)) {
        elements[key] = document.getElementById(id);
        if (!elements[key]) {
            console.error(`Elemento requerido no encontrado: ${id}`);
        }
    }
    
    // Elementos opcionales
    elements.searchContainer = document.querySelector('.search-input-container');
    
    console.log('Elementos inicializados:', elements);
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // Validar que los elementos existan antes de agregar listeners
    if (!elements.searchInput || !elements.searchResults || !elements.guestCount || 
        !elements.registrationForm || !elements.cancelBtn) {
        console.error('No se pueden configurar event listeners: elementos faltantes');
        return;
    }
    
    // Búsqueda de colaboradores
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchInput.addEventListener('blur', (e) => {
        // Retrasar el ocultar para permitir clics en los resultados
        setTimeout(() => {
            hideSearchResults();
        }, 150);
    });
    elements.searchInput.addEventListener('focus', showSearchHint);
    
    // Cantidad de invitados
    elements.guestCount.addEventListener('input', handleGuestCountChange);
    
    // Formulario de registro
    elements.registrationForm.addEventListener('submit', handleSubmit);
    
    // Botón cancelar
    elements.cancelBtn.addEventListener('click', handleCancel);
    
    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (elements.searchInput && elements.searchResults && 
            !elements.searchInput.contains(event.target) && 
            !elements.searchResults.contains(event.target)) {
            hideSearchResults();
            hideSearchHint();
        }
    });
}

/**
 * Muestra el hint de búsqueda
 */
function showSearchHint() {
    if (elements.searchContainer) {
        elements.searchContainer.classList.add('active');
    }
}

/**
 * Oculta el hint de búsqueda
 */
function hideSearchHint() {
    if (elements.searchContainer) {
        elements.searchContainer.classList.remove('active');
    }
}

/**
 * Carga los datos de colaboradores desde Google Apps Script
 */
async function loadColaboradores() {
    try {
        showLoading(true);
        
        // Cargar colaboradores desde Google Apps Script
        console.log('Cargando colaboradores desde Google Apps Script...');
        
        // Usar JSONP para evitar problemas de CORS
        const response = await fetchWithJSONP(CONFIG.apiUrl);
        
        console.log('Respuesta completa de Google Apps Script:', response);
        
        // Verificar si la respuesta contiene colaboradores
        if (response.colaboradores && Array.isArray(response.colaboradores)) {
            colaboradores = response.colaboradores;
            console.log(`✅ Cargados ${colaboradores.length} colaboradores desde Google Apps Script`);
            console.log('Primeros 3 colaboradores:', colaboradores.slice(0, 3));
        } else if (Array.isArray(response)) {
            // Si la respuesta es directamente un array
            colaboradores = response;
            console.log(`✅ Cargados ${colaboradores.length} colaboradores desde Google Apps Script (array directo)`);
            console.log('Primeros 3 colaboradores:', colaboradores.slice(0, 3));
        } else {
            throw new Error('Formato de respuesta inválido desde Google Apps Script: ' + JSON.stringify(response));
        }
        
        if (colaboradores.length === 0) {
            throw new Error('No se encontraron colaboradores en Google Apps Script');
        }
        
        showMessage(`✅ Cargados ${colaboradores.length} colaboradores desde Google Sheets`, 'success');
        
    } catch (error) {
        console.error('❌ Error al cargar colaboradores desde Google Apps Script:', error);
        colaboradores = []; // Array vacío para ver claramente el error
        showMessage(`❌ Error al cargar colaboradores: ${error.message}`, 'error');
        throw error; // Re-lanzar el error para que se vea claramente
        
    } finally {
        showLoading(false);
    }
}

/**
 * Inicializa Fuse.js para búsqueda difusa
 */
function initializeFuse() {
    if (!colaboradores.length) {
        console.error('No hay colaboradores cargados para inicializar Fuse');
        return;
    }
    
    // Crear versión normalizada de los colaboradores para búsqueda
    const colaboradoresNormalizados = createSearchableColaboradores(colaboradores);
    
    // Configuración de Fuse.js con campos normalizados
    const fuseOptions = {
        keys: [
            { name: 'nombreCompleto', weight: 0.7 },
            { name: 'nombreNormalizado', weight: 0.8 }, // Mayor peso para búsqueda sin acentos
            { name: 'legajo', weight: 0.6 },
            { name: 'legajoNormalizado', weight: 0.6 }
        ],
        threshold: 0.4, // Sensibilidad de la búsqueda (0 = exacta, 1 = muy permisiva)
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        getFn: (obj, path) => {
            // Función personalizada para obtener valores
            if (path === 'nombreNormalizado') {
                return obj.nombreNormalizado;
            }
            if (path === 'legajoNormalizado') {
                return obj.legajoNormalizado;
            }
            return obj[path];
        }
    };
    
    fuse = new Fuse(colaboradoresNormalizados, fuseOptions);
    console.log('Fuse.js inicializado correctamente con soporte para acentos');
}

/**
 * Maneja la búsqueda de colaboradores
 */
function handleSearch(event) {
    const query = event.target.value.trim();
    
    // Cancelar búsqueda anterior
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    if (query.length < 2) {
        hideSearchResults();
        return;
    }
    
    // Retrasar la búsqueda para evitar demasiadas consultas
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, CONFIG.searchDelay);
}

/**
 * Ejecuta la búsqueda usando Fuse.js
 */
function performSearch(query) {
    if (!fuse) {
        console.error('Fuse no está inicializado');
        return;
    }
    
    // Normalizar la consulta del usuario
    const normalizedQuery = normalizeText(query);
    
    // Buscar tanto con la consulta original como con la normalizada
    const originalResults = fuse.search(query);
    const normalizedResults = fuse.search(normalizedQuery);
    
    // Combinar resultados y eliminar duplicados
    const combinedResults = [...originalResults, ...normalizedResults];
    const uniqueResults = [];
    const seenLegajos = new Set();
    
    combinedResults.forEach(result => {
        if (!seenLegajos.has(result.item.legajo)) {
            seenLegajos.add(result.item.legajo);
            uniqueResults.push(result);
        }
    });
    
    // Ordenar por puntuación (menor puntuación = mejor coincidencia)
    uniqueResults.sort((a, b) => a.score - b.score);
    
    displaySearchResults(uniqueResults);
}

/**
 * Muestra los resultados de la búsqueda
 */
function displaySearchResults(results) {
    elements.searchResults.innerHTML = '';
    
    if (results.length === 0) {
        elements.searchResults.innerHTML = '<div class="search-result-item">No se encontraron colaboradores</div>';
        elements.searchResults.style.display = 'block';
        return;
    }
    
    // Mostrar máximo 10 resultados
    const maxResults = Math.min(results.length, 10);
    
    for (let i = 0; i < maxResults; i++) {
        const item = results[i].item;
        const resultElement = createSearchResultElement(item);
        elements.searchResults.appendChild(resultElement);
    }
    
    elements.searchResults.style.display = 'block';
}

/**
 * Crea un elemento HTML para un resultado de búsqueda
 */
function createSearchResultElement(colaborador) {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    
    // Resaltar coincidencias en el nombre
    const searchTerm = elements.searchInput.value.toLowerCase();
    const normalizedSearch = normalizeText(searchTerm);
    
    let highlightedName = colaborador.nombreCompleto;
    
    // Intentar resaltar coincidencias
    if (searchTerm.length >= 2) {
        // Crear regex para buscar coincidencias
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        highlightedName = highlightedName.replace(regex, '<mark>$1</mark>');
        
        // Si no hay coincidencias directas, intentar con texto normalizado
        if (!highlightedName.includes('<mark>')) {
            const normalizedName = normalizeText(colaborador.nombreCompleto);
            if (normalizedName.includes(normalizedSearch)) {
                // Encontrar la posición en el texto normalizado y mapear al original
                const startPos = normalizedName.indexOf(normalizedSearch);
                if (startPos !== -1) {
                    const originalText = colaborador.nombreCompleto;
                    const beforeMatch = originalText.substring(0, startPos);
                    const match = originalText.substring(startPos, startPos + normalizedSearch.length);
                    const afterMatch = originalText.substring(startPos + normalizedSearch.length);
                    highlightedName = beforeMatch + '<mark>' + match + '</mark>' + afterMatch;
                }
            }
        }
    }
    
    div.innerHTML = `
        <div class="result-name">${highlightedName}</div>
        <div class="result-legajo">Legajo: ${colaborador.legajo}</div>
    `;
    
    // Agregar evento de clic
    div.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectColaborador(colaborador);
    });
    
    // Prevenir que se cierre al hacer hover
    div.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
    
    return div;
}

/**
 * Escapa caracteres especiales para regex
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Selecciona un colaborador
 */
function selectColaborador(colaborador) {
    console.log('selectColaborador llamado con:', colaborador);
    
    selectedColaborador = colaborador;
    
    // Validar que los elementos existan
    if (!elements.selectedName || !elements.selectedLegajo || !elements.selectedSection) {
        console.error('Elementos de selección no encontrados:', {
            selectedName: !!elements.selectedName,
            selectedLegajo: !!elements.selectedLegajo,
            selectedSection: !!elements.selectedSection
        });
        return;
    }
    
    // Función para mostrar la sección con reintentos
    function showSelectedSection() {
        console.log('Intentando mostrar selectedSection...');
        
        // Ocultar sección de búsqueda primero
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.style.display = 'none';
        }
        
        // Limpiar y ocultar resultados de búsqueda
        elements.searchInput.value = '';
        hideSearchResults();
        
        // Mostrar información del colaborador
        elements.selectedName.textContent = colaborador.nombreCompleto;
        elements.selectedLegajo.textContent = `Legajo: ${colaborador.legajo}`;
        
        // Aplicar múltiples métodos para forzar visualización
        const section = elements.selectedSection;
        
        // Método 1: Estilos inline
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
        section.style.position = 'relative';
        section.style.zIndex = '10';
        section.style.minHeight = '300px';
        
        // Método 2: Clases CSS
        section.classList.add('active');
        section.classList.remove('hidden');
        
        // Método 3: Atributos HTML
        section.setAttribute('data-visible', 'true');
        section.removeAttribute('hidden');
        
        // Forzar reflow múltiples veces
        section.offsetHeight;
        section.offsetWidth;
        
        // Verificar que sea visible
        const rect = section.getBoundingClientRect();
        console.log('Dimensiones después de mostrar:', rect);
        
        if (rect.height > 0 && rect.width > 0) {
            console.log('✅ Sección visible correctamente');
            
            // Hacer scroll suave
            setTimeout(() => {
                section.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
            
            return true;
        } else {
            console.warn('❌ Sección aún no visible, reintentando...');
            return false;
        }
    }
    
    // Intentar mostrar con reintentos
    let attempts = 0;
    const maxAttempts = 5;
    
    function attemptShow() {
        attempts++;
        console.log(`Intento ${attempts} de ${maxAttempts}`);
        
        if (showSelectedSection()) {
            console.log('✅ Sección mostrada exitosamente');
            return;
        }
        
        if (attempts < maxAttempts) {
            setTimeout(attemptShow, 200 * attempts); // Delay progresivo
        } else {
            console.error('❌ No se pudo mostrar la sección después de múltiples intentos');
            // Fallback: mostrar con método alternativo
            elements.selectedSection.innerHTML = `
                <div style="display: block !important; visibility: visible !important; opacity: 1 !important; padding: 20px; background: #f0f0f0; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #28a745; margin: 0 0 15px 0;">✅ Empleado Seleccionado</h2>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 1.4em; font-weight: 700; color: #2c3e50; margin-bottom: 5px;">${colaborador.nombreCompleto}</div>
                        <div style="color: #7f8c8d; font-size: 1em;">Legajo: ${colaborador.legajo}</div>
                    </div>
                    <form id="registrationForm">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">👥 Cantidad de invitados que trae:</label>
                            <input type="number" id="guestCount" min="0" max="10" value="0" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
                            <small style="color: #666; font-size: 0.8em;">Máximo 10 invitados</small>
                        </div>
                        <div id="guestsSection"></div>
                        <div style="display: flex; gap: 10px; flex-direction: column; margin-top: 20px;">
                            <button type="submit" style="background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 1em; cursor: pointer;">✅ Confirmar Asistencia</button>
                            <button type="button" onclick="handleCancel()" style="background: #6c757d; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 1em; cursor: pointer;">← Volver a Buscar</button>
                        </div>
                    </form>
                </div>
            `;
            
            // Reconfigurar elementos después del fallback
            elements.registrationForm = document.getElementById('registrationForm');
            elements.guestCount = document.getElementById('guestCount');
            elements.guestsSection = document.getElementById('guestsSection');
            elements.submitBtn = document.querySelector('button[type="submit"]');
            elements.cancelBtn = document.querySelector('button[type="button"]');
            
            // Reconfigurar event listeners específicos
            if (elements.registrationForm) {
                elements.registrationForm.addEventListener('submit', handleSubmit);
            }
            
            if (elements.guestCount) {
                elements.guestCount.addEventListener('input', handleGuestCountChange);
            }
            
            if (elements.cancelBtn) {
                elements.cancelBtn.addEventListener('click', handleCancel);
            }
            
            // Asegurar que selectedColaborador se mantenga
            console.log('Fallback ejecutado, selectedColaborador:', selectedColaborador);
        }
    }
    
    // Limpiar formulario
    resetForm();
    
    // Ocultar mensajes anteriores
    hideMessage();
    
    // Iniciar proceso de mostrar
    attemptShow();
    
    console.log('Colaborador seleccionado correctamente:', colaborador);
}

/**
 * Oculta los resultados de búsqueda
 */
function hideSearchResults() {
    if (elements.searchResults) {
        elements.searchResults.style.display = 'none';
    }
}

/**
 * Maneja el cambio en la cantidad de invitados
 */
function handleGuestCountChange(event) {
    const count = parseInt(event.target.value) || 0;
    
    if (count < 0) {
        event.target.value = 0;
        return;
    }
    
    if (count > CONFIG.maxGuests) {
        event.target.value = CONFIG.maxGuests;
        showMessage(`Máximo ${CONFIG.maxGuests} invitados permitidos`, 'warning');
        return;
    }
    
    generateGuestFields(count);
}

/**
 * Genera los campos dinámicos para los invitados
 */
function generateGuestFields(count) {
    elements.guestsSection.innerHTML = '';
    
    if (count === 0) {
        return;
    }
    
    for (let i = 1; i <= count; i++) {
        const guestDiv = document.createElement('div');
        guestDiv.className = 'guest-item';
        
        guestDiv.innerHTML = `
            <h4 style="margin-bottom: 10px; color: #333; font-size: 0.9em; font-weight: 600;">
                👤 Invitado ${i}
            </h4>
            <input 
                type="text" 
                id="guestName${i}" 
                placeholder="Nombre completo del invitado"
                required
                autocomplete="name"
                inputmode="text"
                style="margin-bottom: 8px;"
            >
            <input 
                type="text" 
                id="guestVinculo${i}" 
                placeholder="Relación (ej: esposo/a, hijo/a, amigo/a)"
                required
                autocomplete="off"
                inputmode="text"
                list="vinculoSuggestions"
            >
            <datalist id="vinculoSuggestions">
                <option value="esposo/a">
                <option value="hijo/a">
                <option value="padre/madre">
                <option value="hermano/a">
                <option value="amigo/a">
                <option value="pareja">
                <option value="familiar">
            </datalist>
        `;
        
        elements.guestsSection.appendChild(guestDiv);
    }
}

/**
 * Maneja el envío del formulario
 */
async function handleSubmit(event) {
    event.preventDefault();
    
    console.log('handleSubmit ejecutado, selectedColaborador:', selectedColaborador);
    
    if (!selectedColaborador) {
        console.error('selectedColaborador es null o undefined');
        showMessage('Por favor seleccione un colaborador', 'error');
        return;
    }
    
    // Validar campos de invitados si hay invitados
    const guestCount = parseInt(elements.guestCount.value) || 0;
    if (guestCount > 0) {
        for (let i = 1; i <= guestCount; i++) {
            const nameInput = document.getElementById(`guestName${i}`);
            const vinculoInput = document.getElementById(`guestVinculo${i}`);
            
            if (!nameInput || !nameInput.value.trim()) {
                showMessage(`Por favor ingrese el nombre del invitado ${i}`, 'error');
                return;
            }
            
            if (!vinculoInput || !vinculoInput.value.trim()) {
                showMessage(`Por favor ingrese el vínculo del invitado ${i}`, 'error');
                return;
            }
        }
    }
    
    // Deshabilitar botón durante el envío
    elements.submitBtn.disabled = true;
    showLoading(true);
    
    try {
        // Preparar datos para el envío
        const formData = prepareFormData();
        
        // Enviar datos a la API
        const response = await sendRegistration(formData);
        
        // Manejar respuesta con verificación
        if (response.confirmed === true) {
            showMessage('✅ Registro guardado exitosamente en Google Sheets', 'success');
            // Limpiar formulario y ocultar sección
            resetForm();
            handleCancel();
        } else if (response.confirmed === false) {
            showMessage('❌ El registro no se guardó correctamente. Por favor, intente nuevamente.', 'error');
            return; // No limpiar el formulario si falló
        } else if (response.warning) {
            showMessage('⚠️ Registro enviado pero no se pudo verificar. Revise Google Sheets manualmente.', 'warning');
            // Limpiar formulario y ocultar sección
            resetForm();
            handleCancel();
        } else {
            showMessage('✅ Registro enviado correctamente', 'success');
            // Limpiar formulario y ocultar sección
            resetForm();
            handleCancel();
        }
        
    } catch (error) {
        console.error('Error al enviar registro:', error);
        showMessage('❌ Error al procesar el registro. Por favor, intente nuevamente.', 'error');
    } finally {
        elements.submitBtn.disabled = false;
        showLoading(false);
    }
}

/**
 * Prepara los datos del formulario para envío
 */
function prepareFormData() {
    const guestCount = parseInt(elements.guestCount.value) || 0;
    const invitados = [];
    
    // Recopilar información de invitados
    for (let i = 1; i <= guestCount; i++) {
        const nameInput = document.getElementById(`guestName${i}`);
        const vinculoInput = document.getElementById(`guestVinculo${i}`);
        
        if (nameInput && vinculoInput) {
            const nombre = nameInput.value.trim();
            const vinculo = vinculoInput.value.trim();
            
            if (nombre && vinculo) {
                invitados.push({ nombre, vinculo });
            }
        }
    }
    
    // Obtener datos del evento desde el formulario
    const eventoInput = document.getElementById('evento');
    const categoriaInput = document.getElementById('categoria');
    const lugarInput = document.getElementById('lugar');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const observacionesInput = document.getElementById('observaciones');
    
    return {
        legajo: selectedColaborador.legajo,
        nombreCompleto: selectedColaborador.nombreCompleto,
        invitados: invitados,
        evento: eventoInput ? eventoInput.value.trim() : '',
        categoria: categoriaInput ? categoriaInput.value.trim() : '',
        lugar: lugarInput ? lugarInput.value.trim() : '',
        fecha: fechaInput ? fechaInput.value.trim() : '',
        hora: horaInput ? horaInput.value.trim() : '',
        observaciones: observacionesInput ? observacionesInput.value.trim() : ''
    };
}

/**
 * Envía el registro a Google Apps Script usando un iframe oculto
 */
async function sendRegistration(data) {
    return new Promise((resolve, reject) => {
        try {
            console.log('Enviando registro usando iframe oculto para evitar CORS');
            
            // Crear iframe oculto
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'registration-frame';
            document.body.appendChild(iframe);
            
            // Crear formulario temporal
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = CONFIG.apiUrl;
            form.target = 'registration-frame';
            form.style.display = 'none';
            
            // Crear campo oculto con los datos JSON
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'data';
            input.value = JSON.stringify(data);
            form.appendChild(input);
            
            // Función para verificar el registro después del envío
            const verifyRegistration = async () => {
                console.log('Verificando si el registro se guardó correctamente...');
                
                try {
                    const verificationResult = await verifyRegistrationSaved(
                        data.legajo, 
                        data.fecha, 
                        data.hora, 
                        data.lugar
                    );
                    
                    // Limpiar elementos
                    if (form.parentNode) document.body.removeChild(form);
                    if (iframe.parentNode) document.body.removeChild(iframe);
                    
                    if (verificationResult.confirmed === true) {
                        console.log('✅ Registro confirmado en Google Sheets');
                        resolve({
                            status: 'SUCCESS',
                            message: 'Registro guardado exitosamente',
                            confirmed: true
                        });
                    } else if (verificationResult.confirmed === false) {
                        console.log('❌ El registro no se encontró en Google Sheets');
                        resolve({
                            status: 'ERROR',
                            message: 'El registro no se guardó correctamente',
                            confirmed: false
                        });
                    } else if (verificationResult.warning) {
                        console.log('⚠️ Timeout o error en verificación');
                        resolve({
                            status: 'SUCCESS',
                            message: 'Registro enviado (verificación falló)',
                            warning: true
                        });
                    } else {
                        resolve({
                            status: 'SUCCESS',
                            message: 'Registro enviado correctamente',
                            confirmed: true
                        });
                    }
                } catch (error) {
                    console.error('Error verificando registro:', error);
                    
                    // Limpiar elementos
                    if (form.parentNode) document.body.removeChild(form);
                    if (iframe.parentNode) document.body.removeChild(iframe);
                    
                    resolve({
                        status: 'SUCCESS',
                        message: 'Registro enviado (verificación falló)',
                        warning: true
                    });
                }
            };
            
            // Manejar la carga del iframe
            iframe.onload = () => {
                console.log('Iframe cargado, esperando 2 segundos antes de verificar...');
                
                // Esperar 2 segundos para que Google Apps Script procese el registro
                setTimeout(verifyRegistration, 2000);
            };
            
            // Manejar errores
            iframe.onerror = () => {
                console.error('Error en iframe');
                
                // Limpiar elementos
                if (form.parentNode) document.body.removeChild(form);
                if (iframe.parentNode) document.body.removeChild(iframe);
                
                reject(new Error('Error al enviar el registro'));
            };
            
            // Timeout de seguridad más largo
            setTimeout(() => {
                if (iframe.parentNode) {
                    console.log('Timeout alcanzado, verificando de todas formas...');
                    verifyRegistration();
                }
            }, 15000); // 15 segundos
            
            // Agregar formulario al DOM y enviarlo
            document.body.appendChild(form);
            form.submit();
            
        } catch (error) {
            console.error('Error enviando registro:', error);
            reject(error);
        }
    });
}

/**
 * Función para verificar si un colaborador ya está registrado (usando JSONP)
 */
function checkRegistration(legajo, callback) {
    const callbackName = 'verify_callback_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    
    // Crear script tag para JSONP
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = CONFIG.apiUrl + '?action=check&legajo=' + encodeURIComponent(legajo) + '&callback=' + callbackName;
    
    // Timeout de 10 segundos
    const timeoutId = setTimeout(() => {
        cleanup();
        callback({ error: 'Timeout al verificar registro' });
    }, 10000);
    
    // Función de limpieza
    const cleanup = () => {
        clearTimeout(timeoutId);
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        delete window[callbackName];
    };
    
    // Definir callback global
    window[callbackName] = (data) => {
        cleanup();
        callback(data);
    };
    
    // Manejar errores de carga del script
    script.onerror = () => {
        cleanup();
        callback({ error: 'Error al verificar registro' });
    };
    
    // Agregar script al DOM
    document.head.appendChild(script);
}

/**
 * Maneja la respuesta de Google Apps Script
 */
function handleApiResponse(response) {
    console.log('Procesando respuesta:', response);
    
    // Google Apps Script puede devolver diferentes formatos
    const status = response.status || response.result;
    
    switch (status) {
        case 'SUCCESS':
        case 'success':
            showMessage('✅ Registro exitoso. ¡Gracias por confirmar su asistencia!', 'success');
            resetForm();
            handleCancel(); // Ocultar formulario
            break;
            
        case 'ALREADY_REGISTERED':
        case 'already_registered':
            showMessage('⚠️ Este colaborador ya está registrado para el evento.', 'warning');
            break;
            
        case 'NOT_FOUND':
        case 'not_found':
            showMessage('❌ Colaborador no encontrado en el sistema.', 'error');
            break;
            
        case 'ERROR':
        case 'error':
            const errorMsg = response.message || 'Error desconocido al procesar el registro.';
            showMessage(`❌ Error: ${errorMsg}`, 'error');
            break;
            
        default:
            console.warn('Respuesta desconocida:', response);
            showMessage('❌ Respuesta inesperada del servidor.', 'error');
            break;
    }
}

/**
 * Maneja la cancelación del registro
 */
function handleCancel() {
    selectedColaborador = null;
    
    // Ocultar sección de registro
    elements.selectedSection.style.display = 'none';
    elements.selectedSection.classList.remove('active');
    
    // Mostrar sección de búsqueda
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        searchSection.style.display = 'block';
    }
    
    // Limpiar y resetear
    elements.searchInput.value = '';
    resetForm();
    hideMessage();
    hideSearchResults();
    
    // Hacer scroll a la parte superior para volver a la búsqueda
    setTimeout(() => {
        document.querySelector('.search-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}

/**
 * Función para limpiar formulario después de registro exitoso
 */
function resetForm() {
    // Limpiar campos del formulario con validación
    const formElements = [
        'evento', 'categoria', 'lugar', 'fecha', 'hora', 'observaciones'
    ];
    
    formElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = '';
        }
    });
    
    // Limpiar sección de invitados
    if (elements.guestsSection) {
        elements.guestsSection.innerHTML = '';
    }
    
    // Limpiar colaborador seleccionado
    if (elements.searchInput) {
        elements.searchInput.value = '';
    }
    
    // Limpiar resultados de búsqueda
    if (elements.searchResults) {
        elements.searchResults.innerHTML = '';
    }
    
    // Reiniciar variables globales
    selectedColaborador = null;
    
    // Reiniciar contador de invitados
    if (elements.guestCount) {
        elements.guestCount.value = '0';
    }
    
    // Ocultar sección de colaborador seleccionado
    if (elements.selectedSection) {
        elements.selectedSection.style.display = 'none';
    }
}

/**
 * Muestra un mensaje al usuario
 */
function showMessage(text, type = 'info') {
    if (!elements.message) {
        console.error('Elemento message no encontrado');
        return;
    }
    
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    elements.message.style.display = 'block';
    
    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

/**
 * Oculta el mensaje
 */
function hideMessage() {
    if (elements.message) {
        elements.message.style.display = 'none';
    }
}

/**
 * Muestra u oculta el indicador de carga
 */
function showLoading(show) {
    if (!elements.loading) {
        console.error('Elemento loading no encontrado');
        return;
    }
    
    elements.loading.style.display = show ? 'block' : 'none';
}

/**
 * Función para hacer peticiones JSONP a Google Apps Script (evita CORS)
 */
function fetchWithJSONP(url, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        
        // Crear script tag
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url + '?callback=' + callbackName;
        
        // Timeout
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('Timeout: La petición tardó demasiado en responder'));
        }, timeout);
        
        // Función de limpieza
        const cleanup = () => {
            clearTimeout(timeoutId);
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            delete window[callbackName];
        };
        
        // Definir callback global
        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };
        
        // Manejar errores de carga del script
        script.onerror = () => {
            cleanup();
            reject(new Error('Error al cargar el script de Google Apps Script'));
        };
        
        // Agregar script al DOM
        document.head.appendChild(script);
    });
}

/**
 * Función alternativa usando fetch con no-cors mode
 */
async function fetchWithNoCors(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache'
        });
        
        // En modo no-cors no podemos leer la respuesta directamente
        // Necesitamos usar JSONP o modificar el backend
        throw new Error('Modo no-cors activado, usar JSONP en su lugar');
        
    } catch (error) {
        console.error('Error en fetchWithNoCors:', error);
        throw error;
    }
}

/**
 * Utilidades para manejo de errores
 */
window.addEventListener('error', function(event) {
    console.error('Error global:', event.error);
    showMessage('Ha ocurrido un error inesperado. Por favor, recargue la página.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Promesa rechazada:', event.reason);
    showMessage('Error de conexión. Por favor, verifique su conexión a internet.', 'error');
});

/**
 * Función para normalizar texto (quitar acentos y convertir a minúsculas)
 */
function normalizeText(text) {
    if (!text) return '';
    
    return text
        .toLowerCase()
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos (acentos)
        .replace(/[^a-z0-9\s]/g, '') // Eliminar caracteres especiales
        .trim();
}

/**
 * Función para crear una versión sin acentos de los colaboradores
 */
function createSearchableColaboradores(colaboradores) {
    return colaboradores.map(colaborador => ({
        ...colaborador,
        nombreNormalizado: normalizeText(colaborador.nombreCompleto),
        legajoNormalizado: normalizeText(colaborador.legajo)
    }));
}

// Función para verificar si el registro se guardó correctamente después del envío
function verifyRegistrationSaved(collaboratorId, fecha, hora, lugar) {
    console.log('Verificando registro guardado para:', collaboratorId, fecha, hora, lugar);
    
    return new Promise((resolve, reject) => {
        const callbackName = 'verifyRegistrationCallback_' + Date.now();
        
        window[callbackName] = function(response) {
            console.log('Respuesta de verificación:', response);
            
            // Limpiar el callback
            delete window[callbackName];
            
            if (response.error) {
                console.log('Error en verificación:', response.error);
                resolve({ confirmed: false, error: response.error });
            } else if (response.found) {
                console.log('Registro encontrado en Google Sheets');
                resolve({ confirmed: true });
            } else {
                console.log('Registro NO encontrado en Google Sheets');
                resolve({ confirmed: false });
            }
        };
        
        // Crear script para verificar el registro
        const script = document.createElement('script');
        const verificationUrl = `https://script.google.com/macros/s/AKfycbwvmhGXPVaQWJKlQPDKJ3CcBhZlOIZvJJb6gTNBM6dXVHRd_PQNJJFfHBZkZKfLdGfNGQ/exec?callback=${callbackName}&action=verify&collaboratorId=${collaboratorId}&fecha=${fecha}&hora=${hora}&lugar=${encodeURIComponent(lugar)}`;
        
        console.log('URL de verificación:', verificationUrl);
        script.src = verificationUrl;
        
        document.head.appendChild(script);
        
        // Timeout para la verificación (10 segundos)
        setTimeout(() => {
            if (window[callbackName]) {
                console.log('Timeout en verificación');
                delete window[callbackName];
                resolve({ confirmed: null, warning: 'Timeout en verificación' });
            }
        }, 10000);
    });
}
