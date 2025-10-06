/**
 * Configuración para GitHub Pages
 * Este archivo permite que la aplicación funcione tanto en demo como en producción
 */

window.APP_CONFIG = {
    // Configuración de entorno
    environment: 'github-pages', // 'github-pages' o 'production'
    
    // URLs de APIs
    apiUrl: 'https://script.google.com/macros/s/AKfycbw0gCV_b_vXkwI-utkTpN8mLexTxxlSc74au7dhuho74zOdrCEtYECSgmQOsquGKOMV/exec',
    
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
        dniPlaceholder: 'Ingresa tu DNI',
        verifyButton: 'VERIFICAR',
        registerButton: 'REGISTRARSE'
    }
};