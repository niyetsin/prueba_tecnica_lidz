# API de Gestión de clientes Lidz

Esta API proporciona una interfaz para la gestión de clientes, mensajes y deudas en el contexto de una empresa inmobiliaria.

## Instalación

Para instalar y ejecutar esta API, sigue estos pasos:

```bash
git clone [URL del repositorio]
cd [Nombre del directorio del repositorio]
npm install
```

## Uso

```bash
npm start
```

## Endpoints Disponibles

1. GET /api/clients : Obtiene información de todos los clientes
2. POST /api/clients : Agrega información de un nuevo cliente
3. GET /api/clients/:id : Obtiene información de un cliente específico dada un Id
4. GET /api/clients-to-do-follow-up : Obtiene información de los clientes que no han registrado mensajes los últimos 7 días
5. GET /api/clients/:id/score : Obtiene un **Score** de un cliente específico dada un Id

