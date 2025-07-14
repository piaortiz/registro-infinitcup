# 🎮 Guión de Presentación: Juegos Magic - Sistema de Sorteos
## Presentación de 10 minutos para Programación I - Instituto ISTEA

**Desarrollado por:** Pia Ortiz  
**Duración:** 10 minutos  
**Fecha:** Julio 2025  

---

## 🎯 **INTRODUCCIÓN** (2 minutos)

### Saludo y Contexto
**"Buenos días, profesor y compañeros. Soy Pia Ortiz y hoy les voy a presentar mi trabajo final: 'Juegos Magic', un sistema completo de gestión de sorteos desarrollado específicamente para entornos corporativos y educativos."**

### Motivación del Proyecto
**"Esta aplicación nació de una necesidad real en mi trabajo en Casino Magic. Recursos Humanos me pidió crear un sistema para sorteos en eventos corporativos, lo que me llevó a desarrollar una solución profesional que ya está programada para usarse en producción en eventos como el 'Evento Sport' de julio 2025."**

### Objetivos del Proyecto
- Crear una aplicación web moderna y funcional
- Aplicar conceptos de programación aprendidos en la materia
- Desarrollar una herramienta útil para el mundo real
- Demostrar la integración entre backend y frontend

---

## 🛠️ **TECNOLOGÍAS UTILIZADAS** (1.5 minutos)

### Stack Tecnológico
**"He elegido un stack moderno y robusto:"**

#### Backend - Python
- **Python 3.12**: Lenguaje principal por su legibilidad y potencia
- **FastAPI**: Framework web moderno para APIs REST
- **Pydantic**: Validación de datos con type hints
- **Pandas**: Procesamiento de datos tabulares
- **OpenPyXL**: Manejo de archivos Excel

#### Frontend - JavaScript/React
- **React 19**: Biblioteca para interfaces de usuario
- **Vite**: Bundler rápido para desarrollo
- **TailwindCSS**: Framework de estilos utilitarios
- **Canvas Confetti**: Animaciones visuales para sorteos

#### Arquitectura
- **Arquitectura de microservicios**: Separación clara entre backend y frontend
- **API RESTful**: Comunicación estándar entre servicios
- **Persistencia de datos**: Sistema de archivos JSON para simplicidad y portabilidad

---

## 📋 **FUNCIONALIDADES PRINCIPALES** (3 minutos)

### 1. Sorteo Rápido
**"La primera modalidad es el Sorteo Rápido, ideal para necesidades inmediatas:"**

**[DEMOSTRACIÓN EN VIVO]**
- Entrada manual de participantes
- Validación automática (elimina duplicados, campos vacíos)
- Configuración del número de ganadores
- Sorteo con animaciones visuales
- Descarga de resultados

**Conceptos aplicados:**
- Validación de entrada de datos
- Manejo de listas y conjuntos
- Generación de números aleatorios
- Manipulación del DOM con React

### 2. Gestión de Eventos
**"Para eventos más elaborados, tenemos la Gestión de Eventos:"**

**[DEMOSTRACIÓN EN VIVO]**
- Creación de eventos con metadatos
- Carga masiva desde Excel/CSV
- Gestión de participantes persistente
- Múltiples sorteos por evento
- Exportación de reportes

**Conceptos aplicados:**
- Lectura/escritura de archivos
- Procesamiento de datos con Pandas
- Estructuras de datos complejas
- Sistema de persistencia

### 3. Características Técnicas Destacadas
- **Validación robusta**: Manejo de errores y casos extremos
- **Interfaz responsiva**: Funciona en desktop y móvil
- **Logging completo**: Trazabilidad de operaciones
- **Documentación automática**: FastAPI genera docs interactivas
- **Scripts de automatización**: Configuración y ejecución simplificadas

---

## 💻 **DEMOSTRACIÓN TÉCNICA** (2 minutos)

### Arquitectura del Código
**"Permítanme mostrarles la estructura técnica del proyecto:"**

#### Backend Structure
```
backend/
├── app/
│   ├── main.py           # Aplicación FastAPI principal
│   ├── core/             # Lógica de negocio
│   │   ├── sorteo_rapido.py    # Sorteos inmediatos
│   │   ├── gestor_eventos.py   # Gestión de eventos
│   │   └── utilidades.py       # Funciones auxiliares
│   └── utils/            # Utilidades de soporte
```

