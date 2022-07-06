const express = require('express');

const {
    getTopics,
    getArticleById,
    updateArticle,
    getUsers,
    getArticles,
    getArticleComments,
    postNewComment,
    deleteComment,
    getEndpoints
} = require("./controllers/controller");

const {
    customErrorHandler,
    unhandledErrorHandler
} = require("./controllers/errorHandling")

const app = express()

app.use(express.json())

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/users", getUsers)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getArticleComments)

app.patch("/api/articles/:article_id", updateArticle)

app.post("/api/articles/:article_id/comments", postNewComment)

app.delete("/api/comments/:comment_id", deleteComment)

app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;