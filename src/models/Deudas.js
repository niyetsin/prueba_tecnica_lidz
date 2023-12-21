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
    static async getWorstDebtByClientId(clientId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
            clientId, 
            MAX(julianday('now') - julianday(dueDate)) as DiasDeMora
        FROM 
            Deudas
        WHERE 
            clientId = ?
            AND julianday('now') - julianday(dueDate) > 0
        GROUP BY 
            clientId;`;
            db.get(sql, [clientId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.DiasDeMora : 0); // Asegúrate de que este campo coincida con tu consulta SQL
                }
            });
        });
    }
}

module.exports = Deudas;