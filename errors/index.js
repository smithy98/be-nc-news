exports.handle405s = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handlePSQLError = (err, req, res, next) => {
  const errCodes = {
    42703: { status: 400, msg: "Column Not Found" },
  };

  if (err.code in errCodes) {
    const { status, msg } = errCodes[err.code];
    res.status(status).send({ msg });
  }
};
