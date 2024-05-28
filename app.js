const {getTopics} = require('./controllers/topics.controllers')
const express = require('express');
const app = express();

app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'})
})

module.exports = app;