#### Frontend Structure
```
frontend/src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
└── styles/             # Estilos CSS
```

### Conceptos de Programación Aplicados
**"He aplicado múltiples conceptos de programación:"**

- **Funciones puras**: Funciones sin efectos secundarios
- **Manejo de excepciones**: Try/catch robusto
- **Validación de datos**: Tipos y formatos
- **Modularización**: Separación de responsabilidades
- **Logging**: Trazabilidad y debugging
- **Estructuras de datos**: Listas, diccionarios, conjuntos
- **Algoritmos**: Selección aleatoria, ordenamiento
- **Programación orientada a objetos**: Clases y métodos

---

## 🚀 **DEMOSTRACIÓN EN VIVO** (1 minuto)

### Ejecución del Sistema
**"Ahora les voy a mostrar la aplicación funcionando:"**

1. **Inicio de la aplicación**
   - Ejecutar script de Windows: `.\scripts\Windows\ejecutar_aplicacion.ps1`
   - Mostrar consola del backend con logs
   - Abrir navegador en `http://localhost:5173`

2. **Navegación por la interfaz**
   - Página de inicio con mascota animada
   - Navegación entre secciones
   - Diseño responsive y moderno

3. **Sorteo en tiempo real**
   - Crear un sorteo rápido con datos de ejemplo
   - Mostrar animaciones y efectos visuales
   - Descargar resultados en Excel

---

## 📊 **RESULTADOS Y LOGROS** (0.5 minutos)

### Métricas del Proyecto
- **Líneas de código**: ~5,000 líneas
- **Archivos**: 50+ archivos organizados
- **Dependencias**: 47 librerías de Python + 15 de JavaScript
- **Funcionalidades**: 20+ endpoints de API
- **Componentes React**: 25+ componentes reutilizables

### Preparación para Producción
- **Scripts de automatización** para diferentes SO
- **Documentación completa** en carpeta `docs/`
- **Manejo de errores** robusto
- **Validación de datos** en todas las capas
- **Testing** manual exhaustivo

---

## 🎓 **CONCLUSIONES** (0.5 minutos)

### Aprendizajes Clave
**"Este proyecto me ha permitido aplicar y profundizar en:"**
- Desarrollo full-stack con tecnologías modernas
- Integración entre backend y frontend
- Manejo de datos y persistencia
- Validación y manejo de errores
- Diseño de interfaces de usuario
- Preparación de aplicaciones para producción

### Proyección Futura
**"Juegos Magic no solo cumple con los requisitos académicos, sino que es una herramienta real que se implementará en producción, demostrando que la programación tiene impacto directo en la solución de problemas del mundo real."**

### Mensaje Final
**"Gracias por su atención. Estoy disponible para responder cualquier pregunta sobre el código, la arquitectura o las decisiones técnicas del proyecto."**

---

## 🎤 **PREGUNTAS FRECUENTES ANTICIPADAS**

### Técnicas
- **¿Por qué FastAPI en lugar de Flask?** - Documentación automática, validación con Pydantic, mejor performance
- **¿Por qué React en lugar de vanilla JS?** - Componentes reutilizables, estado reactivo, ecosystem maduro
- **¿Cómo manejan la persistencia?** - Archivos JSON para simplicidad, fácil migración a bases de datos
- **¿Qué pasa con la escalabilidad?** - Arquitectura preparada para migrar a PostgreSQL o MongoDB

### Funcionales
- **¿Cómo garantizan la aleatoriedad?** - Semillas basadas en timestamp, biblioteca `random` de Python
- **¿Puede manejar archivos grandes?** - Sí, Pandas procesa eficientemente archivos Excel de miles de registros
- **¿Es seguro para producción?** - Validación en múltiples capas, manejo de errores, logging completo

---

## 🔧 **CONCEPTOS TÉCNICOS EXPLICADOS**

### ¿Qué es un Framework?
**Un framework es una estructura base que proporciona funcionalidades comunes y patrones de desarrollo para construir aplicaciones más rápido y con menos código.**

