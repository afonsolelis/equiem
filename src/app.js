const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api/v1', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => res.json(swaggerSpec));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
