const {
    fetchTopics,
    selectArticleById,
    updateVoteCount,
    fetchUsers
} = require("../models/model");

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

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status !== undefined) {
      console.log(err)
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };

  exports.unhandledErrorHandler = (err, req, res, next) => {
    console.log(err, "<----- unhandled error");
    res.status(500).send(err);
  };

  exports.updateArticle = (req, res, next) => {
    const { article_id } = req.params;
    // if (req.params.inc_votes === undefined) {
    //   res.status(400).send("No inc_votes value")
    // }
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