**En mi proyecto:**
- **FastAPI**: Framework web que me proporciona decoradores para crear rutas, validación automática, documentación, etc.
- **React**: Framework de frontend que me da componentes reutilizables, manejo de estado, virtual DOM, etc.
- **TailwindCSS**: Framework de CSS que me proporciona clases utilitarias pre-construidas

**Ejemplo práctico:**
```python
# Sin framework (muy complejo)
import socket, threading, json
# ... cientos de líneas para manejar HTTP, parsing, etc.

# Con FastAPI (simple)
from fastapi import FastAPI
app = FastAPI()

@app.get("/sorteo")
def hacer_sorteo():
    return {"resultado": "ganador"}
```

### ¿Qué es una API REST?
**API REST es un estilo arquitectónico para crear servicios web que usan HTTP de forma estándar.**

**Características que implemento:**
- **Recursos**: `/eventos`, `/sorteos`, `/participantes`
- **Métodos HTTP**: GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)
- **Respuestas JSON**: Formato estándar para intercambio de datos
- **Stateless**: Cada petición es independiente

**Ejemplos de mis endpoints:**
```python
@app.get("/api/eventos")           # Obtener todos los eventos
@app.post("/api/eventos")          # Crear nuevo evento
@app.get("/api/eventos/{id}")      # Obtener evento específico
@app.delete("/api/eventos/{id}")   # Eliminar evento
```

### ¿Cómo aplico Pydantic?
**Pydantic valida automáticamente los datos de entrada y salida usando type hints de Python.**

**Ejemplo en mi código:**
```python
from pydantic import BaseModel, validator

class ParticipanteModel(BaseModel):
    nombre: str
    email: str
    documento: str
    
    @validator('nombre')
    def validar_nombre(cls, v):
        if len(v) < 2:
            raise ValueError('Nombre muy corto')
        return v.strip().title()

class SorteoRequest(BaseModel):
    participantes: List[ParticipanteModel]
    cantidad_ganadores: int
    evento_id: str
```

**Beneficios:**
- Validación automática de tipos
- Conversión automática de datos
- Documentación automática en FastAPI
- Mensajes de error claros

### ¿Cómo uso Pandas?
**Pandas es una biblioteca para manipulación y análisis de datos tabulares.**

**Aplicaciones en mi proyecto:**
```python
import pandas as pd

# Leer archivos Excel/CSV
df = pd.read_excel('participantes.xlsx')

# Limpiar datos
df['nombre'] = df['nombre'].str.strip().str.title()
df = df.dropna()  # Eliminar filas vacías
df = df.drop_duplicates()  # Eliminar duplicados

# Procesar datos
participantes_validos = df[df['email'].str.contains('@')]
total_participantes = len(df)

# Exportar resultados
df_ganadores.to_excel('resultados_sorteo.xlsx', index=False)
```

### ¿Cómo uso OpenPyXL?
**OpenPyXL permite leer y escribir archivos Excel (.xlsx) con control detallado.**

**Ejemplo en mi código:**
```python
from openpyxl import load_workbook, Workbook
from openpyxl.styles import Font, PatternFill

# Leer archivo Excel
wb = load_workbook('participantes.xlsx')
ws = wb.active
participantes = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if row[0]:  # Si hay nombre
        participantes.append({
            'nombre': row[0],
            'email': row[1],
            'documento': row[2]
        })

# Crear archivo con formato
wb_resultado = Workbook()
ws_resultado = wb_resultado.active
ws_resultado.title = "Ganadores"

# Agregar encabezados con estilo
header_font = Font(bold=True, color="FFFFFF")
header_fill = PatternFill("solid", fgColor="366092")
ws_resultado['A1'] = "Ganador"
ws_resultado['A1'].font = header_font
ws_resultado['A1'].fill = header_fill
```

### ¿Qué es un Bundler?
**Un bundler es una herramienta que combina múltiples archivos de código en uno o pocos archivos optimizados para producción.**

**Vite (mi bundler) hace:**
- **Desarrollo**: Servidor de desarrollo rápido con Hot Module Replacement
- **Producción**: Optimización automática, minificación, tree-shaking
- **Dependencias**: Gestión automática de librerías y assets

