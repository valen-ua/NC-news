const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((response) => {
        if (!response) {return Promise.reject({status: 404, msg: 'Not Found'})}
        return response.rows
    })
}

