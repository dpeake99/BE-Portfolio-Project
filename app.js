const express = require('express');

const {
    getTopics,
    getArticleById,
    customErrorHandler,
    unhandledErrorHandler,
    updateArticle,
} = require("./controllers/controller");

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", updateArticle)

app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;