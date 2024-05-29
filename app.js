const {getTopics, getEndpoints} = require('./controllers/topics.controllers')
const express = require('express');
const app = express();


app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'})
})

module.exports = app;