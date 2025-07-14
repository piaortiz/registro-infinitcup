# Configuración Paso a Paso

## 1. Configuración de Google Apps Script

### Crear el proyecto
1. Ir a [script.google.com](https://script.google.com)
2. Hacer clic en "Nuevo proyecto"
3. Copiar el código de `backend/google-apps-script-backend.js`
4. Pegar en el editor y guardar

### Configurar la spreadsheet
1. Crear nueva Google Sheets
2. Renombrar la hoja principal a "Colaboradores"
3. Configurar columnas:
   - A1: "Nombre"
   - B1: "Legajo"
4. Agregar datos de colaboradores

5. Crear segunda hoja llamada "Registros"
6. Configurar columnas:
   - A1: "Timestamp"
   - B1: "Nombre"
   - C1: "Legajo"
   - D1: "Invitados"
   - E1: "Detalles"

### Obtener el ID de la spreadsheet
- En la URL de Google Sheets: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`
- Copiar el ID y reemplazar en el código:
```javascript
const SPREADSHEET_ID = 'TU_ID_AQUI';
```

### Desplegar como Web App
1. En Apps Script, ir a "Desplegar" → "Nueva implementación"
2. Configurar:
   - Tipo: "Aplicación web"
   - Descripción: "API Registro Eventos"
   - Ejecutar como: "Yo"
   - Quién puede acceder: "Cualquier persona"
3. Hacer clic en "Desplegar"
4. Copiar la URL generada

**URL actual del sistema**: https://script.google.com/macros/s/AKfycbxY09Lg1dskwOdKy9ZEVOrfwWVJlqRa9iXhCGbrYDGb98ymfjt2enKEFvlOhRh576kc/exec

## 2. Configuración del Frontend

### Actualizar la URL del backend
En `frontend/js/main.js`, línea ~9:
```javascript
const CONFIG = {
    // URL del Web App de Google Apps Script - Versión 6 del 14 jul 2025
    apiUrl: 'https://script.google.com/macros/s/AKfycbxY09Lg1dskwOdKy9ZEVOrfwWVJlqRa9iXhCGbrYDGb98ymfjt2enKEFvlOhRh576kc/exec',
    maxGuests: 10,
    searchDelay: 300
};
```

### Datos actuales de la aplicación
- **Versión**: 6 del 14 jul 2025, 1:09 p.m.
- **ID de implementación**: AKfycbxY09Lg1dskwOdKy9ZEVOrfwWVJlqRa9iXhCGbrYDGb98ymfjt2enKEFvlOhRh576kc
- **URL del Web App**: https://script.google.com/macros/s/AKfycbxY09Lg1dskwOdKy9ZEVOrfwWVJlqRa9iXhCGbrYDGb98ymfjt2enKEFvlOhRh576kc/exec
- **Biblioteca**: https://script.google.com/macros/library/d/1mCRlsepbb9vI-i9VGcbULoOXu240ISAIBRJpzic0hEJzcX1pY-Uybql3/6

## 3. Pruebas Locales

### Usando Python
```bash
cd registro_eventos
python -m http.server 8000
```
Abrir: `http://localhost:8000/frontend/`

### Usando Node.js
```bash
npx http-server
```

## 4. Despliegue en GitHub Pages

### Subir a GitHub
```bash
git init
git add .
git commit -m "Sistema de registro de eventos"
git branch -M main
git remote add origin https://github.com/USUARIO/registro_eventos.git
git push -u origin main
```

### Activar GitHub Pages
1. Ir a repositorio → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main"
4. Folder: "/ (root)"
5. Save

La aplicación estará en: `https://USUARIO.github.io/registro_eventos/frontend/`

## 5. Verificación del Sistema

### Probar la carga de datos
1. Abrir la aplicación
2. Verificar que cargue la lista de colaboradores
3. Probar búsqueda por nombre y legajo

### Probar el registro
1. Seleccionar un colaborador
2. Agregar invitados
3. Enviar registro
4. Verificar que aparezca en Google Sheets

## 6. URLs Importantes

- **Google Apps Script**: `https://script.google.com/`
- **Google Sheets**: `https://sheets.google.com/`
- **GitHub Pages**: `https://pages.github.com/`
- **Fuse.js CDN**: `https://cdn.jsdelivr.net/npm/fuse.js@6.6.2`

## 7. Estructura de Datos

### Colaboradores (Hoja 1)
```
| Nombre        | Legajo |
|---------------|--------|
| Juan Pérez    | 1001   |
| María García  | 1002   |
| José López    | 1003   |
```

### Registros (Hoja 2)
```
| Timestamp           | Nombre     | Legajo | Invitados | Detalles                    |
|---------------------|------------|--------|-----------|----------------------------|
| 2025-01-15 10:30:00 | Juan Pérez | 1001   | 2         | Invitado 1: Ana, Invitado 2: Luis |
```

## 8. Solución de Problemas

### Error: "Script function not found"
- Verificar que el script esté guardado
- Redesplegar la Web App

### Error: "Permission denied"
- Verificar permisos de la spreadsheet
- Confirmar que el script tenga acceso

### Los datos no cargan
- Verificar URL del API
- Comprobar configuración CORS
- Revisar nombres de las hojas

### Registros no se guardan
- Verificar ID de spreadsheet
- Confirmar estructura de las hojas
- Revisar logs en Apps Script

## 9. Personalización

### Cambiar colores
En `frontend/css/styles.css`:
```css
.header {
    background: linear-gradient(135deg, #TU_COLOR_1, #TU_COLOR_2);
}
```

### Modificar límite de invitados
En `frontend/js/main.js`:
```javascript
max="10"  // Cambiar a tu límite preferido
```

### Agregar campos adicionales
1. Modificar HTML para agregar inputs
2. Actualizar JavaScript para capturar datos
3. Modificar Google Apps Script para procesar nuevos campos

## 10. Mantenimiento

### Backup de datos
- Exportar Google Sheets regularmente
- Versionar el código en GitHub
- Documentar cambios importantes

### Monitoreo
- Revisar logs en Google Apps Script
- Verificar uso de quotas
- Probar funcionalidad periódicamente

### Actualizaciones
- Mantener dependencias actualizadas
- Probar en diferentes dispositivos
- Optimizar rendimiento según uso
