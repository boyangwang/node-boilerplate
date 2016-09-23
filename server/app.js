const express = require('express');
const path = require('path');
const config = require('./config.js');
const package = require('./package.json');

const publicDirectoryPath = path.join(__dirname, '../public');
const app = module.exports = express();
app.use(express.static(publicDirectoryPath));
app.use((req, res) => {
    res.status(404).contentType('text/plain').send('Not found');
});
app.server = app.listen(config.port, () => console.log(` server listening on ${config.port}...`));
