const db = require('../db/database.js')

class Messages {
    //Método para añadir mensajes dado un cliente Id
    static addMessages(messages, clientId){
        return new Promise((resolve, reject) => {
            messages.forEach(message => {
                //Query para añadir los mensajes dentro de la tabla Message
                const sql = `INSERT INTO Message (text, role, sentAt, clientId) VALUES (?, ?, ?, ?)`;
                db.run(sql, [message.text, message.role, message.sentAt, clientId], function(err) {
                if (err) {
                    db.run('ROLLBACK;'); //En caso de ocurrir un error se revierte el proceso de inserción.
                    return reject(err);
                } else {
                    resolve(this.lastID); // Retorna el id del cliente insertado
                }
                });
            });
        });
    }
}

module.exports = Messages;