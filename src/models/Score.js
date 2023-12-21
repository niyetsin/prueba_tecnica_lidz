const db = require('../db/database.js'); 
const Deudas = require('./Deudas.js');
const Propiedades = require('./Propiedades.js');

class Score{
    //Método para calcular el score simple dados un clientId
    static async getClientScoreById(clientInfo) {
        //Se separa la información obtenida del cliente en diferentes variables
        const cliente = clientInfo.client;
        const mensajes = clientInfo.messages;
        const deudas = clientInfo.debts;
        
        //Se obtiene la mora del cliente de la deuda que deba por más tiempo en días.
        const diasPeorMora = await Deudas.getWorstDebtByClientId(cliente.id);

        // Suma el total de todas las deudas del cliente
        const totalDeudas = deudas.reduce((total, deuda) => total + deuda.amount, 0);

        //Se declaran los factores y puntajes base para calcular el score
        const puntajeBase = 15;
        const factorSalario = 0.000006;
        const factorAhorrosDeudas = 0.000003;

        //puntaje moroso corresponde a la penalización según cantidad de días de su máxima mora
        let PuntajeMoroso = 0;

        //factorMensajes corresponde a el factor el cual se ajusta según la cantidad de mensajes del cliente
        let factorMensajes = 0.3;

        //se obtiene la cantidad de mensajes asociadas al cliente
        const cantidadMensajes = mensajes.length;

        //Si la cantidad de dias de su peor mora es mayor a 60 dias se ajusta el PuntajeMoroso
        if (diasPeorMora > 60) {
            PuntajeMoroso = -20;
        }
        else if (diasPeorMora > 30) {
            PuntajeMoroso = -15;
        }

        //Se verifica si la cantidad de mensajes del cliente son mayor o igual a 10, si cumple, se hace cambio del factorMensajes
        if (cantidadMensajes >= 10) {
            factorMensajes = 0.8;
        }

        //Se calcula el puntaje sumando todos los factores que se consideran para calcular el score
        const puntaje = puntajeBase + 
                        (factorSalario * cliente.salary) + 
                        (factorAhorrosDeudas * cliente.savings) - 
                        (factorAhorrosDeudas * totalDeudas) + (PuntajeMoroso)+
                        (factorMensajes * cantidadMensajes);

        //Se entrega el puntaje que debe estar entre 0 y 100, en caso de que el puntaje se salga de tales valores se entrega 0 o 100 según corresponda.
        return Math.max(0, Math.min(puntaje, 100));
    }

    //Método para calcular el complex score dados un clientId
    static async getClientComplexScoreById(clientInfo){
        //Se separa la información obtenida del cliente en diferentes variables
        const cliente = clientInfo.client;
        const mensajes = clientInfo.messages;
        const deudas = clientInfo.debts;

        //Corresponde a un aproximado de conversión del valor de UF en CLP
        const uf = 36000;

        //Se crea un arreglo de los puntajes para asociarlos a cada propiedad interesada por el cliente
        let puntajes = [];

        // Obtener deudas y calcular días de peor mora
        const diasPeorMora = await Deudas.getWorstDebtByClientId(cliente.id);

        // Obtener propiedades interesadas
        const propiedadesInteresadas = await Propiedades.getPropiedadesByClientId(cliente.id);

        // Suma el total de todas las deudas
        const totalDeudas = deudas.reduce((total, deuda) => total + deuda.amount, 0);

        //Se declaran los factores y puntajes base para calcular el score
        const puntajeBase = 20;
        const factorSalario = 0.000006;
        const factorAhorrosDeudas = 0.000003;

        //puntaje moroso corresponde a la penalización según cantidad de días de su máxima mora
        let PuntajeMoroso = 0;

        //factorMensajes corresponde a el factor el cual se ajusta según la cantidad de mensajes del cliente
        let factorMensajes = 0.3;

        //bonoAhorro corresponde a un puntaje de penalización para indicar que el cliente cumple o no cumple con el 30% 
        //del valor de la propiedad para obtar por un crédito hipotecario
        let bonoAhorro = -30;

        //se obtiene la cantidad de mensajes asociadas al cliente
        const cantidadMensajes = mensajes.length;
    
        //Si la cantidad de dias de su peor mora es mayor a 60 dias se ajusta el PuntajeMoroso
        if (diasPeorMora > 60) {
            PuntajeMoroso = -20;
        }
        else if (diasPeorMora > 30) {
            PuntajeMoroso = -15;
        }

        //Se verifica si la cantidad de mensajes del cliente son mayor o igual a 10, si cumple, se hace cambio del factorMensajes
        if (cantidadMensajes >= 10) {
            factorMensajes = 0.8;
        }

        //Se recorren el listado de propiedades interesadas por el cliente
        //para verificar si el monto ahorrado del cliente cumple con el 30% del valor de la propiedad
        propiedadesInteresadas.forEach(Propiedad => {
            var treinta_por_ciento_valor_propiedad = Propiedad.valueUF * 0.3 * uf;
            //Si cliente cuenta con suficientes ahorros para un crédito hipotecario, se ajusta el valor de bonoAhorro
            if (treinta_por_ciento_valor_propiedad <= cliente.savings){ 
                bonoAhorro = 30;
            }
            //Se agrega el Id de la propiedad interesada por el cliente y su score asociado
            puntajes.push({"PropietyId": Propiedad.id,"score":Math.max(0, Math.min(Math.max(puntajeBase + 
                (factorSalario * cliente.salary) + 
                (factorAhorrosDeudas * cliente.savings) - 
                (factorAhorrosDeudas * totalDeudas) +
                (bonoAhorro)+ (PuntajeMoroso)+
                (factorMensajes * cantidadMensajes)), 100))})
        });
        
        //Se retorna el listado de los score obtenidos para todas las propiedades interesadas por el cliente
        return puntajes;
    }
}

module.exports = Score;