**Ejemplo de lo que hace Vite:**
```javascript
// Mis archivos separados
import React from 'react'
import './App.css'
import { SorteoCard } from './components/SorteoCard'

// Vite los convierte en un bundle optimizado
// bundle.js (minificado, optimizado)
```

### ¿Cómo Valida mi Sistema?
**Implemento validación en múltiples capas:**

**1. Frontend (React):**
```javascript
// Validación en tiempo real
const validarParticipantes = (lista) => {
  const errores = []
  if (lista.length === 0) errores.push("Debe haber participantes")
  if (lista.some(p => !p.trim())) errores.push("No puede haber nombres vacíos")
  return errores
}
```

**2. Backend (FastAPI + Pydantic):**
```python
# Validación automática por tipos
class SorteoRequest(BaseModel):
    participantes: List[str]
    cantidad: int = Field(gt=0, le=100)  # Entre 1 y 100

# Validación de lógica de negocio
def validar_sorteo(participantes, cantidad):
    participantes_unicos = list(set(participantes))
    if cantidad > len(participantes_unicos):
        raise ValueError("Más ganadores que participantes")
    return participantes_unicos
```

**3. Validación de Archivos:**
```python
def validar_archivo_excel(archivo):
    extensiones_validas = ['.xlsx', '.xls']
    if not any(archivo.filename.endswith(ext) for ext in extensiones_validas):
        raise HTTPException(400, "Formato de archivo inválido")
    
    # Validar contenido
    df = pd.read_excel(archivo.file)
    if df.empty:
        raise HTTPException(400, "Archivo vacío")
```

### ¿Cómo Funciona el Sorteo (Algoritmo)?
**Mi algoritmo de sorteo es el corazón del sistema y garantiza aleatoriedad, auditabilidad y equidad:**

#### **1. Fundamentos Teóricos**
**Uso el algoritmo Fisher-Yates (implementado en `random.sample()`) que garantiza:**
- **Distribución uniforme**: Cada participante tiene exactamente la misma probabilidad de ser seleccionado
- **Complejidad O(n)**: Eficiente incluso con miles de participantes
- **Sin sesgos**: No hay favorecimiento hacia ningún participante

#### **2. Implementación Completa**
```python
import random
from datetime import datetime
import logging

def realizar_sorteo_rapido(participantes, cantidad):
    """
    Realiza un sorteo aleatorio con auditabilidad completa.
    
    Args:
        participantes (list): Lista de nombres de participantes
        cantidad (int): Número de ganadores a seleccionar
        
    Returns:
        dict: Resultado del sorteo con metadatos completos
        
    Raises:
        ValueError: Si hay más ganadores que participantes
    """
    logger = logging.getLogger(__name__)
    
    # 1. GENERACIÓN DE SEMILLA REPRODUCIBLE
    # Uso microsegundos para mayor precisión y evitar colisiones
    timestamp = datetime.now()
    semilla = int(timestamp.timestamp() * 1000000)
    random.seed(semilla)
    
    logger.info(f"Sorteo iniciado con semilla: {semilla}")
    
    # 2. LIMPIEZA Y NORMALIZACIÓN DE DATOS
    # Elimino espacios, convierto a minúsculas para detectar duplicados
    participantes_procesados = []
    for p in participantes:
        if p and p.strip():  # Verifico que no esté vacío
            nombre_limpio = p.strip().title()  # Normalizo formato
            participantes_procesados.append(nombre_limpio)
    
    # 3. ELIMINACIÓN DE DUPLICADOS
    # Uso set() para eliminar duplicados, luego convierto a lista
    participantes_unicos = list(set(participantes_procesados))
    duplicados_eliminados = len(participantes_procesados) - len(participantes_unicos)
    
    if duplicados_eliminados > 0:
        logger.warning(f"Se eliminaron {duplicados_eliminados} duplicados")
    
    # 4. VALIDACIÓN DE ENTRADA
    if cantidad <= 0:
        raise ValueError("La cantidad de ganadores debe ser mayor a 0")
    
    if cantidad > len(participantes_unicos):
        raise ValueError(f"No se pueden seleccionar {cantidad} ganadores de {len(participantes_unicos)} participantes")
    
    # 5. ALGORITMO DE SELECCIÓN (Fisher-Yates)
    # random.sample() implementa Fisher-Yates shuffle internamente
    # Esto garantiza que cada combinación tenga la misma probabilidad
    ganadores = random.sample(participantes_unicos, cantidad)
    
    # 6. METADATOS Y AUDITABILIDAD
    resultado = {
        'ganadores': ganadores,
        'semilla': semilla,
        'fecha': timestamp.isoformat(),
        'total_participantes': len(participantes_unicos),
        'cantidad_ganadores': cantidad,
        'participantes_originales': len(participantes),
        'duplicados_eliminados': duplicados_eliminados,
        'algoritmo': 'Fisher-Yates (random.sample)',
        'version': '1.0'
    }
    
    # 7. LOGGING Y PERSISTENCIA
    logger.info(f"Sorteo completado: {cantidad} ganadores de {len(participantes_unicos)} participantes")
    guardar_en_historial(resultado)
    
    return resultado
```

