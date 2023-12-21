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

- Se considera un puntaje base de 15 puntos para considerar la posibilidad mínima de un cliente registrado, este puntaje irá variando según el resto de información que se tenga del cliente.
- El salario, con un factor de 0.000006
- El monto ahorrado, con un factor de 0.000003
- El monto en deuda, con un factor de 0.000003
- Morosidad:
    - Una penalización de morosidad de 15 si posee alguna deuda con mayor tiempo a 30 días desde la fecha actual
    - Una penalizacion de morosidad de 20 si posee alguna deuda con mayor tiempo a 60 días desde la fecha actual
- Mensajes:
    - Si el cliente posee más de 10 mensajes, su puntaje será aumentado por un factor de 0.8 puntos por mensaje
    - Si el cliente posee menos de 10 mensajes, su puntaje será aumentado por un factor de 0.3 puntos por mensaje

La respuesta utilizando este algoritmo es el siguiente:

```bash
{
    "score": 100
}
```

## Algoritmo Score Avanzado

Para este algoritmo se consideraron la implementación de dos nuevas tablas para la base de datos, ClientProperty y Property, las cuales se describen como lo siguiente:

- Property: Muestra la información de las propiedades disponibles, junto a su valor en UF y ubicación.

- ClientProperty: Muestra las propiedades que el cliente está interesado por comprar mediante el uso de las llaves clientId (Llave primaria de Client) y PropertyId (Llave primaria de tabla Property)

Esto se hizo con la finalidad de no solo considerar datos referentes al usuario sino, también relacionarlos a las propiedades que el cliente está interesado por adquirir. En donde el algoritmo toma en cuenta el valor de la propiedad en UF y realizar una comparación con el poder adquisitivo del cliente, considerando principalmente sus ahorros, debido a que podriamos considerar que el cliente quiere adquirir la propiedad mediante el uso de un crédito hipotecario, debe contar con al menos entre un 20% y 30% del valor total de la propiedad.

Es por esto que realizamos una comparacion de valor de la o las pripiedades que el cliente está interesado por adquirir y se realizar su comparación con su ahorro.

Finalmente lo que retorna este algoritmo es un listado con el score de las propiedades que está interesado y muestra algo como lo siguiente:

```bash
[
    {
        "PropietyId": 1,
        "score": 100
    }
]
```

## Posibles mejoras

Es posible mejorar la modularización de ciertos procesos como la obtención de datos de clientes por Id, así como también es posible seguir expandiendo esta API según las posibles necesidades que se requieran dentro de la empresa

Adicionalmente a la implementación de este nuevo algoritmo hay varias cosas que se pueden implementar para mejorar aún más la precision de este **score**, por ejemplo se puede agregar un algoritmo de machine learning para mejorar la precisión de este algoritmo. En base a los datos existentes. Ya que se pueden encontrar relaciones entre la variacion de potenciales clientes segun patrones de comportamiento, ya sean cantidad de mensajes enviados, ubicación de cliente vs ubicación de la propiedad. Así como también se pueden considerar otros antecedentes financieros con la finalidad de poder categorizar de mejor manera a los clientes morozos, dado que no solo hay un tipo de cliente moroso, etc...

## LICENSE

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
