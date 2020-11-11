const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config')[process.env.NODE_ENV];
const { json, urlencoded } = require('body-parser');
const { connectivity } = require('./db');
const app = express();
const { logger } = require('./middlewares/log');
var normalizedPath = require('path').join(__dirname, 'routes');

app
    .use(cors())
    .use(logger)
    .use(morgan('dev'))
    .use(json({ limit: '3mb', extended: true }))
    .use(urlencoded({ limit: '3mb', extended: true }))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, PATCH');
        next();
    })
    .listen(config.SERVER_PORT, () => {
        var get_connection = connectivity(config);
        get_connection.on('error', (err) => {
            console.error(err);
            process.exit(1);
        });
        get_connection.once('open', () => {
            require('fs')
                .readdirSync(normalizedPath)
                .forEach(file => {
                    require('./routes/' + file)(app);
                });
            console.log(`Server is listening on port ${config.SERVER_PORT}`);
        });
    });
module.exports = app;