const { articleData } = require('../db/data/test-data')
const {selectArticleById, selectArticles, selectArticleVote} = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
   const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.patchArticleVote = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    selectArticleVote(inc_votes, article_id).then((article) => {
        res.status(200).send(article)
    })
    .catch(next)
}