# 🚀 Instrucciones para subir a GitHub

## ✅ Repositorio Git ya creado localmente

El repositorio local ya está listo con:
- ✅ Git inicializado
- ✅ Archivos agregados
- ✅ Commit inicial creado
- ✅ Rama principal configurada como 'main'

## 📋 Pasos para crear repositorio en GitHub

### 1. Crear repositorio en GitHub
1. Ir a [github.com](https://github.com)
2. Hacer clic en "New repository" (botón verde)
3. Configurar:
   - **Repository name**: `registro-eventos`
   - **Description**: `Sistema de registro de asistencia para eventos empresariales con Google Apps Script`
   - **Visibility**: Public (recomendado para GitHub Pages)
   - **NO marcar** "Initialize with README" (ya tenemos archivos)
4. Hacer clic en "Create repository"

### 2. Conectar repositorio local con GitHub
```bash
# Agregar remote (reemplaza USERNAME con tu usuario de GitHub)
git remote add origin https://github.com/USERNAME/registro-eventos.git

# Subir archivos
git push -u origin main
```

### 3. Activar GitHub Pages
1. En el repositorio de GitHub, ir a **Settings**
2. Scroll hacia abajo hasta **Pages**
3. Configurar:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
4. Hacer clic en **Save**

### 4. Acceder a la aplicación
Después de unos minutos, la aplicación estará disponible en:
```
https://USERNAME.github.io/registro-eventos/frontend/
```

## 🔧 Comandos completos para copiar

```bash
# 1. Agregar remote de GitHub (reemplaza USERNAME)
git remote add origin https://github.com/USERNAME/registro-eventos.git

# 2. Subir a GitHub
git push -u origin main

# 3. Verificar que se subió correctamente
git remote -v
```

## 📱 Después del despliegue

### Verificar que funciona:
1. **Abrir**: `https://USERNAME.github.io/registro-eventos/frontend/`
2. **Probar búsqueda**: Escribir un nombre
3. **Verificar backend**: Debe cargar colaboradores
4. **Probar registro**: Completar un registro de prueba

### Compartir con usuarios:
- **URL principal**: `https://USERNAME.github.io/registro-eventos/frontend/`
- **Documentación**: `https://USERNAME.github.io/registro-eventos/`
- **Guía rápida**: Compartir `docs/GUIA_RAPIDA.md`

## 🎯 Sistema listo para eventos

Una vez en GitHub Pages, el sistema estará disponible 24/7 para:
- ✅ Registro de asistencia
- ✅ Búsqueda inteligente
- ✅ Gestión de invitados
- ✅ Verificación automática

**¡El sistema está listo para usarse en eventos reales!** 🎉
