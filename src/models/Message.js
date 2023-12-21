const db = require('../db/database.js')

class Messages {
    static addMessages(messages, clientId){
        return new Promise((resolve, reject) => {
            messages.forEach(message => {

                const sql = `INSERT INTO Message (text, role, sentAt, clientId) VALUES (?, ?, ?, ?)`;
                db.run(sql, [message.text, message.role, message.sentAt, clientId], function(err) {
                if (err) {
                    db.run('ROLLBACK;');
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