/**
 * GOOGLE APPS SCRIPT - SISTEMA DE REGISTRO POR DNI - SIMPLIFICADO
 * Casino Magic - Eventos v4.1
 * Autor: Pia Ortiz
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Crear nueva Google Sheets con nombre "Registros Casino Magic"
 * 2. Copiar el ID de la spreadsheet de la URL
 * 3. Reemplazar SPREADSHEET_ID abajo
 * 4. Desplegar como Web App con permisos para "Cualquier persona"
 * 5. Copiar URL del Web App y actualizar en main-dni.js
 * 
 * CARACTERÍSTICAS:
 * - Una sola tabla "Registros" con todos los datos
 * - Sistema simplificado y rápido
 * - Sin lógica compleja de participantes separados
 */

// ===== CONFIGURACIÓN =====
// Configuración
const SPREADSHEET_ID = '142en6ZK8Bg1FxnXzH2Zui-pYN_8hBSMOYhVLxjiMC20'; // Tu ID de Google Sheets
const REGISTROS_SHEET = 'Registros';

// ===== FUNCIÓN PRINCIPAL =====
function doGet(e) {
  console.log('📥 Petición recibida:', JSON.stringify(e.parameter));
  
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback;
    
    let result;
    
    switch (action) {
      case 'checkDni':
        result = handleCheckDni(e.parameter);
        break;
        
      case 'inscribir':
        result = handleInscribir(e.parameter);
        break;
        
      default:
        result = {
          status: 'ERROR',
          message: 'Acción no válida'
        };
    }
    
    return createResponse(result, callback);
    
  } catch (error) {
    console.error('❌ Error general:', error);
    
    const errorResult = {
      status: 'ERROR',
      message: 'Error interno del servidor',
      details: error.toString()
    };
    
    return createResponse(errorResult, e.parameter.callback);
  }
}

// ===== VERIFICAR DNI =====
function handleCheckDni(params) {
  console.log('🔍 Verificando DNI:', params.dni);
  
  const dni = params.dni;
  
  if (!dni) {
    return {
      status: 'ERROR',
      message: 'DNI requerido'
    };
  }
  
  try {
    // Buscar en registros existentes
    const registro = findRegistroByDni(dni);
    
    return {
      status: 'SUCCESS',
      exists: !!registro,
      participant: registro
    };
    
  } catch (error) {
    console.error('❌ Error verificando DNI:', error);
    return {
      status: 'ERROR',
      message: 'Error al verificar DNI'
    };
  }
}

// ===== PROCESAR REGISTRO =====
function handleInscribir(params) {
  console.log('📝 Procesando registro para DNI:', params.dni);
  
  try {
    // Validar datos requeridos
    if (!params.dni || !params.nombre || !params.apellido) {
      return {
        status: 'ERROR',
        message: 'DNI, nombre y apellido son requeridos'
      };
    }
    
    // Verificar si ya está registrado a este evento
    if (isAlreadyRegistrado(params.dni)) {
      return {
        status: 'WARNING',
        message: 'Este DNI ya está registrado al evento'
      };
    }
    
    // Procesar registro
    const inscriptionData = {
      dni: params.dni,
      nombre: params.nombre,
      apellido: params.apellido,
      fechaNacimiento: params.fechaNacimiento,
      email: params.email || '',
      telefono: params.telefono || '',
      fecha: params.fecha || new Date().toISOString().split('T')[0],
      hora: params.hora || new Date().toTimeString().split(' ')[0],
      timestamp: params.timestamp || new Date().toISOString()
    };
    
    // Guardar registro
    const saveResult = saveRegistro(inscriptionData);
    
    if (saveResult.success) {
      console.log('✅ Registro guardado exitosamente');
      return {
        status: 'SUCCESS',
        message: 'Registro completado exitosamente',
        data: {
          dni: inscriptionData.dni,
          nombre: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
          timestamp: inscriptionData.timestamp
        }
      };
    } else {
      console.error('❌ Error guardando registro:', saveResult.error);
      return {
        status: 'ERROR',
        message: 'Error al guardar registro: ' + saveResult.error
      };
    }
    
  } catch (error) {
    console.error('❌ Error procesando registro:', error);
    return {
      status: 'ERROR',
      message: 'Error interno: ' + error.toString()
    };
  }
}

