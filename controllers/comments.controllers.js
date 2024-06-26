const { selectCommentsByArticleId, insertComment, selectCommentToDelete} = require('../models/comments.models')

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const {author, body} = req.body
    insertComment(article_id, author, body).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}
exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
   selectCommentToDelete(comment_id).then(() => {
    res.status(204).send()
   })
   .catch(next) 
}