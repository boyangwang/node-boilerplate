const express = require('express');
const path = require('path');
const config = require('./config.js');
const logger = require('winston');
const packageJson = require('../package.json');

const publicDirectoryPath = path.join(__dirname, '../public');
const app = module.exports = express();
app.use(express.static(publicDirectoryPath));
app.get('/js/babel-polyfill.min.js', (req, res) => {
    res.status(200).contentType('application/javascript').sendFile(path.join(
        __dirname, '../node_modules/babel-polyfill/dist/polyfill.min.js'));
});
app.use((req, res) => {
    res.status(404).contentType('text/plain').send('Not found');
});
app.server = app.listen(config.port, () => logger.info(`${packageJson.name} server listening on ${config.port}...`));
