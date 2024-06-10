const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {return Promise.reject({status: 404, msg: 'Not Found'})}
        else {return db
            .query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;', [article_id])
            .then(({rows}) => {
                if(rows.length === 0) {return []}
                return rows
            })
        }
    })
}

exports.insertComment = (article_id, author, body) => {
    if(!author || !body) {return Promise.reject ({status: 400, msg: "Bad Request"})}
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({rows}) => {
        if(rows.length === 0) {return Promise.reject({status: 404, msg: "Not Found"})}
        else {return db
            .query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING author, body;', [author, body, article_id])
            .then(({rows}) => {
                const comment = rows[0]
                return comment
            })}
    })
    }
    
 exports.selectCommentToDelete = (comment_id) => {
    if (isNaN(Number(comment_id))) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id]).then(({rows})  => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Comment not found'})
        }
    })
 }   
    
    

   
