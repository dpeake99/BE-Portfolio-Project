const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => result.rows )
};

exports.selectArticleById = (article_id) => {
    if (/[^\d]/gi.test(article_id)) {
        return Promise.reject(({status: 400, msg: "Invalid article_id"}))
    }
    return db.query('SELECT * FROM articles WHERE article_id =$1', [article_id])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Article not found"})
        } else return result.rows[0];
    })
}

exports.updateVoteCount = (article_id, inc_votes) => {
    return db.query("UPDATE articles SET votes = votes + $2 WHERE article_id =$1 RETURNING *", [article_id, inc_votes])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 400, msg: "Invalid article_id"})
        } else return result.rows[0];
    })
}