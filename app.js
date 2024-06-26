const cors = require('cors')
const {getTopics, getEndpoints} = require('./controllers/topics.controllers')
const {getArticleById, getArticles, patchArticleVote} = require('./controllers/articles.controllers')
const {getCommentsByArticleId, postComment, deleteComment} = require('./controllers/comments.controllers')
const express = require('express');
const app = express();
app.use(cors())
app.use(express.json())


app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticleVote)

app.delete('/api/comments/:comment_id', deleteComment)

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