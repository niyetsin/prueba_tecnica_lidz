const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require("../db/database");

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);


app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
//Routes
app.use(require('./routes/router'));


//Inicio servidor
app.listen(app.get('port'), ()=> {
    console.log(`Server activado en puerto ${app.get('port')}`)
})


//Manejo conexión base de datos
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Base de datos cerrada debido a la finalización del servidor');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    db.close(() => {
        console.log('Base de datos cerrada debido a la finalización del servidor');
        process.exit(0);
    });
});