// ===== FUNCIONES DE BÚSQUEDA =====

function findRegistroByDni(dni) {
  try {
    const sheet = getOrCreateSheet(REGISTROS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Buscar DNI en la primera columna (saltando headers)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString() === dni.toString()) {
        // Verificar que esté activo
        const estado = data[i][10]; // Columna estado
        if (!estado || estado === 'ACTIVO') {
          return {
            dni: data[i][0],
            nombre: data[i][1],
            apellido: data[i][2],
            fechaNacimiento: data[i][3],
            email: data[i][4],
            telefono: data[i][5],
            fechaInscripcion: data[i][9]
          };
        }
      }
    }
    
    return null;
    
  } catch (error) {
    console.error('Error buscando inscripción:', error);
    throw error;
  }
}

function isAlreadyRegistrado(dni) {
  try {
    const sheet = getOrCreateSheet(REGISTROS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Buscar DNI en registros activos
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString() === dni.toString()) {
        // Verificar que la inscripción esté activa
        const estado = data[i][10]; // Columna estado
        if (!estado || estado === 'ACTIVO') {
          return true;
        }
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('Error verificando inscripción:', error);
    return false;
  }
}

// ===== FUNCIONES DE GUARDADO =====

function saveRegistro(data) {
  try {
    console.log('💾 Guardando registro:', data.dni);
    
    // Guardar en hoja de registros
    const registroResult = saveToRegistros(data);
    return registroResult;
    
  } catch (error) {
    console.error('Error guardando inscripción:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function saveToRegistros(data) {
  try {
    const sheet = getOrCreateSheet(REGISTROS_SHEET);
    
    // Crear headers si es necesario
    if (sheet.getLastRow() === 0) {
      const headers = [
        'DNI', 'Nombre', 'Apellido', 'Fecha Nacimiento', 'Email', 'Teléfono', 
        'Fecha Evento', 'Hora Evento', 'IP Address', 'Timestamp Inscripción', 'Estado'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaders(sheet, headers.length);
    }
    
    // Preparar fila de datos
    const rowData = [
      data.dni,
      data.nombre,
      data.apellido,
      data.fechaNacimiento,
      data.email,
      data.telefono,
      data.fecha,
      data.hora,
      getClientIP(),
      data.timestamp,
      'ACTIVO'
    ];
    
    // Agregar fila
    sheet.appendRow(rowData);
    
    console.log('✅ Inscripción guardada en hoja');
    return { 
      success: true,
      message: 'Inscripción guardada correctamente'
    };
    
  } catch (error) {
    console.error('Error guardando en inscripciones:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== FUNCIONES AUXILIARES =====

function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    console.log(`Creando hoja: ${sheetName}`);
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  return sheet;
}

function formatHeaders(sheet, numColumns) {
  const headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setHorizontalAlignment('center');
  
  // Auto-resize columns
  for (let i = 1; i <= numColumns; i++) {
    sheet.autoResizeColumn(i);
  }
}

function createResponse(result, callback) {
  const response = JSON.stringify(result);
  
  if (callback) {
    // JSONP response
    const jsonpResponse = `${callback}(${response});`;
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // JSON response
    return ContentService
      .createTextOutput(response)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getClientIP() {
  try {
    // En Google Apps Script, la IP del cliente no está directamente disponible
    // Retornamos un placeholder
    return 'N/A';
  } catch (error) {
    return 'Unknown';
  }
}

// ===== FUNCIONES DE CONFIGURACIÓN =====

/**
 * Función para crear una nueva planilla desde cero
 * Usar si hay problemas con la planilla existente
 */
function createNewSpreadsheet() {
  console.log('🆕 Creando nueva planilla...');
  
  try {
    // Crear nueva spreadsheet
    const newSpreadsheet = SpreadsheetApp.create('Inscripciones Casino Magic - InfinitCup');
    const newId = newSpreadsheet.getId();
    
    console.log('✅ Nueva planilla creada');
    console.log('🆔 Nuevo ID:', newId);
    console.log('🔗 URL:', `https://docs.google.com/spreadsheets/d/${newId}/edit`);
    
    // Actualizar el ID en el código (mostrar instrucciones)
    console.log('');
    console.log('📝 INSTRUCCIONES:');
    console.log('1. Copia este ID:', newId);
    console.log('2. Reemplaza SPREADSHEET_ID en el código');
    console.log('3. Ejecuta setupSheets() de nuevo');
    
    return {
      success: true,
      spreadsheetId: newId,
      url: `https://docs.google.com/spreadsheets/d/${newId}/edit`
    };
    
  } catch (error) {
    console.error('❌ Error creando planilla:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para configurar las hojas inicialmente
 * Ejecutar una vez al configurar el sistema
 */
function setupSheets() {
  console.log('🔧 Configurando hoja del sistema...');
  
  try {
    // Crear hoja de Registros
    console.log('📝 Creando hoja Registros...');
    const registrosSheet = getOrCreateSheet(REGISTROS_SHEET);
    
    if (registrosSheet.getLastRow() === 0) {
      const registrosHeaders = [
        'DNI', 'Nombre', 'Apellido', 'Fecha Nacimiento', 'Email', 'Teléfono', 
        'Fecha Evento', 'Hora Evento', 'IP Address', 'Timestamp Registro', 'Estado'
      ];
      registrosSheet.getRange(1, 1, 1, registrosHeaders.length).setValues([registrosHeaders]);
      formatHeaders(registrosSheet, registrosHeaders.length);
      console.log('✅ Hoja Inscripciones configurada');
    } else {
      console.log('ℹ️ Hoja Inscripciones ya existe');
    }
    
    // Mostrar estadísticas
    const stats = getStats();
    console.log('📊 Configuración completada:');
    console.log(`- Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`- Hoja creada: ${REGISTROS_SHEET}`);
    
    console.log('🎉 ¡Sistema configurado correctamente!');
    
    return {
      success: true,
      message: 'Sistema configurado correctamente',
      spreadsheetId: SPREADSHEET_ID,
      sheets: [REGISTROS_SHEET]
    };
    
  } catch (error) {
    console.error('❌ Error configurando sistema:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== FUNCIONES DE TESTING =====

/**
 * Función para probar el sistema desde el editor de Apps Script
 */
function testSystem() {
  console.log('🧪 Iniciando test del sistema...');
  
  // Test 1: Verificar DNI inexistente
  const testDni = '12345678';
  const checkResult = handleCheckDni({ dni: testDni });
  console.log('Test checkDni:', checkResult);
  
  // Test 2: Inscribir participante nuevo
  const inscripcionResult = handleInscribir({
    dni: testDni,
    nombre: 'Test',
    apellido: 'Usuario',
    fechaNacimiento: '1990-01-01',
    email: 'test@email.com',
    telefono: '11-1234-5678',
    fecha: '2025-10-06',
    hora: '10:00:00',
    timestamp: new Date().toISOString()
  });
  console.log('Test inscripción:', inscripcionResult);
  
  // Test 3: Verificar DNI ahora existente
  const checkResult2 = handleCheckDni({ dni: testDni });
  console.log('Test checkDni después de inscripción:', checkResult2);
  
  console.log('✅ Tests completados');
}

/**
 * Función para limpiar datos de test
 */
function cleanTestData() {
  console.log('🧹 Limpiando datos de test...');
  
  try {
    const testDni = '12345678';
    
    // Limpiar de registros
    const registrosSheet = getOrCreateSheet(REGISTROS_SHEET);
    const registrosData = registrosSheet.getDataRange().getValues();
    
    for (let i = registrosData.length - 1; i >= 1; i--) {
      if (registrosData[i][0] === testDni) {
        registrosSheet.deleteRow(i + 1);
        console.log('Eliminada inscripción test');
      }
    }
    
    console.log('✅ Limpieza completada');
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
  }
}

/**
 * Función para obtener estadísticas
 */
function getStats() {
  try {
    const registrosSheet = getOrCreateSheet(REGISTROS_SHEET);
    const totalRegistros = Math.max(0, registrosSheet.getLastRow() - 1);
    
    console.log(`📊 Estadísticas:
    - Total registros: ${totalRegistros}
    - Spreadsheet ID: ${SPREADSHEET_ID}`);
    
    return {
      registros: totalRegistros,
      spreadsheetId: SPREADSHEET_ID
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return { error: error.toString() };
  }
}