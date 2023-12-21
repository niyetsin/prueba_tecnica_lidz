const db = require('../db/database.js')

class Deudas {
    //Método para insertar todas las deudas asociadas al cliente por su Id
    static addDebts(debts, clientId){
        return new Promise((resolve, reject) => {
            debts.forEach(debt => {
                //Query para insertar la información de todas las deudas
                const sql = `INSERT INTO Deudas (institution, amount, dueDate, clientId) VALUES (?, ?, ?, ?)`;
                db.run(sql, [debt.institution, debt.amount, debt.dueDate, clientId], function(err) {
                if (err) {
                    db.run('ROLLBACK;');   //En caso de encontrar un error, se revierte proceso
                    return reject(err);
                } else {
                    resolve(this.lastID); // Retorna el id del cliente insertado
                }
            });
            });
        });
    }

    //Método para obtener la cantidad de días de su máxima mora dada por el cliente Id
    static async getWorstDebtByClientId(clientId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT clientId, MAX(julianday('now') - julianday(dueDate)) as DiasDeMora FROM Deudas WHERE clientId = ? AND julianday('now') - julianday(dueDate) > 0 GROUP BY clientId;`;
            db.get(sql, [clientId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.DiasDeMora : 0); //Retorna la cantidad de días de su máxima deuda morosa
                }
            });
        });
    }
}

module.exports = Deudas;