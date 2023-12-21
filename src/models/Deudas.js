const db = require('../db/database.js')

class Deudas {
    static addDebts(debts, clientId){
        return new Promise((resolve, reject) => {
            debts.forEach(debt => {

                const sql = `INSERT INTO Deudas (institution, amount, dueDate, clientId) VALUES (?, ?, ?, ?)`;
                db.run(sql, [debt.institution, debt.amount, debt.dueDate, clientId], function(err) {
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

module.exports = Deudas;