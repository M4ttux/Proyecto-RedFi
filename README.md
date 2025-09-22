# 🌐 Red-Fi

**Red-Fi** es una plataforma integral para comparar y evaluar proveedores de internet, optimizada específicamente para la provincia de Corrientes, Argentina. La aplicación permite a los usuarios tomar decisiones informadas sobre su servicio de internet a través de un mapa interactivo, herramientas de diagnóstico, gestión de facturas y recursos educativos.

![Red-Fi Logo](Frontend/public/redfi-512.png)

## 🚀 Características Principales

### 🗺️ **Mapa Interactivo Geolocalizado**
- **Cobertura por zonas**: Visualización de proveedores disponibles por ubicación específica en Corrientes
- **Sistema de filtros avanzados**: Por zona, proveedor, tecnología (Fibra Óptica, ADSL, Cable, etc.) y valoración mínima
- **Reseñas geolocalizadas**: Los usuarios pueden leer y escribir reseñas específicas por zona

### 🛠️ **Herramientas de Red Inteligentes**
1. **Test de Velocidad**: Medición real de velocidad de descarga, subida y latencia
2. **Información de Red**: Detección automática de IP pública, ubicación y proveedor actual
3. **Análisis de Conexión por Zonas**: Simulación de análisis Wi-Fi domiciliario para identificar zonas de mejor/peor señal

### 📄 **Gestión Inteligente de Facturas**
- **Carga y almacenamiento**: Subida de facturas en formato PDF o imagen
- **Alertas automáticas**: Notificaciones antes del vencimiento
- **Análisis de aumentos**: Comparación mes a mes con alertas de variaciones de precio

### 🎓 **Academia Red-Fi**
- **Cursos interactivos**:
  - *Curso 1*: "Cómo solucionar problemas de internet"
  - *Curso 2*: "Cómo medir la velocidad de internet" 
  - *Curso 3*: "Cómo elegir tu proveedor de internet"
- **Evaluaciones**: Quiz al final de cada módulo
- **Videos educativos**: Contenido multimedia integrado

### 📚 **Glosario Técnico**
- **Integración con Wikipedia**: Definiciones actualizadas automáticamente
- **Síntesis de voz**: Función de lectura automática

### ⭐ **Sistema de Reseñas Verificadas**
- **Autenticación obligatoria**: Solo usuarios registrados pueden reseñar
- **Sistema de estrellas**: Valoración del 1 al 5
- **Verificación geográfica**: Las reseñas están vinculadas a ubicaciones específicas

## 🏗️ Arquitectura Técnica

### **Frontend**
- **Framework**: React 19.1 con hooks modernos
- **Build Tool**: Vite 6.3.5 para desarrollo rápido
- **Styling**: TailwindCSS 4.1.6 con sistema de temas (claro/oscuro)
- **Routing**: React Router DOM 7.6.0 con protección de rutas
- **Iconografía**: Tabler Icons para UI consistente
- **PWA**: Soporte para instalación como aplicación web

### **Backend & Base de Datos**
- **BaaS**: Supabase (PostgreSQL con RLS)
- **Autenticación**: Supabase Auth con gestión de sesiones
- **Storage**: Bucket de Supabase para archivos de facturas
- **Speed Test Server**: Node.js + Express para tests de velocidad

### **Mapas & Geolocalización**
- **Motor de mapas**: MapLibre GL para renderizado de alta performance
- **API de ubicación**: Integración con servicios de geolocalización
- **Validación geográfica**: Restricción a los límites de la provincia de Corrientes

## 🎨 Sistema de Design

### **Paleta de Colores**
- **Primarios**: Orange/Naranja para call-to-actions
- **Secundarios**: Grises neutros para backgrounds
- **Estados**: Verde (éxito), Rojo (error), Azul (información)

### **Componentes Reutilizables**
- Sistema de botones con variantes (primary, secondary, danger, etc.)
- Componentes de formulario con validación integrada
- Modales responsivos con animaciones
- Tablas con ordenamiento y filtrado
- Loaders y estados de carga

### **Responsive Design**
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navegación adaptativa**: Bottom navigation en móviles, sidebar en desktop

## 🔐 Sistema de Autenticación y Roles

### **Roles Administrativos**
- **Administrador**: Gestión completa de proveedores, zonas y usuarios
- **Usuario**: Funcionalidades estándar según su plan

## 🚦 Estados y Validaciones

### **Validación de Ubicación**
- Verificación automática de coordenadas dentro de Corrientes
- Mensajes informativos para usuarios fuera del área de cobertura

### **Validación de Formularios**
- Validación en tiempo real con feedback visual
- Mensajes de error contextuales

### **Gestión de Estados**
- Loading states para todas las operaciones asíncronas
- Error boundaries para manejo robusto de errores
- Context providers para estado global (Auth, Theme, Alerts, Roles)

## 🛡️ Seguridad

### **Row Level Security (RLS)**
- Políticas de acceso a nivel de base de datos
- Los usuarios solo pueden acceder a sus propios datos
- Validación de permisos en el backend

### **Validaciones**
- Sanitización de inputs del usuario
- Validación de tipos de archivo (facturas)
- Rate limiting para APIs críticas

## 📱 Progressive Web App (PWA)

- **Instalable**: Puede instalarse como app nativa
- **Offline-ready**: Funcionalidad básica sin conexión
- **Push notifications**: Para recordatorios de vencimiento de facturas
- **Iconos adaptativos**: Soporte para diferentes tamaños de pantalla

## 👥 Equipo de Desarrollo

### **Integrantes del Proyecto**
- **Matias Neto** - Full Stack Developer
- **Matias Martinez** - Full Stack Developer

*Proyecto desarrollado como parte del 4º cuatrimestre en la Escuela DaVinci*

---

**Red-Fi** - *Tu conexión perfecta te está esperando* 🌐✨
