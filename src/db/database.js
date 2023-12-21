const sqlite3 = require('sqlite3').verbose();

// Conexión con la base de datos
let db = new sqlite3.Database('./src/db/clientes.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos');
});

//Inicialización de la base de datos, creacion de tablas y población de datos
async function inicializarBaseDeDatos() {
    try {
        await crearTablas();
        await insertarDatosDePrueba();
    } catch (err) {
        console.error("Error al inicializar la base de datos: ", err);
    }
}

// Función para crear tablas
function crearTablas() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Client (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                rut TEXT NOT NULL UNIQUE,
                salary REAL,
                savings REAL
            )`, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS Message (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                role TEXT NOT NULL,
                sentAt DATE NOT NULL,
                clientId INTEGER,
                FOREIGN KEY(clientId) REFERENCES Client(id)
            )`, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS Deudas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                institution TEXT NOT NULL,
                amount REAL NOT NULL,
                dueDate DATE NOT NULL,
                clientId INTEGER,
                FOREIGN KEY(clientId) REFERENCES Client(id)
            )`, (err) => {
                if (err) {
                    reject(err);
                } else{
                    resolve();
                }
            });
        });
    });
}

//Función para insertar datos de prueba
function insertarDatosDePrueba() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Insertar en Client
            db.get("SELECT id FROM Client LIMIT 1", (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    const clientes = [
                        { name: "Juan Pérez", rut: "12345678-9", salary: 1500.00, savings: 5000.00 },
                        { name: "María López", rut: "98765432-1", salary: 2000.00, savings: 3500.00 },
                        { name: "Carlos Gómez", rut: "11223344-5", salary: 1800.00, savings: 4500.00 }
                    ];
                    clientes.forEach(cliente => {
                        db.run('INSERT OR IGNORE INTO Client (name, rut, salary, savings) VALUES (?, ?, ?, ?)', [cliente.name, cliente.rut, cliente.salary, cliente.savings]);
                    });
                }
            });

            // Insertar en Message

            db.get("SELECT text FROM Message LIMIT 1", (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    const mensajes = [
                        { text: "¿Está disponible la propiedad?", role: "cliente", sentAt: "2023-03-01", clientId: 1 },
                        { text: "Sí, la propiedad está disponible.", role: "agente", sentAt: "2023-03-02", clientId: 1 },
                        { text: "Me gustaría agendar una visita.", role: "cliente", sentAt: "2023-03-03", clientId: 2 }
                    ];
                    mensajes.forEach(mensaje => {
                        db.run('INSERT INTO Message (text, role, sentAt, clientId) VALUES (?, ?, ?, ?)', [mensaje.text, mensaje.role, mensaje.sentAt, mensaje.clientId]);
                    });
                }
            });

            // Insertar en Deudas
            db.get("SELECT institution FROM Deudas LIMIT 1", (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    const deudas = [
                        {institution:"Banco Estado", amount: 10000.00, dueDate: "2023-06-01", clientId:1},
                        {institution:"Caja Los Andes", amount: 5000.00, dueDate: "2023-07-15", clientId:2},
                        {institution:"Banco Santander", amount: 8000.00, dueDate: "2023-08-10", clientId:3}
                    ]
                    deudas.forEach(deuda => {
                        db.run('INSERT INTO Deudas (institution, amount, dueDate, clientId) VALUES (?, ?, ?, ?)', [deuda.institution, deuda.amount, deuda.dueDate, deuda.clientId]);
                    });
                } else{
                    resolve();
                }
            });
        });
    });
}

//ejecución de función de inicializar datos
inicializarBaseDeDatos();


module.exports = db;