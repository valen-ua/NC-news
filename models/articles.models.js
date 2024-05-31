const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        const article = rows[0]
       if (!article) {
        return Promise.reject({status: 404, msg: 'Not Found'})
       }
        return article
    })
}
exports.selectArticles = () => {
    return db
    .query(`SELECT
    article.article_id,
    article.title,
    article.topic,
    article.author,
    article.created_at,
    article.votes,
    article.article_img_url,
    COALESCE (comment.comment_count, 0) AS comment_count
  FROM
    articles article
  LEFT JOIN
    (SELECT article_id, COUNT(*) AS comment_count
     FROM comments
     GROUP BY article_id) AS comment
  ON
    article.article_id = comment.article_id
  ORDER BY
    article.created_at DESC`)
    .then((response) => {
        return response.rows
    })
}

exports.selectArticleVote = (inc_votes, article_id) => {
  if(typeof inc_votes !== 'number') {return Promise.reject({status: 400, msg: 'Bad Request'})}
  return db
  .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING title, topic, author, body, created_at, votes, article_img_url;`, [inc_votes, article_id])
  .then(({rows}) => {
    if(rows.length === 0) {return Promise.reject({status: 404, msg: 'Not Found'})}
    return rows[0]
  })  
}