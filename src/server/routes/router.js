const express = require('express');
const router = express.Router();
const Client = require("../../models/Client");

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

    Client.getClientById(id, (err, client)=>{
        if (err) {
            res.status(500).send(err.message);
        }
        if (client === null) {
            res.status(404).send("Cliente no encontrado");
        }
        else{
            res.json(client);
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
        res.status(201).send('Cliente añadido con id:', clientId);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(409).send('Un cliente con el mismo RUT ya existe.');
        } else {
            res.status(500).send('Error al procesar la solicitud.');
        }
    }
});

// Ruta para obtener puntaje de un cliente en específico
router.get('/clients/:id/score', (req, res) => {
    res.json({"score": "puntaje"});
    // Lógica para obtener estos datos
});

module.exports = router;