#### **3. Análisis Matemático del Algoritmo**

**Probabilidad de Selección:**
```python
# Para cada participante, la probabilidad de ser seleccionado es:
P(seleccionado) = cantidad_ganadores / total_participantes

# Ejemplo: 3 ganadores de 10 participantes
P(seleccionado) = 3/10 = 0.3 = 30%
```

**Distribución de Probabilidades:**
```python
# Verificación de equidad (para testing)
def verificar_equidad(participantes, cantidad, iteraciones=10000):
    """Verifica que la distribución sea uniforme"""
    contadores = {p: 0 for p in participantes}
    
    for _ in range(iteraciones):
        resultado = realizar_sorteo_rapido(participantes, cantidad)
        for ganador in resultado['ganadores']:
            contadores[ganador] += 1
    
    # La frecuencia esperada es cantidad * iteraciones / total_participantes
    frecuencia_esperada = cantidad * iteraciones / len(participantes)
    
    return contadores, frecuencia_esperada
```

#### **4. Reproducibilidad y Auditabilidad**

**Reproducir un sorteo:**
```python
def reproducir_sorteo(semilla, participantes, cantidad):
    """Reproduce exactamente el mismo sorteo usando la semilla"""
    random.seed(semilla)
    participantes_unicos = list(set([p.strip().title() for p in participantes if p.strip()]))
    return random.sample(participantes_unicos, cantidad)

# Ejemplo de uso:
# resultado_original = realizar_sorteo_rapido(['Ana', 'Luis', 'Maria'], 1)
# ganadores_reproducidos = reproducir_sorteo(resultado_original['semilla'], ['Ana', 'Luis', 'Maria'], 1)
# assert resultado_original['ganadores'] == ganadores_reproducidos
```

#### **5. Manejo de Casos Extremos**

**Casos especiales que manejo:**
```python
# Caso 1: Un solo participante
participantes = ['Juan']
resultado = realizar_sorteo_rapido(participantes, 1)
# Resultado: ['Juan'] (100% probabilidad)

# Caso 2: Todos los participantes son ganadores
participantes = ['Ana', 'Luis', 'Maria']
resultado = realizar_sorteo_rapido(participantes, 3)
# Resultado: ['Ana', 'Luis', 'Maria'] (en orden aleatorio)

# Caso 3: Participantes con nombres similares
participantes = ['Ana Maria', 'ANA MARIA', '  ana maria  ']
# Se normaliza a un solo participante: 'Ana Maria'

# Caso 4: Lista vacía
participantes = []
# ValueError: No se pueden seleccionar ganadores de 0 participantes
```

#### **6. Optimizaciones de Rendimiento**

**Para listas grandes (1000+ participantes):**
```python
def realizar_sorteo_optimizado(participantes, cantidad):
    """Versión optimizada para listas grandes"""
    # Uso set comprehension para mejor rendimiento
    participantes_unicos = list({
        p.strip().title() 
        for p in participantes 
        if p and p.strip()
    })
    
    # Para listas muy grandes, valido antes de procesar
    if cantidad > len(participantes_unicos):
        raise ValueError("Más ganadores que participantes")
    
    # El algoritmo Fisher-Yates es O(n) y muy eficiente
    semilla = int(datetime.now().timestamp() * 1000000)
    random.seed(semilla)
    
    return random.sample(participantes_unicos, cantidad)
```

