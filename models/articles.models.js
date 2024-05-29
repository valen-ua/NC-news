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
