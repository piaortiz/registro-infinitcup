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
          colaboradorAsiste: e.parameter.colaboradorAsiste === 'SI',
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
      
      // Verificar si está marcado como YaRegistrado en la hoja de colaboradores
      let yaRegistradoEnHoja = false;
      try {
        const colaboradoresSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(COLABORADORES_SHEET);
        if (colaboradoresSheet) {
          const data = colaboradoresSheet.getDataRange().getValues();
          const headers = data[0];
          
          // Encontrar el índice de la columna YaRegistrado
          let yaRegistradoIndex = -1;
          for (let i = 0; i < headers.length; i++) {
            if (headers[i] === 'YaRegistrado') {
              yaRegistradoIndex = i;
              break;
            }
          }
          
          // Si existe la columna YaRegistrado, verificar
          if (yaRegistradoIndex >= 0) {
            // Buscar el legajo y verificar su estado
            for (let i = 1; i < data.length; i++) {
              if (data[i][0].toString() === e.parameter.legajo.toString() && data[i][yaRegistradoIndex] === 'SI') {
                yaRegistradoEnHoja = true;
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error verificando YaRegistrado en hoja:', error);
      }
      
      const result = {
        registered: isRegistered,
        yaRegistradoEnHoja: yaRegistradoEnHoja,
        legajo: e.parameter.legajo,
        timestamp: new Date().toISOString(),
        message: isRegistered ? 'El colaborador ya está registrado para este evento' : 'El colaborador no está registrado'
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
      const callback = e.parameter.callback;
      
      const registroSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      if (!registroSheet) {
        const result = {
          found: false,
          collaboratorId: collaboratorId,
          error: 'Hoja de registros no encontrada',
          timestamp: new Date().toISOString()
        };
        
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
      
      // Buscar el registro específico en el nuevo formato
      // Columnas: [0]Timestamp, [1]Legajo, [2]NombreCompleto, [3]Confirmado, [4]InvitadoNombre, [5]InvitadoVinculo
      const found = registros.some(row => 
        row[1] == collaboratorId // Buscar en columna Legajo
      );
      
      const result = {
        found: found,
        collaboratorId: collaboratorId,
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
    
    // Obtener índice de la columna YaRegistrado (si existe)
    let yaRegistradoIndex = -1;
    const headers = data[0];
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'YaRegistrado') {
        yaRegistradoIndex = i;
        break;
      }
    }
    
    // Convertir datos a formato JSON (omitir la primera fila que son headers)
    const colaboradores = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && row[1]) { // Verificar que tenga legajo y nombre
        const colaborador = {
          legajo: row[0].toString(),
          nombreCompleto: row[1].toString()
        };
        
        // Agregar estado de registro si existe la columna
        if (yaRegistradoIndex >= 0) {
          colaborador.yaRegistrado = (row[yaRegistradoIndex] === 'SI');
        }
        
        colaboradores.push(colaborador);
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
    // Primero verificamos en la hoja de registros
    const registrosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // Si la hoja de registros existe, verificamos ahí
    if (registrosSheet) {
      const registrosData = registrosSheet.getDataRange().getValues();
      
      // Buscar en la columna de legajos (ahora columna 1, índice 1)
      for (let i = 1; i < registrosData.length; i++) {
        if (registrosData[i][1].toString() === legajo.toString()) {
          return true;
        }
      }
    } else {
      // Si la hoja no existe, la creamos
      createRegistrationSheet();
    }
    
    // Verificar también en la columna YaRegistrado de la hoja de colaboradores
    const colaboradoresSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(COLABORADORES_SHEET);
    if (colaboradoresSheet) {
      const data = colaboradoresSheet.getDataRange().getValues();
      const headers = data[0];
      
      // Encontrar el índice de la columna YaRegistrado
      let yaRegistradoIndex = -1;
      for (let i = 0; i < headers.length; i++) {
        if (headers[i] === 'YaRegistrado') {
          yaRegistradoIndex = i;
          break;
        }
      }
      
      // Si existe la columna YaRegistrado, verificar
      if (yaRegistradoIndex >= 0) {
        // Buscar el legajo y verificar su estado
        for (let i = 1; i < data.length; i++) {
          if (data[i][0].toString() === legajo.toString() && data[i][yaRegistradoIndex] === 'SI') {
            return true;
          }
        }
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
    
    // Preparar timestamp
    const timestamp = new Date();
    
    // Registrar al colaborador principal solo si va a asistir
    if (data.colaboradorAsiste) {
      const mainRowData = [
        timestamp,                    // Timestamp
        data.legajo,                 // Legajo
        data.nombreCompleto,         // NombreCompleto
        'Sí',                        // Confirmado
        data.nombreCompleto,         // InvitadoNombre (nombre del colaborador para sorteo)
        'Colaborador',               // InvitadoVinculo (identificar que es el colaborador)
        null                         // InvitadoEdad (null para el colaborador)
      ];
      
      console.log('📝 Insertando fila del colaborador:', mainRowData);
      sheet.appendRow(mainRowData);
    } else {
      console.log('ℹ️ El colaborador no asistirá personalmente, solo se registrarán sus invitados');
    }
    
    // FILAS ADICIONALES: Una fila por cada invitado
    if (data.invitados && data.invitados.length > 0) {
      console.log('👥 Guardando invitados, cantidad:', data.invitados.length);
      
      data.invitados.forEach((invitado, index) => {
        const guestRowData = [
          timestamp,                 // Timestamp
          data.legajo,              // Legajo (mismo que el colaborador)
          data.nombreCompleto,      // NombreCompleto (mismo que el colaborador)
          'Sí',                     // Confirmado
          invitado.nombre,          // InvitadoNombre
          invitado.vinculo,         // InvitadoVinculo
          invitado.edad             // InvitadoEdad
        ];
        
        console.log(`📝 Insertando fila del invitado ${index + 1}:`, guestRowData);
        sheet.appendRow(guestRowData);
      });
    }
    
    // Actualizar estado del colaborador a YaRegistrado = SI
    console.log('📝 Actualizando estado a YaRegistrado = SI');
    updateColaboradorRegistrado(data.legajo);
    
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
    
    // Configurar headers según el formato requerido
    const headers = [
      'Timestamp',
      'Legajo',
      'NombreCompleto',
      'Confirmado',
      'InvitadoNombre',
      'InvitadoVinculo',
      'InvitadoEdad'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Formato de headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Ajustar anchos de columnas
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 80);  // Legajo
    sheet.setColumnWidth(3, 200); // NombreCompleto
    sheet.setColumnWidth(4, 100); // Confirmado
    sheet.setColumnWidth(5, 150); // InvitadoNombre
    sheet.setColumnWidth(6, 120); // InvitadoVinculo
    sheet.setColumnWidth(7, 80);  // InvitadoEdad
    
    return sheet;
    
  } catch (error) {
    console.error('Error creando hoja de registros:', error);
    throw error;
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
    
    // Contar colaboradores únicos y total de invitados
    const colaboradoresUnicos = new Set();
    let totalInvitados = 0;
    
    for (let i = 1; i < data.length; i++) {
      const legajo = data[i][1]; // Columna Legajo
      const invitadoNombre = data[i][4]; // Columna InvitadoNombre
      
      // Agregar colaborador único
      colaboradoresUnicos.add(legajo);
      
      // Contar invitados (filas que tienen nombre de invitado)
      if (invitadoNombre && invitadoNombre.trim() !== '') {
        totalInvitados++;
      }
    }
    
    return {
      registros: colaboradoresUnicos.size,
      invitados: totalInvitados
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { registros: 0, invitados: 0 };
  }
}

/**
 * Actualiza el estado de un colaborador a YaRegistrado = SI
 */
function updateColaboradorRegistrado(legajo) {
  try {
    console.log('🔄 Actualizando estado del colaborador:', legajo);
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(COLABORADORES_SHEET);
    if (!sheet) {
      throw new Error(`La hoja '${COLABORADORES_SHEET}' no existe`);
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Buscar índice de la columna YaRegistrado
    let yaRegistradoIndex = -1;
    const headers = data[0];
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'YaRegistrado') {
        yaRegistradoIndex = i;
        break;
      }
    }
    
    // Si no existe la columna YaRegistrado, la creamos
    if (yaRegistradoIndex === -1) {
      console.log('📝 Creando columna YaRegistrado');
      yaRegistradoIndex = headers.length;
      sheet.getRange(1, yaRegistradoIndex + 1).setValue('YaRegistrado');
      
      // Dar formato al header
      const headerCell = sheet.getRange(1, yaRegistradoIndex + 1);
      headerCell.setFontWeight('bold');
      headerCell.setBackground('#4285f4');
      headerCell.setFontColor('white');
    }
    
    // Buscar la fila del colaborador por legajo
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === legajo.toString()) {
        rowIndex = i + 1; // +1 porque el índice en la hoja empieza en 1
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.warn('⚠️ No se encontró el colaborador con legajo:', legajo);
      return false;
    }
    
    // Actualizar el valor a "SI"
    console.log(`📝 Marcando colaborador en fila ${rowIndex} como YaRegistrado = SI`);
    sheet.getRange(rowIndex, yaRegistradoIndex + 1).setValue('SI');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error actualizando estado del colaborador:', error);
    return false;
  }
}