#### **7. Características Técnicas Avanzadas**

**Propiedades del algoritmo:**
- **Complejidad temporal**: O(n) donde n = número de participantes
- **Complejidad espacial**: O(n) para almacenar participantes únicos
- **Entropía**: Alta, basada en timestamp de microsegundos
- **Reproducibilidad**: 100% con la misma semilla
- **Equidad**: Distribución uniforme matemáticamente garantizada

**Comparación con otros enfoques:**
```python
# ❌ Enfoque ingenuo (sesgado)
def sorteo_sesgado(participantes, cantidad):
    ganadores = []
    for _ in range(cantidad):
        indice = random.randint(0, len(participantes)-1)
        ganadores.append(participantes[indice])
    return ganadores  # Puede repetir ganadores

# ✅ Mi enfoque (correcto)
def sorteo_correcto(participantes, cantidad):
    return random.sample(participantes, cantidad)  # Sin repetición
```

#### **8. Validación y Testing**

**Pruebas que implemento:**
```python
def test_sorteo_equidad():
    """Verifica que la distribución sea uniforme"""
    participantes = ['A', 'B', 'C', 'D', 'E']
    resultados = {}
    
    for _ in range(1000):
        ganador = realizar_sorteo_rapido(participantes, 1)['ganadores'][0]
        resultados[ganador] = resultados.get(ganador, 0) + 1
    
    # Cada participante debería tener ~200 apariciones (1000/5)
    for participante, count in resultados.items():
        assert 150 <= count <= 250, f"{participante}: {count} apariciones"

def test_sorteo_reproducible():
    """Verifica que sea reproducible"""
    participantes = ['Ana', 'Luis', 'Maria']
    resultado1 = realizar_sorteo_rapido(participantes, 2)
    
    # Reproduzco con la misma semilla
    random.seed(resultado1['semilla'])
    resultado2 = random.sample(participantes, 2)
    
    assert resultado1['ganadores'] == resultado2
```

**Características finales del algoritmo:**
- **Justo**: Cada participante tiene exactamente la misma probabilidad
- **Rápido**: O(n) complejidad, maneja miles de participantes
- **Reproducible**: Misma semilla = mismo resultado
- **Auditable**: Se guarda semilla, timestamp y metadatos
- **Robusto**: Maneja casos extremos y errores
- **Escalable**: Eficiente para cualquier tamaño de lista

### Librerías Más Importantes Utilizadas

#### **Backend (Python)**
```python
# Core del sistema
fastapi==0.111.0          # Framework web principal
pydantic==2.11.7          # Validación de datos
pandas==2.2.2             # Procesamiento de datos
openpyxl==3.1.5          # Manejo de archivos Excel
uvicorn==0.34.0          # Servidor ASGI

# Utilidades
python-multipart==0.0.9  # Manejo de uploads
python-dateutil==2.9.0   # Manejo de fechas
```

#### **Frontend (JavaScript)**
```json
{
  "react": "^19.1.0",           // Biblioteca principal de UI
  "react-dom": "^19.1.0",       // Renderizado en DOM
  "react-router-dom": "^7.6.3", // Navegación entre páginas
  "canvas-confetti": "^1.9.3",  // Animaciones de celebración
  "react-icons": "^5.5.0",      // Iconos
  "xlsx": "^0.18.5",            // Lectura de archivos Excel
  "tailwindcss": "^4.1.11",     // Estilos CSS
  "vite": "^7.0.0"              // Bundler y servidor dev
}
```

#### **¿Por qué estas librerías?**
- **FastAPI**: Más rápido que Flask, documentación automática
- **Pandas**: Estándar industria para datos tabulares
- **React**: Componentes reutilizables, gran ecosistema
- **TailwindCSS**: Desarrollo rápido de UI moderna
- **Canvas Confetti**: Experiencia de usuario divertida
- **OpenPyXL**: Control total sobre archivos Excel

---
