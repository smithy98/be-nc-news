exports.handle405s = (req, res) => {
  const err405 = { status: 405, msg: "Method Not Allowed" };
  res.status(405).send(err405);
};

exports.handle404s = (req, res) => {
  const err404 = { status: 404, msg: "Path Not Found" };
  res.status(404).send(err404);
};

exports.handlePSQLError = (err, req, res, next) => {
  const errCodes = {
    42703: { status: 400, msg: "Column Not Found" },
  };

  if (err.code) {
    if (err.code in errCodes) {
      const { status, msg } = errCodes[err.code];
      res.status(status).send({ msg });
    }
  } else {
    next(err);
  }
};

exports.handle400s = (err, req, res, next) => {
  const err400 = { status: 400, msg: "Invalid Request" };
  res.status(400).send(err400);
};
