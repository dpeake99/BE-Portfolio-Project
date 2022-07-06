  exports.unhandledErrorHandler = (err, req, res, next) => {
    console.log(err, "<----- unhandled error");
    res.status(500).send(err);
  };

  exports.customErrorHandler = (err, req, res, next) => {
    if (err.status !== undefined) {
      console.log(err)
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };