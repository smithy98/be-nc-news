const expect = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  describe("/topics", () => {
    it("Get: 200 - fetches all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          console.log(res);
        });
    });
  });
});
