const {getTopics, getEndpoints} = require('./controllers/topics.controllers')
const {getArticleById, getArticles} = require('./controllers/articles.controllers')
const {getCommentsByArticleId, postComment} = require('./controllers/comments.controllers')
const express = require('express');
const app = express();
app.use(express.json())


app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    else if(err.code === '22P02') {
        res.status(400).send({msg: "Bad Request"})
    }
})

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'})
})

module.exports = app;