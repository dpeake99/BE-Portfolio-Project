const express = require('express');

const {
    getTopics,
    getArticleById,
    customErrorHandler,
    unhandledErrorHandler,
    updateArticle,
    getUsers
} = require("./controllers/controller");

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/users", getUsers)

app.patch("/api/articles/:article_id", updateArticle)

app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;