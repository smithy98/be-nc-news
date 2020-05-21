exports.handle405s = (req, res) => {
  const err405 = { status: 405, msg: "Method Not Allowed" };
  res.status(405).send(err405);
};

exports.handlePSQLError = (err, req, res, next) => {
  const errCodes = {
    42703: { status: 400, msg: "Column Not Found" },
    "22P02": { status: 400, msg: "Invalid Body" },
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

exports.handleCustom = (err, req, res, next) => {
  res.status(err.status).send(err);
};
