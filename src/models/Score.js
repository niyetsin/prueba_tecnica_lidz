const db = require('../db/database.js'); 
const Deudas = require('./Deudas.js');

class Score{
    static async getClientScoreById(clientInfo) {
        const cliente = clientInfo.client;
        const mensajes = clientInfo.messages;
        const deudas = clientInfo.debts;
        
        const diasPeorMora = await Deudas.getWorstDebtByClientId(cliente.id);

        // Suma el total de todas las deudas
        const totalDeudas = deudas.reduce((total, deuda) => total + deuda.amount, 0);

        const puntajeBase = 20;
        const factorSalario = 0.000006;
        const factorAhorrosDeudas = 0.000003;
        let PuntajeMoroso = 0;
        let factorMensajes = 0.3;
        const cantidadMensajes = mensajes.length;

        if (diasPeorMora > 60) {
            PuntajeMoroso = 20;
        }
        else if (diasPeorMora > 30) {
            PuntajeMoroso = 15;
        }

        if (cantidadMensajes >= 10) {
            factorMensajes = 0.8;
        }

        const puntaje = puntajeBase + 
                        (factorSalario * cliente.salary) + 
                        (factorAhorrosDeudas * cliente.savings) - 
                        (factorAhorrosDeudas * totalDeudas) + 
                        (factorMensajes * cantidadMensajes);
                        
        return Math.max(0, Math.min(puntaje, 100));
    }

    static getClientComplexScoreById(clientInfo){
        let score = 0;   
    }
}

module.exports = Score;