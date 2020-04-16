const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

beforeEach(() => {
  return connection.seed.run();
});
after(() => connection.destroy());

describe("/api", () => {
  describe("/topics", () => {
    it("Get: 200 - fetches all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            topic: [
              { slug: "coding", description: "Code is love, code is life" },
              { slug: "football", description: "FOOTIE!" },
              {
                slug: "cooking",
                description: "Hey good looking, what you got cooking?",
              },
            ],
          });
        });
    });
  });
  describe("/users", () => {
    it("GET: 200 - returns a comment object with correct keys", () => {
      return request(app)
        .get("/api/users/grumpy19")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.not.be.an("array");
          expect(Object.keys(body)).to.eql(["username", "avatar_url", "name"]);
        });
    });
  });
});
