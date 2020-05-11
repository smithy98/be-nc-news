exports.handle405s = (req, res) => {
  // console.log(req.next);
  // console.log(Object.keys(req));
  const err405 = { status: 405, msg: "Method Not Allowed" };
  res.status(405).send(err405);
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

// handleCustom - using the error passed into next for a reusable func

exports.handle404s = (err, req, res, next) => {
  // add conditional logic
  // console.log(err);
  const err404 = { status: 404, msg: "Path Not Found" };
  res.status(404).send(err404);
};

exports.handle400s = (err, req, res, next) => {
  const err400 = { status: 400, msg: "Invalid Request" };
  res.status(400).send(err400);
};
