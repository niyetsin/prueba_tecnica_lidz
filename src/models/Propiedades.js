const db = require('../db/database.js')

class Propiedad {
    //Método para obtener todas los prodiedades que el cliente está interesado dada un ClientId
    static async getPropiedadesByClientId(clientId) {
        return new Promise((resolve, reject) => {
            //Query para obtener la información de las propiedades que está interesado un cliente por su Id
            const sql = `SELECT pro.* FROM Property pro INNER JOIN ClientProperty clientP ON p.id = clientP.propertyId WHERE clientP.clientId = ?`;
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