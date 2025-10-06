# 🚀 Sistema de Inscripción por DNI - Guía de Configuración Rápida

## 📋 Resumen
Hemos creado un sistema completamente nuevo que permite inscripciones por DNI en lugar de búsqueda de colaboradores. Las personas ingresan su DNI, y si es la primera vez, completan sus datos. Si ya están registrados, pueden actualizar sus invitados.

## 🔧 Pasos de Configuración

### 1. Crear Nueva Google Sheets
1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crear nueva hoja de cálculo
3. Nombrarla: **"Inscripciones Casino Magic DNI"**
4. Copiar el ID de la URL (la parte entre `/spreadsheets/d/` y `/edit`)

### 2. Configurar Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Crear nuevo proyecto
3. Nombrar: **"Backend Inscripciones DNI"**
4. Copiar el contenido de `backend/google-apps-script-dni.js`
5. **IMPORTANTE**: Reemplazar `TU_NUEVO_SPREADSHEET_ID_AQUI` con el ID real de tu spreadsheet

### 3. Desplegar como Web App
1. En Apps Script, ir a **"Implementar" → "Nueva implementación"**
2. Configurar:
   - **Tipo**: Aplicación web
   - **Descripción**: Backend Inscripciones DNI v3.0
   - **Ejecutar como**: Yo
   - **Acceso**: Cualquier persona
3. Hacer clic en **"Implementar"**
4. **Copiar la URL del Web App**

### 4. Actualizar el Frontend
1. Editar `frontend/js/main-dni.js`
2. En la línea del `apiUrl`, reemplazar `TU_NUEVA_URL_AQUI` con la URL del Web App

## 🧪 Probar el Sistema

### Desde Google Apps Script:
```javascript
// Ejecutar en el editor de Apps Script
testSystem(); // Crea datos de prueba
getStats(); // Ver estadísticas
cleanTestData(); // Limpiar datos de prueba
```

### Desde el Frontend:
1. Abrir `frontend/index.html` en navegador
2. Probar con DNI: `12345678`
3. Completar datos de prueba
4. Verificar que aparece en Google Sheets

## 📊 Estructura de Datos

### Hoja "Participantes"
- **DNI**: Identificador único
- **Nombre Completo**: Nombre del participante
- **Email**: Email de contacto
- **Teléfono**: Número de teléfono
- **Fecha Registro**: Cuándo se registró por primera vez

### Hoja "Inscripciones"
- **DNI**: Referencia al participante
- **Nombre Completo**: Nombre para el evento
- **Email**: Email actual
- **Teléfono**: Teléfono actual
- **Cantidad Invitados**: Número de invitados
- **Detalle Invitados**: JSON con datos de invitados
- **Participa Evento**: SI/NO
- **Es Nuevo**: SI si es primera vez, NO si ya existía
- **Fecha Evento**: Fecha del evento
- **Hora Evento**: Hora del evento
- **Timestamp Inscripción**: Cuándo se inscribió
- **Estado**: ACTIVO/INACTIVO

## 🎯 Características del Nuevo Sistema

### ✅ Ventajas
- **Control por DNI**: Cada persona puede inscribirse solo una vez
- **Datos persistentes**: La información se guarda para futuros eventos
- **Validaciones mejoradas**: Email, teléfono, edad de invitados
- **Interfaz más simple**: Solo 4 pasos para inscribirse
- **Mejor UX móvil**: Optimizado para teléfonos
- **Gestión de invitados**: Hasta 10 invitados con datos completos

### 🔄 Flujo de Usuario
1. **Ingresar DNI** → El sistema verifica si existe
2. **Completar datos** (si es nuevo) o **Confirmar datos** (si existe)
3. **Agregar invitados** (opcional)
4. **Confirmar inscripción** → Guardado en Google Sheets

### 🛡️ Seguridad y Validaciones
- DNI debe tener 7-8 dígitos
- Email válido requerido
- Teléfono requerido
- Nombres de invitados requeridos
- Edad de invitados entre 1-120 años
- Prevención de inscripciones duplicadas

## 🚨 Notas Importantes

1. **Backup del sistema anterior**: Los archivos originales siguen disponibles:
   - `js/main.js` (original)
   - `backend/google-apps-script-backend.js` (original)

2. **Migración**: Si tienes datos del sistema anterior, puedes:
   - Exportar colaboradores existentes
   - Importarlos como participantes en el nuevo sistema
   - Crear script de migración si es necesario

3. **Testing**: Siempre probar en modo desarrollo antes de usar en producción

4. **Monitoreo**: Usar `getStats()` en Apps Script para monitorear uso

## 📱 URLs del Sistema

- **Frontend**: `index.html` (usar el mismo hosting)
- **Backend**: Nueva URL de Google Apps Script
- **Google Sheets**: Nueva hoja de cálculo

## 🆘 Solución de Problemas

### Error "TU_NUEVA_URL_AQUI"
- Verificar que se actualizó la URL en `main-dni.js`

### Error "TU_NUEVO_SPREADSHEET_ID_AQUI"
- Verificar que se actualizó el ID en `google-apps-script-dni.js`

### No se guardan datos
- Verificar permisos del Web App ("Cualquier persona")
- Revisar logs en Google Apps Script

### Errores de CORS
- El sistema usa JSONP, no debería haber problemas de CORS

---

**¡El nuevo sistema está listo para usarse! 🎉**

*Optimizado para eventos, festivales y cualquier ocasión donde necesites control de asistencia por DNI.*