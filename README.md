# 🏨 Hotel Lindo Sueño

<div align="center">

![Status](https://img.shields.io/badge/Status-En%20Producción-success?style=for-the-badge)

[🌐 Demo en Vivo](https://witty-flower-0ef1c3b10.6.azurestaticapps.net)

</div>

## 📋 ¿Qué es?

Sistema de reservas de hotel desarrollado con **Django**, **Next.js** y **PostgreSQL**.

## 🛠️ Tecnologías

- **Frontend:** Next.js
- **Backend:** Django  
- **Base de Datos:** PostgreSQL

## 🚀 Instalación

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

```bash
# Backend
python manage.py test
coverage run --source='.' manage.py test

# Frontend
npm test
npm run test:coverage
```

**Cobertura actual: 94%** ✅

## 📁 Estructura

```
📂 backend/          # API Django
📂 frontend/         # App Next.js  
📂 .github/         # CI/CD
```

## 👥 Desarrolladores

**Diego Cerón** y **Javier Ordóñez**

---

<div align="center">

**⭐ ¡Dale una estrella si te gusta el proyecto! ⭐**

</div>
