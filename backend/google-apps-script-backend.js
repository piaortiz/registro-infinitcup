/**
 * CÓDIGO DE GOOGLE APPS SCRIPT PARA EL BACKEND
 * Autor: Pia Ortiz
 */

// ===== CONFIGURACIÓN =====
const SPREADSHEET_ID = '1UBJAmbAWfyjXcKlnJCnmmbkAppzUDKnkQqfHD8Q4ZGc'; // ID de tu Google Sheets
const SHEET_NAME = 'Registros'; // Nombre de la hoja donde se guardarán los registros
const COLABORADORES_SHEET = 'Colaboradores'; // Nombre de la hoja con los colaboradores

// ===== FUNCIÓN PRINCIPAL =====
/**
 * Función principal que maneja las peticiones HTTP
 */
function doGet(e) {
  try {
    console.log('Recibida petición GET');
    console.log('Parámetros recibidos:', e.parameter);
    
    // ===== MANEJAR REGISTRO DE ASISTENCIA =====
    if (e.parameter.action === 'register') {
      console.log('🔄 Procesando registro de asistencia');
      console.log('Datos recibidos:', e.parameter);
      
      const callback = e.parameter.callback;
      
      try {
        // Extraer datos del parámetro
        const data = {
          legajo: e.parameter.legajo,
          nombreCompleto: e.parameter.nombreCompleto,
          cantidadInvitados: parseInt(e.parameter.cantidadInvitados) || 0,
          invitados: e.parameter.invitados ? JSON.parse(e.parameter.invitados) : [],
          fecha: e.parameter.fecha,
          hora: e.parameter.hora,
          lugar: e.parameter.lugar,
          timestamp: e.parameter.timestamp
        };
        
        console.log('Datos procesados:', data);
        
        // Validar datos requeridos
        if (!data.legajo || !data.nombreCompleto) {
          console.error('❌ Faltan datos requeridos');
          const errorResult = {
            status: 'ERROR',
            message: 'Faltan datos requeridos: legajo o nombreCompleto'
          };
          
          if (callback) {
            const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
            return ContentService
              .createTextOutput(jsonpResponse)
              .setMimeType(ContentService.MimeType.JAVASCRIPT);
          } else {
            return ContentService
              .createTextOutput(JSON.stringify(errorResult))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
        
        // Verificar que el colaborador existe
        if (!colaboradorExists(data.legajo)) {
          console.error('❌ Colaborador no encontrado:', data.legajo);
          const errorResult = {
            status: 'ERROR',
            message: 'Colaborador no encontrado en el sistema'
          };
          
          if (callback) {
            const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
            return ContentService
              .createTextOutput(jsonpResponse)
              .setMimeType(ContentService.MimeType.JAVASCRIPT);
          } else {
            return ContentService
              .createTextOutput(JSON.stringify(errorResult))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
        
        // Verificar si ya está registrado
        if (isAlreadyRegistered(data.legajo)) {
          console.log('⚠️ Colaborador ya registrado:', data.legajo);
          const warningResult = {
            status: 'WARNING',
            message: 'El colaborador ya está registrado para este evento'
          };
          
          if (callback) {
            const jsonpResponse = callback + '(' + JSON.stringify(warningResult) + ');';
            return ContentService
              .createTextOutput(jsonpResponse)
              .setMimeType(ContentService.MimeType.JAVASCRIPT);
          } else {
            return ContentService
              .createTextOutput(JSON.stringify(warningResult))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
        
        // Registrar asistencia
        console.log('✅ Guardando registro en Google Sheets...');
        const result = registerAttendance(data);
        
        if (result.success) {
          console.log('✅ Registro guardado exitosamente');
          const successResult = {
            status: 'SUCCESS',
            message: 'Registro de asistencia guardado exitosamente'
          };
          
          if (callback) {
            const jsonpResponse = callback + '(' + JSON.stringify(successResult) + ');';
            return ContentService
              .createTextOutput(jsonpResponse)
              .setMimeType(ContentService.MimeType.JAVASCRIPT);
          } else {
            return ContentService
              .createTextOutput(JSON.stringify(successResult))
              .setMimeType(ContentService.MimeType.JSON);
          }
        } else {
          console.error('❌ Error al guardar registro:', result.error);
          const errorResult = {
            status: 'ERROR',
            message: 'Error al guardar el registro: ' + result.error
          };
          
          if (callback) {
            const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
            return ContentService
              .createTextOutput(jsonpResponse)
              .setMimeType(ContentService.MimeType.JAVASCRIPT);
          } else {
            return ContentService
              .createTextOutput(JSON.stringify(errorResult))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
        
      } catch (error) {
        console.error('❌ Error procesando registro:', error);
        const errorResult = {
          status: 'ERROR',
          message: 'Error interno al procesar el registro: ' + error.message
        };
        
        if (callback) {
          const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
          return ContentService
            .createTextOutput(jsonpResponse)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        } else {
          return ContentService
            .createTextOutput(JSON.stringify(errorResult))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // ===== MANEJAR VERIFICACIÓN DE REGISTRO =====
    if (e.parameter.action === 'check' && e.parameter.legajo) {
      console.log('Verificando registro para legajo:', e.parameter.legajo);
      
      const isRegistered = isAlreadyRegistered(e.parameter.legajo);
      const callback = e.parameter.callback;
      
      const result = {
        registered: isRegistered,
        legajo: e.parameter.legajo,
        timestamp: new Date().toISOString()
      };
      
      if (callback) {
        // Respuesta JSONP
        const jsonpResponse = callback + '(' + JSON.stringify(result) + ');';
        return ContentService
          .createTextOutput(jsonpResponse)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        // Respuesta JSON normal
        return ContentService
          .createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Verificar si es una petición de verificación de registro específico
    if (e.parameter.action === 'verify' && e.parameter.collaboratorId) {
      console.log('Verificando registro específico para:', e.parameter.collaboratorId);
      
      const collaboratorId = e.parameter.collaboratorId;
      const fecha = e.parameter.fecha;
      const hora = e.parameter.hora;
      const lugar = e.parameter.lugar;
      
      const registroSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      if (!registroSheet) {
        const result = {
          found: false,
          collaboratorId: collaboratorId,
          fecha: fecha,
          hora: hora,
          lugar: lugar,
          error: 'Hoja de registros no encontrada',
          timestamp: new Date().toISOString()
        };
        
        const callback = e.parameter.callback;
        if (callback) {
          const jsonpResponse = callback + '(' + JSON.stringify(result) + ');';
          return ContentService
            .createTextOutput(jsonpResponse)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        }
        return ContentService
          .createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const registros = registroSheet.getDataRange().getValues();
      
      // Buscar el registro específico (últimas 50 filas para optimizar)
      // Columnas: [0]Legajo, [1]Nombre, [2]Fecha, [3]Hora, [4]Lugar, [5]Cantidad, [6]Detalle, [7]FechaRegistro, [8]Estado
      const recentRegistros = registros.slice(-50);
      const found = recentRegistros.some(row => 
        row[0] == collaboratorId && 
        row[2] == fecha && 
        row[3] == hora && 
        row[4] == lugar
      );
      
      const result = {
        found: found,
        collaboratorId: collaboratorId,
        fecha: fecha,
        hora: hora,
        lugar: lugar,
        timestamp: new Date().toISOString()
      };
      
      const callback = e.parameter.callback;
      if (callback) {
        // Respuesta JSONP
        const jsonpResponse = callback + '(' + JSON.stringify(result) + ');';
        return ContentService
          .createTextOutput(jsonpResponse)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        // Respuesta JSON normal
        return ContentService
          .createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Obtener lista de colaboradores (funcionalidad original)
    const colaboradores = getColaboradores();
    
    // Verificar si es una petición JSONP
    const callback = e.parameter.callback;
    if (callback) {
      console.log('Respondiendo con JSONP, callback:', callback);
      
      // Crear respuesta JSONP
      const jsonpResponse = callback + '(' + JSON.stringify({
        status: 'SUCCESS',
        message: 'Colaboradores obtenidos correctamente',
        colaboradores: colaboradores
      }) + ');';
      
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Respuesta JSON normal
      return createResponse('SUCCESS', 'Colaboradores obtenidos correctamente', colaboradores);
    }
    
  } catch (error) {
    console.error('Error en doGet:', error);
    
    // Manejar error con JSONP si es necesario
    const callback = e.parameter ? e.parameter.callback : null;
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify({
        status: 'ERROR',
        message: 'Error al obtener colaboradores: ' + error.message
      }) + ');';
      
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return createResponse('ERROR', 'Error al obtener colaboradores: ' + error.message);
    }
  }
}

/**
 * Función principal que maneja las peticiones POST
 */
function doPost(e) {
  try {
    console.log('Recibida petición POST');
    console.log('postData:', e.postData);
    console.log('parameter:', e.parameter);
    
    let data;
    
    // Verificar si los datos vienen en el cuerpo de la petición (JSON)
    if (e.postData && e.postData.contents) {
      console.log('Parseando datos JSON del cuerpo de la petición');
      data = JSON.parse(e.postData.contents);
    } 
    // Verificar si los datos vienen como parámetro de formulario
    else if (e.parameter && e.parameter.data) {
      console.log('Parseando datos JSON del parámetro de formulario');
      data = JSON.parse(e.parameter.data);
    } 
    // Verificar si los datos vienen directamente como parámetros
    else if (e.parameter && e.parameter.legajo) {
      console.log('Leyendo datos directamente de parámetros');
      data = {
        legajo: e.parameter.legajo,
        nombreCompleto: e.parameter.nombreCompleto,
        invitados: e.parameter.invitados ? JSON.parse(e.parameter.invitados) : []
      };
    } 
    else {
      throw new Error('No se encontraron datos en la petición POST');
    }
    
    console.log('Datos procesados:', data);
    
    // Validar datos requeridos
    if (!data.legajo || !data.nombreCompleto) {
      return createResponse('ERROR', 'Faltan datos requeridos: legajo o nombreCompleto');
    }
    
    // Verificar que el colaborador existe
    if (!colaboradorExists(data.legajo)) {
      return createResponse('NOT_FOUND', 'Colaborador no encontrado');
    }
    
    // Verificar si ya está registrado
    if (isAlreadyRegistered(data.legajo)) {
      return createResponse('ALREADY_REGISTERED', 'El colaborador ya está registrado');
    }
    
    // Registrar asistencia
    const result = registerAttendance(data);
    
    if (result.success) {
      return createResponse('SUCCESS', 'Registro exitoso');
    } else {
      return createResponse('ERROR', result.error);
    }
    
  } catch (error) {
    console.error('Error en doPost:', error);
    return createResponse('ERROR', 'Error interno del servidor: ' + error.message);
  }
}

// ===== FUNCIONES AUXILIARES =====

/**
 * Obtiene la lista de colaboradores desde Google Sheets
 */
function getColaboradores() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(COLABORADORES_SHEET);
    
    if (!sheet) {
      throw new Error(`La hoja '${COLABORADORES_SHEET}' no existe`);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      throw new Error('La hoja de colaboradores está vacía');
    }
    
    // Convertir datos a formato JSON (omitir la primera fila que son headers)
    const colaboradores = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && row[1]) { // Verificar que tenga legajo y nombre
        colaboradores.push({
          legajo: row[0].toString(),
          nombreCompleto: row[1].toString()
        });
      }
    }
    
    console.log(`Obtenidos ${colaboradores.length} colaboradores`);
    return colaboradores;
    
  } catch (error) {
    console.error('Error obteniendo colaboradores:', error);
    throw error;
  }
}

/**
 * Verifica si un colaborador existe en la base de datos
 */
function colaboradorExists(legajo) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(COLABORADORES_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Buscar en la columna de legajos (asumiendo que está en la columna A)
    for (let i = 1; i < data.length; i++) { // Empezar desde 1 para omitir headers
      if (data[i][0].toString() === legajo.toString()) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error verificando colaborador:', error);
    return false;
  }
}

/**
 * Verifica si un colaborador ya está registrado
 */
function isAlreadyRegistered(legajo) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, la creamos
    if (!sheet) {
      createRegistrationSheet();
      return false;
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Buscar en la columna de legajos
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === legajo.toString()) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error verificando registro:', error);
    return false;
  }
}

/**
 * Registra la asistencia del colaborador
 */
function registerAttendance(data) {
  try {
    console.log('🔄 registerAttendance iniciado con datos:', data);
    
    let sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, la creamos
    if (!sheet) {
      console.log('📝 Creando hoja de registros...');
      sheet = createRegistrationSheet();
    }
    
    // Preparar datos para insertar
    const timestamp = new Date();
    const invitadosText = data.invitados && data.invitados.length > 0 ? 
      data.invitados.map(inv => `${inv.nombre} (${inv.vinculo})`).join(', ') : 
      'Sin invitados';
    
    const rowData = [
      data.legajo,
      data.nombreCompleto,
      data.fecha || timestamp.toISOString().split('T')[0], // Usar fecha actual si no se proporciona
      data.hora || timestamp.toTimeString().split(' ')[0], // Usar hora actual si no se proporciona  
      data.lugar || 'Evento de Empresa',
      data.cantidadInvitados || 0,
      invitadosText,
      timestamp,
      'Confirmado'
    ];
    
    console.log('📝 Insertando fila:', rowData);
    
    // Insertar nueva fila
    sheet.appendRow(rowData);
    
    console.log('✅ Fila insertada exitosamente');
    
    // También podemos guardar los invitados en una hoja separada si es necesario
    if (data.invitados && data.invitados.length > 0) {
      console.log('👥 Guardando invitados en hoja separada...');
      saveGuests(data.legajo, data.invitados);
    }
    
    console.log('✅ registerAttendance completado exitosamente');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error registrando asistencia:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Crea la hoja de registros si no existe
 */
function createRegistrationSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Configurar headers
    const headers = [
      'Legajo',
      'Nombre Completo',
      'Fecha',
      'Hora',
      'Lugar',
      'Cantidad Invitados',
      'Detalle Invitados',
      'Fecha Registro',
      'Estado'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Formato de headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Ajustar anchos de columnas
    sheet.setColumnWidth(1, 80);  // Legajo
    sheet.setColumnWidth(2, 200); // Nombre
    sheet.setColumnWidth(3, 100); // Fecha
    sheet.setColumnWidth(4, 100); // Hora
    sheet.setColumnWidth(5, 150); // Lugar
    sheet.setColumnWidth(6, 80);  // Cantidad
    sheet.setColumnWidth(7, 300); // Detalle
    sheet.setColumnWidth(8, 150); // Fecha Registro
    sheet.setColumnWidth(9, 100); // Estado
    
    return sheet;
    
  } catch (error) {
    console.error('Error creando hoja de registros:', error);
    throw error;
  }
}

/**
 * Guarda los invitados en una hoja separada (opcional)
 */
function saveGuests(legajo, invitados) {
  try {
    const sheetName = 'Invitados';
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // Crear hoja si no existe
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      const headers = ['Legajo Colaborador', 'Nombre Colaborador', 'Nombre Invitado', 'Vínculo', 'Fecha Registro'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formato de headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#34a853');
      headerRange.setFontColor('white');
    }
    
    // Obtener nombre del colaborador
    const colaboradorSheet = spreadsheet.getSheetByName(COLABORADORES_SHEET);
    const colaboradorData = colaboradorSheet.getDataRange().getValues();
    let nombreColaborador = '';
    
    for (let i = 1; i < colaboradorData.length; i++) {
      if (colaboradorData[i][0].toString() === legajo.toString()) {
        nombreColaborador = colaboradorData[i][1]; // Asumiendo que el nombre está en columna B
        break;
      }
    }
    
    // Insertar cada invitado
    const timestamp = new Date();
    invitados.forEach(invitado => {
      const rowData = [
        legajo,
        nombreColaborador,
        invitado.nombre,
        invitado.vinculo,
        timestamp
      ];
      sheet.appendRow(rowData);
    });
    
  } catch (error) {
    console.error('Error guardando invitados:', error);
  }
}

/**
 * Crea la respuesta HTTP
 */
function createResponse(status, message, data = null) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  // Si hay datos adicionales (como colaboradores), los incluimos
  if (data) {
    if (Array.isArray(data)) {
      response.colaboradores = data;
    } else {
      response.data = data;
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Función para obtener estadísticas
 */
function getStats() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return { registros: 0, invitados: 0 };
    
    const data = sheet.getDataRange().getValues();
    const registros = data.length - 1; // Excluir header
    
    let totalInvitados = 0;
    for (let i = 1; i < data.length; i++) {
      totalInvitados += parseInt(data[i][5]) || 0; // Columna cantidad invitados (ahora columna 5)
    }
    
    return {
      registros: registros,
      invitados: totalInvitados
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { registros: 0, invitados: 0 };
  }
}
