const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

chai.use(require("chai-sorted"));

beforeEach(() => {
  return connection.seed.run();
});
after(() => connection.destroy());

describe("app endpoints", () => {
  describe("/api/topics", () => {
    it("Get: 200 - fetches all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            topics: [
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
    it("INVALID: 405 - returns with Method not allowed", () => {
      const invalidMethods = ["put", "delete", "patch", "post"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then((res) => {
            expect(res.body.msg).to.eql("Method Not Allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("/api/users/:username", () => {
    it("GET: /api/users/:username - 200 - returns a comment object with correct keys", () => {
      return request(app)
        .get("/api/users/grumpy19")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.keys(["user"]);
          expect(body.user).to.have.keys(["username", "avatar_url", "name"]);
          expect(body).to.be.eql({
            user: {
              username: "grumpy19",
              avatar_url:
                "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg",
              name: "Paul Grump",
            },
          });
        });
    });
    it("INVALID: 405 - returns with Method not allowed", () => {
      const invalidMethods = ["put", "delete", "post", "patch"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/users/grumpy19")
          .expect(405)
          .then((res) => {
            expect(res.body.msg).to.eql("Method Not Allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("/api/articles", () => {
    it("Get: 200 - returns object with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).to.be.an("array");

          expect(articles[0]).to.have.all.keys([
            "article_id",
            "author",
            "body",
            "created_at",
            "title",
            "topic",
            "votes",
            "comment_count",
          ]);
        });
    });
    it("Get: 200 -  returns with correct default sort_by (date)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at");
        });
    });
    it("GET: 200 - returns with correct sort_by and order_by params", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order_by=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("article_id");
        });
    });
    it("GET: 200 - returns with filtered array from topic query", () => {
      return request(app)
        .get("/api/articles?topic=cooking")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article.topic).to.equal("cooking");
          });
        });
    });
    it("GET: 200 - returns with filtered array from author query", () => {
      return request(app)
        .get("/api/articles?author=jessjelly")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article.author).to.equal("jessjelly");
          });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("Get: 200 - returns an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Running a Node App",
            body:
              "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
            votes: 0,
            topic: "coding",
            author: "jessjelly",
            created_at: "2016-08-18T12:07:52.389Z",
            comment_count: "8",
          });
        });
    });
    it("Patch: 200 - modifies the data base and returns object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(1);
        });
    });
    it("INVALID: 405 - returns with Method not allowed", () => {
      const invalidMethods = ["put", "delete", "post"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.eql("Method Not Allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("Post: 201 - add a comment to a article id", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "tickle122",
          body: "its good",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.article_id).to.equal(1);
          expect(body.comment.author).to.equal("tickle122");
          expect(body.comment.body).to.equal("its good");
          expect(body.comment.comment_id).to.equal(301);
        });
    });
    it("Get: 200 - returns an array of comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          for (let comment of comments) {
            expect(comment).to.be.an("object");
            expect(comment.article_id).to.equal(1);
          }
        });
    });
    it("Get: 200 - returns an array of comment objects sorted by default(created_at)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          let newDateBody = [];
          for (let i = 0; i < body.length; i++) {
            const { ...keys } = body[i];
            newDateBody.push({
              ...keys,
              created_at: Date.parse(body[i].created_at),
            });
          }
          expect(newDateBody).to.be.sortedBy("created_at", "asc");
        });
    });
    it("Get: 200 - returns an array of comment objects sorted by comment_id", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("comment_id", "asc");
        });
    });
    it("Get: 200 - returns an array of comment objects sorted by comment_id in descending order ", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id&order_by")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("comment_id", "asc");
        });
    });
    it("INVALID: 405 - returns with Method not allowed", () => {
      const invalidMethods = ["put", "delete", "patch"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/1/comments")
          .expect(405)
          .then((res) => {
            expect(res.body.msg).to.eql("Method Not Allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe.only("/api/comments/:comment_id", () => {
    it("PATCH: 200 - returns the comment object", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: 4,
        })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(3);
        });
    });
    it("DELETE: 204 - returns a 204 status code", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {});
    });
  });
});
