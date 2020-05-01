const fs = require("fs");

exports.getEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf8", (err, data) => {
    if (err) console.log(err);
    else {
      res.status(200).send(data);
    }
  });
};
