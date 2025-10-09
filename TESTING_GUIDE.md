# 🧪 Guía de Testing - Sistema v4.3

## 📋 Lista de Verificación

### 1. ✅ **Google Apps Script Testing**
Ejecutar en la consola de Google Apps Script:

```javascript
// Probar el nuevo flujo
testRegistrarConVerificacion()

// Ver estadísticas actuales
getStats()

// Si hay problemas, configurar sheets
setupSheets()
```

### 2. 🌐 **Frontend Testing**

#### **Test 1: Flujo Completo Normal**
1. Abrir `index.html`
2. Ingresar DNI válido: `12345679`
3. Verificar que pasa a formulario
4. Completar todos los datos
5. Enviar registro
6. ✅ Debe mostrar: "Registro Exitoso"

#### **Test 2: DNI Duplicado**
1. Usar el mismo DNI: `12345679`
2. Completar formulario nuevamente
3. Enviar registro
4. ⚠️ Debe mostrar: "Ya estas participando del sorteo"

#### **Test 3: DNI Inválido**
1. Probar DNIs inválidos:
   - `123` (muy corto)
   - `123456789` (muy largo)
   - `1111111` (todos iguales)
   - `2999999` (menor al mínimo)
2. ❌ Debe mostrar: "Ingresa un DNI argentino válido"

### 3. 📊 **Verificar en Google Sheets**
1. Abrir: https://docs.google.com/spreadsheets/d/142en6ZK8Bg1FxnXzH2Zui-pYN_8hBSMOYhVLxjiMC20/edit
2. Verificar que aparezcan los registros en la hoja "Registros"
3. Columnas esperadas:
   - DNI, Nombre, Apellido, Fecha Nacimiento
   - Email, Teléfono, Fecha Evento, Hora Evento
   - IP Address, Timestamp Registro, Estado

### 4. 🔧 **Tests de Red**
1. **Timeout**: Desconectar internet y enviar → Error claro
2. **Retry**: Debería reintentar automáticamente
3. **CORS**: Verificar que no hay errores de CORS

### 5. 📱 **Tests Móviles**
1. Abrir en móvil
2. Verificar que el DNI input acepta solo números
3. Verificar que los helper texts se ven bien
4. Probar flujo completo

## 🐛 **Troubleshooting**

### **Error: "Error de red"**
- Verificar URL del API en `config.js`
- Verificar que Google Apps Script esté desplegado

### **Error: "Acción no válida"**
- El frontend está usando `action=registrar`
- Verificar que Google Apps Script tiene la función `handleRegistrarConVerificacion`

### **Error: "DNI requerido"**
- Verificar que el DNI se está enviando correctamente
- Revisar los parámetros en Network tab del navegador

### **No aparece en Google Sheets**
- Ejecutar `getStats()` en Apps Script console
- Verificar `SPREADSHEET_ID` en el código
- Ejecutar `setupSheets()` si es necesario

## 📝 **URLs Importantes**

- **Google Apps Script**: https://script.google.com/macros/s/AKfycbwa9Ox6Ip3VZ56Oy1eOSCHxNva6TEzOsXEk11rF_Q8doNqeRJlFs9Ro1suW_vbdNor1/exec
- **Google Sheets**: https://docs.google.com/spreadsheets/d/142en6ZK8Bg1FxnXzH2Zui-pYN_8hBSMOYhVLxjiMC20/edit
- **GitHub Pages**: https://piaortiz.github.io/registro-infinitcup

## 🧹 **Limpiar Tests**

```javascript
// En Google Apps Script console
cleanTestData()
```

## ✅ **Todo Funcionando**

Si todos los tests pasan:
1. ✅ Frontend carga rápido
2. ✅ Validación DNI argentina funciona
3. ✅ Registro exitoso se guarda en Sheets
4. ✅ Duplicados se detectan correctamente
5. ✅ Errores se manejan bien
6. ✅ Móviles funcionan perfecto

¡Sistema listo para producción! 🚀