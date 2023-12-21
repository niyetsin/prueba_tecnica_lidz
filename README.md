![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

# <Center> API de Gestión de clientes Lidz</Center>

Esta API proporciona una interfaz para la gestión de clientes, mensajes y deudas en el contexto de una empresa inmobiliaria.

## Requisitos

```bash
- Node.js v20.10.0
- npm v10.2.3
- SQLite v5.1.6
```
## Instalación

Para instalar y ejecutar esta API, sigue estos pasos:

```bash
1. git clone [URL del repositorio]

2. cd [Nombre del directorio del repositorio]

3. npm install

4. npm run dev
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
│ └── router.js


```

## Uso

Puedes utilizar tu herramienta de preferencia para hacer peticiones a la API. En este caso, se utilizó [Postman](https://www.postman.com/).

## Endpoints Disponibles

1. GET /clients : Obtiene información de todos los clientes
2. POST /clients : Agrega información de un nuevo cliente
3. GET /clients/:id : Obtiene información de un cliente específico dada un Id
4. GET /clients-to-do-follow-up : Obtiene información de los clientes que no han registrado mensajes los últimos 7 días
5. GET /clients/:id/score : Obtiene un **Score** de un cliente específico dada un Id
6. GET /clients/:id/complex-score : Obtiene un **Score** de un cliente específico dada un Id con un algoritmo más complejo

## Ejemplo

- Obtener la información de un cliente con id 3

```bash
curl --location --request GET http://localhost:3000/clients/3
```

## Algoritmo Score

Para poder obtener el **score** de un cliente se consideraron los siguientes criterios:

- El salario, con un factor de 0.000006
- El monto ahorrado, con un factor de 0.000003
- El monto en deuda, con un factor de 0.000003
- Morosidad:
    - Una penalización de morosidad de 15 si posee alguna deuda con mayor tiempo a 30 días desde la fecha actual
    - Una penalizacion de morosidad de 20 si posee alguna deuda con mayor tiempo a 60 días desde la fecha actual
- Mensajes:
    - Si el cliente posee más de 10 mensajes, su puntaje será aumentado por un factor de 0.8 puntos por mensaje
    - Si el cliente posee menos de 10 mensajes, su puntaje será aumentado por un factor de 0.3 puntos por mensaje

## Algoritmo Score Avanzado



## LICENSE

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
