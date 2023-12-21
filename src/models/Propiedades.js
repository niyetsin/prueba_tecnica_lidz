const db = require('../db/database.js')

class Propiedad { 
    static async getPropiedadesByClientId(clientId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.* 
                FROM Property p
                INNER JOIN ClientProperty cp ON p.id = cp.propertyId
                WHERE cp.clientId = ?
            `;

            db.all(sql, [clientId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows); // Devuelve la lista de propiedades
                }
            });
        });
    }
}

module.exports = Propiedad;