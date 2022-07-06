const {
    fetchTopics,
    selectArticleById,
    updateVoteCount,
    fetchUsers,
    fetchArticles,
    fetchArticleComments,
    insertComment,
    removeComment
} = require("../models/model");

const endpoints = require("../endpoints.json")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    }).catch((err) => next(err));
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch((err) => next(err))
}

exports.updateArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateVoteCount(article_id, inc_votes).then((article) => {
        res.status(201).send({article})
    }).catch((err) => next(err))
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
      res.status(200).send(users)
    }) .catch((err) => next(err))
}

exports.getArticles = (req, res, next) => {
  let {sort_by, order, topic} = req.query
    fetchArticles(sort_by, order, topic).then((articles) => {
      res.status(200).send(articles)
    }).catch((err) => next(err))
}  

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleComments(article_id).then((comments) => {
      res.status(200).send(comments)
    }).catch((err) => next(err))
}

exports.postNewComment = (req, res, next) => {
    const { article_id } = req.params
    const comment  = req.body
    if (comment.username === undefined || comment.body === undefined){
      res.status(400).send({msg: "Passed invalid body"})
    }
    insertComment(article_id, comment).then((newComment) => {
      res.status(201).send({newComment})
    }).catch((err) => next(err))
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;
  removeComment(comment_id).then(() => {
    res.status(204).end()
  }).catch((err) => next(err))
}

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints)
}