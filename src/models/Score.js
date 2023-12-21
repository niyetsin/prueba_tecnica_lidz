const db = require('../db/database.js'); 
const Deudas = require('./Deudas.js');
const Propiedad = require('./Propiedades.js');
const Propiedades = require('./Propiedades.js');

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

    static async getClientComplexScoreById(clientInfo){
        // Obtener información del cliente
        const cliente = clientInfo.client;
        const mensajes = clientInfo.messages;
        const deudas = clientInfo.debts;
        const uf = 36000;
        let puntajes = [];


        // Obtener deudas y calcular días de peor mora
        const diasPeorMora = await Deudas.getWorstDebtByClientId(cliente.id);

        // Obtener propiedades interesadas
        const propiedadesInteresadas = await Propiedades.getPropiedadesByClientId(cliente.id);

        // Suma el total de todas las deudas
        const totalDeudas = deudas.reduce((total, deuda) => total + deuda.amount, 0);

        const puntajeBase = 20;
        const factorSalario = 0.000006;
        const factorAhorrosDeudas = 0.000003;
        let PuntajeMoroso = 0;
        let factorMensajes = 0.3;
        let bonoAhorro = -30;
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

        propiedadesInteresadas.forEach(Propiedad => {
            var treinta_por_ciento_valor_propiedad = Propiedad.valueUF * 0.3 * uf;
            //Si cliente cuenta con suficientes ahorros para un crédito hipotecario
            if (treinta_por_ciento_valor_propiedad <= cliente.savings){ 
                bonoAhorro = 30;
            }
            puntajes.push({"PropietyId": Propiedad.id,"score":Math.max(0, Math.min(Math.max(puntajeBase + 
                (factorSalario * cliente.salary) + 
                (factorAhorrosDeudas * cliente.savings) - 
                (factorAhorrosDeudas * totalDeudas) +
                (bonoAhorro)+ 
                (factorMensajes * cantidadMensajes)), 100))})
        });
        
        return puntajes;
        // return Math.max(0, Math.min(Math.max(puntajes["scores"]), 100));
    }
}

module.exports = Score;