# Sistema de Registro por DNI - Casino Magic

Sistema optimizado de registro de eventos con verificación por DNI para Casino Magic.

## 🚀 Características

- **Registro simple**: Solo DNI, datos personales básicos
- **Verificación única**: Una sola participación por DNI
- **Multi-pantalla**: Interfaz fluida con navegación optimizada
- **Pantalla de éxito**: Confirmación final con condiciones del sorteo
- **Optimizado**: Código limpio y carga rápida
- **Responsivo**: Funciona perfecto en móviles

## 📱 Funcionalidades

### 🔍 Verificación de DNI
- Validación automática de formato
- Verificación en tiempo real contra base de datos
- Mensajes claros de estado

### 📝 Formulario de Registro
- Campos esenciales: Nombre, Apellido, Fecha de nacimiento, Email, Teléfono
- Validaciones en vivo
- Confirmación de participación

### ✅ Pantalla de Éxito
- Confirmación visual del registro
- Recordatorio de condiciones del sorteo
- Botón para cerrar la aplicación

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Google Apps Script
- **Base de datos**: Google Sheets
- **Comunicación**: JSONP para cross-origin

## 📁 Estructura del Proyecto

```
registro-infinitcup/
├── frontend/
│   ├── index.html              # Página principal
│   ├── css/
│   │   └── styles.css          # Estilos optimizados
│   ├── js/
│   │   ├── main-dni-optimized.js  # Script principal optimizado
│   │   └── close-page.js       # Utilidad para cerrar página
│   └── img/                    # Imágenes y logos
├── backend/
│   └── google-apps-script-dni.js  # Backend simplificado
└── docs/
    ├── CONFIGURACION_DNI.md    # Guía de configuración
    └── GUIA_USUARIO_DNI.md     # Guía para usuarios
```

## ⚙️ Configuración

### 1. Google Sheets
1. Crear nueva hoja de cálculo: "Registros Casino Magic"
2. Crear pestaña "Registros" con columnas:
   - DNI, Nombre, Apellido, Fecha Nacimiento, Email, Teléfono, 
   - Fecha Evento, Hora Evento, IP Address, Timestamp, Estado

### 2. Google Apps Script
1. Crear nuevo proyecto de Apps Script
2. Pegar el código de `backend/google-apps-script-dni.js`
3. Configurar el ID de la hoja de cálculo
4. Desplegar como Web App

### 3. Frontend
1. Actualizar la URL de la API en `main-dni-optimized.js`
2. Subir archivos a servidor web o hosting

## 🎯 Uso

1. **Usuario ingresa DNI** → Sistema verifica disponibilidad
2. **Si DNI nuevo** → Formulario de registro
3. **Si DNI existente** → Mensaje de ya registrado
4. **Registro exitoso** → Pantalla de confirmación final

## 🔧 Características Técnicas

- **Optimizado**: 278 líneas vs 503 líneas (45% menos código)
- **Rápido**: Carga y verificación optimizada
- **Ligero**: Sin dependencias pesadas
- **Confiable**: Validaciones completas y manejo de errores

## 📄 Licencia

Proyecto desarrollado para Casino Magic - Eventos.

---

**Versión actual**: v4.2 - Optimizada  
**Desarrollado por**: Pia Ortiz  
**Fecha**: Octubre 2025