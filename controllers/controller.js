const {
    fetchTopics,
    selectArticleById
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
