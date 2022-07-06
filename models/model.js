const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => result.rows )
};

exports.selectArticleById = (article_id) => {
    return db.query('SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles JOIN comments on articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id', [article_id])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Article not found"})
        } else return result.rows[0];
    })
}

exports.updateVoteCount = (article_id, inc_votes) => {
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

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
    if (!["created_at", "titles", "article_id", "votes", "comment_count", "author"].includes(sort_by)){
        return Promise.reject({status: 400, msg: "Invalid Sort Query"})
    }
    if (!['asc', 'desc'].includes(order)){
        return Promise.reject({status: 400, msg: "Invalid Order Query"})
    }
    const values = []
    let text = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`
    if (topic !== undefined){
        values.push(topic)
        text += ` WHERE topic = $1`
    }
    text += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
    console.log(text, values)
    return db.query(text, values)
    .then((result) => result.rows)
}

exports.fetchArticleComments = (article_id) => {
    return db.query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 404, msg: "There are no comments for the requested article"})
        } else return result.rows;
    })
}

exports.insertComment = (article_id, comment) => {
    const { body, username } = comment
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((result) => {
        if (result.rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Article not found"})
        } else {
                    return db.query("INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *", 
                    [body, username, article_id]).then((result) => result.rows[0])
            }
    }) 
}
