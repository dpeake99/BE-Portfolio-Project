const express = require('express');

const {
    getTopics,
    getArticleById,
    customErrorHandler,
    unhandledErrorHandler
} = require("./controllers/controller");

const app = express()

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleById)

app.use(customErrorHandler);
app.use(unhandledErrorHandler);

module.exports = app;