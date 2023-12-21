![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

# <Center> API de Gestión de clientes Lidz</Center>

Esta API proporciona una interfaz para la gestión de clientes, mensajes y deudas en el contexto de una empresa inmobiliaria.

## Instalación

Para instalar y ejecutar esta API, sigue estos pasos:

```bash
git clone [URL del repositorio]
cd [Nombre del directorio del repositorio]
npm install
```
## Estructura del proyecto
```bash
src/
├── db/
│ ├── database.js
│ └── clientes.db
├── models/
│ ├── Client.js
│ ├── Message.js
│ └── Deudas.js
└── server/
│ └──index.js // Este es el archivo principal del servidor
├── routes/
│ └── index.js


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

## Ejemplo

- Obtener la información de un cliente con id 3

```bash
curl --location --request GET 'http://localhost:3000/api/clients/3'
```

## Algoritmo Score



## LICENSE

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
