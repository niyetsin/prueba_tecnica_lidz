const express = require('express');
const router = express.Router();
const Client = require("../../models/Client");
const Score = require("../../models/Score");

// Ruta base
router.get('/', (req, res) => {
    // Lógica para obtener y devolver todos los clientes
    res.json({"message": "Bienvenido"});
});

// Ruta para obtener todos los clientes
router.get('/clients', (req, res) => {
    Client.getAllClients((err, clients)=>{
        if (err) {
            res.status(500).send(err.message);
        }
        if (clients === null) {
            res.status(404).send("Cliente no encontrado");
        }
        else{
            res.json(clients);
        }
    });
});

// Ruta para obtener información de un cliente específico
router.get('/clients/:id', (req, res) => {

    const id = req.params.id;

    Client.getClientById(id, (err, clientInfo)=>{
        if (err) {
            res.status(500).send(err.message);
        }
        if (clientInfo === null) {
            res.status(404).send("Cliente no encontrado");
        }
        else{
            res.json(clientInfo);
        }
    });
});

// Ruta para obtener información de los clientes que el último mensaje haya sido hace más de 7 días
router.get('/clients-to-do-follow-up', (req, res) => {
    Client.getClientsToDoFollowUp((err, clients)=>{
        if (err) {
            res.status(500).send(err.message);
        }
        if (clients === null) {
            res.status(404).send("No existen resultados");
        }
        else{
            res.json(clients);
        }
    });
});

// Ruta para crear un nuevo cliente junto con sus mensajes y deudas.
router.post('/clients/', async (req, res) => {
    const {name, rut, salary, savings, messages, debts} = req.body;

    try {
        const clientId = await Client.addClientWithTransaction({name,rut,salary,savings},messages,debts);
        res.status(201).send({"status": "Cliente creado con Id: ", clientId});
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(409).send('Un cliente con el mismo RUT ya existe.');
        } else {
            res.status(500).send('Error al procesar la solicitud.');
        }
    }
});

// Ruta para obtener puntaje de un cliente en específico
router.get('/clients/:id/score', async (req, res) => {

    try {
        const id = req.params.id;
        Client.getClientById(id, async (err, clientInfo) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (clientInfo === null) {
                return res.status(404).send("Cliente no encontrado");
            }
            else {
                const score = await Score.getClientScoreById(clientInfo);
                res.json({"score": score});
            }
        });
    } catch (error) {
        res.status(500).send("Error al procesar la solicitud");
    }
});

router.get('/clients/:id/complex-score', async (req, res) => {

    try {
        const id = req.params.id;
        Client.getClientById(id, async (err, clientInfo) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (clientInfo === null) {
                return res.status(404).send("Cliente no encontrado");
            }
            else {
                const puntajes = await Score.getClientComplexScoreById(clientInfo);
                res.json(puntajes);
            }
        });
    } catch (error) {
        res.status(500).send("Error al procesar la solicitud");
    }
});

module.exports = router;
