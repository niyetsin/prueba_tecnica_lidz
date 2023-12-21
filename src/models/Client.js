const db = require('../db/database.js')
const Messages = require("./Message");
const Deudas = require("./Deudas");

class Client {
    //Método para obtener todos los clientes
    static getAllClients(callback){
    //Query para obtener información de todos los clientes    
    db.all("SELECT * FROM Client", function(err, rows){
        if (err){
            return callback(err, null); //error en obtención de información de clientes
        }
        if (rows) {
            return callback(err, rows); //retorna información de clientes
        }
        else{
            return callback(null,null); //no se encuentra informacion de clientes
        }
    })
    };

    //Método para obtener un cliente con una id en específico
    static getClientById(id, callback) {
        //Query para obtener informacion de cliente según su Id
        db.get("SELECT * FROM Client WHERE id = ?", [id], function(err, client) {
            if (err) {
                return callback(err, null);
            }
            if (client) {
                // Obtener mensajes del cliente según su Id
                db.all("SELECT * FROM Message WHERE clientId = ?", [id], function(err, messages) {
                    if (err) {
                        return callback(err, null);
                    }
                    // Obtener deudas del cliente según su Id
                    db.all("SELECT * FROM Deudas WHERE clientId = ?", [id], function(err, debts) {
                        if (err) {
                            return callback(err, null);
                        }
                        // Combinar la información del cliente, mensajes y deudas
                        const clientData = {client,messages,debts};
                        callback(null, clientData);
                    });
                });
            } else {
                callback(null, null); // Cliente no encontrado
            }
        });
    }

    //Método para obtener los clientes cuyo último mensaje haya sido hace más de 7 días
    static getClientsToDoFollowUp(callback){
        //Query para obtener listado de todos los clientes cuyos últimos mensajes hayan sido hace mas de 7 días
        db.all("SELECT Client.* FROM Client JOIN ( SELECT clientId, MAX(date(sentAt)) as LastMessageDate FROM Message GROUP BY clientId ) as LastMessages ON Client.id = LastMessages.clientId WHERE date(LastMessages.LastMessageDate) < date('now', '-7 days')"
        , function(err, rows){
            if (err) {
                return callback(err, null);
            }
            if (rows) {
                return callback(err, rows);
            }
            else{
                return callback(null,null);
            }
        })
    }

    //Método para añadir datos a la tabla cliente
    static addClient(name, rut, salary, savings) {
        return new Promise((resolve, reject) => {
            //Query para insertar datos a la tabla de clientes
            const sql = `INSERT INTO Client (name, rut, salary, savings) VALUES (?, ?, ?, ?)`;
            db.run(sql, [name, rut, salary, savings], function(err) {
                if (err) {
                    return reject(err);
                } else {
                    resolve(this.lastID); // Retorna el id del cliente insertado
                }
            });
        });
    }

    //Método para procesar la inserción de todos los datos del cliente, mensajes, deudas, etc...
    static addClientWithTransaction(clientData, messages, debts) {
        return new Promise((resolve, reject) => {
            db.serialize(async () => {
                db.run('BEGIN TRANSACTION;');
    
                try {
                    const clientId = await Client.addClient(clientData.name, clientData.rut, clientData.salary, clientData.savings);
                    await Messages.addMessages(messages, clientId); //Se agrega la información de mensajes
                    await Deudas.addDebts(debts, clientId); //Se agrega la información de deudas
                    
                    db.run('COMMIT;', (err) => {
                        if (err) throw err;
                        resolve(clientId); //Si no se encontraron errores, se ejecuta la transacción de la query
                    });
                } catch (err) {
                    db.run('ROLLBACK;', () => {
                        return reject(err); //En caso de algún error se cancela la query y se revierte el proceso de inserción
                    });
                }
            });
        });
    }
}

module.exports = Client;