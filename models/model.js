const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => result.rows )
};

exports.selectArticleById = (article_id) => {
    if (/[^\d]/gi.test(article_id)) {
        return Promise.reject(({status: 400, msg: "Invalid article_id"}))
    }
    return db.query('SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles JOIN comments on articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id', [article_id])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Article not found"})
        } else return result.rows[0];
    })
}

exports.updateVoteCount = (article_id, inc_votes) => {
    if (/[^\d]/gi.test(article_id)) {
        return Promise.reject(({status: 400, msg: "Invalid article_id"}))
    }
    if (/[^\d]/gi.test(inc_votes)) {
        return Promise.reject(({status: 400, msg: "Invalid inc_votes value"}))
    }
    return db.query("UPDATE articles SET votes = votes + $2 WHERE article_id =$1 RETURNING *", [article_id, inc_votes])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Article not found"})
        } else return result.rows[0];
    })
}

exports.fetchUsers = () => {
    return db.query("SELECT * FROM users").then((result) => result.rows)
};