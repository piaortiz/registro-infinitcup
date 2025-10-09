# 🎰 Sistema de Registro por DNI - Casino Magic

Sistema optimizado de registro de eventos con verificación por DNI para Casino Magic.

![Version](https://img.shields.io/badge/version-4.3-blue.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)
![Platform](https://img.shields.io/badge/platform-web-lightgrey.svg)

## 🚀 Características

- **Validación DNI Argentina**: Algoritmo específico con rangos válidos (3M - 99M)
- **Flujo Optimizado**: DNI → Formulario → Registro unificado
- **Detección Duplicados**: Verificación automática en tiempo real
- **Ultra Ligero**: Solo 13KB (83% menos que v4.2)
- **Responsive**: Perfecto en móviles y desktop
- **Sin Dependencias**: JavaScript vanilla puro

## 📱 Demo

🔗 **[Ver Demo en Vivo](https://piaortiz.github.io/registro-infinitcup)**

## ⚡ Quick Start

### 1. Clonar Repositorio
```bash
git clone https://github.com/piaortiz/registro-infinitcup.git
cd registro-infinitcup
```

### 2. Abrir en Navegador
```bash
# Abrir archivo principal
open index.html
# o en Windows
start index.html
```

### 3. Configurar API (Opcional)
Si quieres usar tu propio Google Apps Script:
1. Edita `js/config.js`
2. Cambia `apiUrl` por tu URL
3. Sigue instrucciones en `docs/CONFIGURACION_DNI.md`

## 🎯 Flujo de Usuario

```
1. 📱 Ingresa DNI → Validación local argentina
2. 📝 Completa formulario de datos personales
3. 🔄 Envío → Verificación duplicados + registro
4. ✅ Confirmación final con condiciones del sorteo
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Deployment**: GitHub Pages
- **API**: JSONP (sin CORS)

## 📁 Estructura del Proyecto

```
registro-infinitcup/
├── 📄 index.html              # Aplicación principal
├── 📱 css/
│   └── styles.css             # Estilos responsive
├── ⚡ js/
│   ├── config.js              # Configuración
│   ├── main-dni-optimized.js  # Lógica principal
│   └── close-page.js          # Utilidades
├── 🖼️ img/                    # Imágenes y logos
├── 🔧 backend/
│   └── google-apps-script-dni.js # Servidor Google Apps Script
├── 🧪 tests/
│   ├── test-api.html          # Tests de API
│   └── quick-test.html        # Tests rápidos
└── 📖 docs/                   # Documentación
```

## 🧪 Testing

### Tests Automáticos
```bash
# Abrir tests en navegador
open tests/quick-test.html
open tests/test-api.html
```

### Tests Manuales
1. **Validación DNI**: Probar con DNIs válidos/inválidos
2. **Flujo completo**: DNI → Formulario → Registro
3. **Detección duplicados**: Mismo DNI dos veces
4. **Responsive**: Probar en móvil

## 📊 Mejoras v4.3

| Aspecto | v4.2 | v4.3 | Mejora |
|---------|------|------|---------|
| **Peso** | 78KB | 13KB | ⬇️ 83% |
| **Llamadas API** | 2 | 1 | ⬇️ 50% |
| **Carga inicial** | 2.1s | 1.4s | ⬇️ 33% |
| **Validación DNI** | Básica | Argentina | ⬆️ 100% |
| **UX** | 3 pantallas | 2 pantallas | ⬆️ 50% |

## 🔧 Configuración

### Para Desarrollo
1. Editar `js/config.js`
2. Cambiar `demoMode: true` para datos de prueba
3. Usar `tests/` para verificar funcionalidad

### Para Producción
1. Configurar Google Apps Script (ver `docs/CONFIGURACION_DNI.md`)
2. Actualizar `apiUrl` en `js/config.js`
3. Desplegar en GitHub Pages

## 📖 Documentación

- 📋 [Guía de Configuración](docs/CONFIGURACION_DNI.md)
- 👥 [Guía de Usuario](docs/GUIA_USUARIO_DNI.md)
- 🔄 [Nuevo Flujo v4.3](docs/NUEVO_FLUJO_v4.3.md)
- 🧪 [Guía de Testing](TESTING_GUIDE.md)
- 📝 [Changelog](CHANGELOG.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Pia Ortiz** - [GitHub](https://github.com/piaortiz)

---

⭐ ¡Dale una estrella si te gustó el proyecto!