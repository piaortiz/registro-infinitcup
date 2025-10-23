/**
 * Configuración para GitHub Pages v4.3
 * Este archivo permite que la aplicación funcione tanto en demo como en producción
 * MEJORAS: Optimización de carga, validación mejorada
 */

window.APP_CONFIG = {
    // Configuración de entorno
    environment: 'github-pages', // 'github-pages' o 'production'
    
    // URLs de APIs - ACTUALIZADA v6.1 (nombreCompleto fix)
    apiUrl: 'https://script.google.com/macros/s/AKfycbwf-1NsI6gyUqR9_Bk_N5B06R9CiY05Rfn9K2xHao7UfZJS2e3OLlmAqONzBc9noo4A/exec',
    
    // GitHub Pages info
    githubPagesUrl: 'https://piaortiz.github.io/registro-infinitcup',
    
    // Configuración de demo
    demoMode: false, // Cambiar a true para modo demo con datos simulados
    
    // DNIs de ejemplo para demo
    demoDnis: {
        '12345678': {
            dni: '12345678',
            nombre: 'Juan Carlos',
            apellido: 'Pérez',
            email: 'juan@ejemplo.com',
            telefono: '1123456789'
        },
        '87654321': {
            dni: '87654321', 
            nombre: 'María Elena',
            apellido: 'González',
            email: 'maria@ejemplo.com',
            telefono: '1198765432'
        }
    },
    
    // Mensajes personalizados
    messages: {
        title: 'Registro al Evento - Casino Magic',
        participateText: 'Participa de los sorteos',
        dniPlaceholder: 'Completa tus datos para participar',
        registerButton: 'REGISTRARSE'
    },
    
    // Configuración de timeouts y reintentos
    network: {
        defaultTimeout: 5000,
        longTimeout: 15000,
        maxRetries: 2,
        retryDelay: 1000
    }
};