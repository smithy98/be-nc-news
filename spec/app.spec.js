const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

chai.use(require("chai-sorted"));

process.env.NODE_ENV = "test";

beforeEach(() => {
  return connection.seed.run();
});
after(() => connection.destroy());

describe("app endpoints", () => {
  describe("/api/topics", () => {
    it("GET: 200 - fetches all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            topics: [
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
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
    it("GET: 200 - returns a comment object with correct keys", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.keys(["user"]);
          expect(body.user).to.have.keys(["username", "avatar_url", "name"]);
          expect(body).to.be.eql({
            user: {
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            },
          });
        });
    });
    it.only("GET: 400 - returns with Invalid Request when passed invalid username", () => {
      return request(app)
        .get("/api/users/not-a-username")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
    it("INVALID: 405 - returns with Method not allowed", () => {
      const invalidMethods = ["put", "delete", "post", "patch"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/users/grumpy19")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("/api/articles", () => {
    it("GET: 200 - returns object with an array of article objects", () => {
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
    it("GET: 200 -  returns with correct default sort_by (date)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("created_at");
        });
    });
    it("GET: 200 - returns with correct sort_by and order params", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.ascendingBy("article_id");
        });
    });
    it("GET: 200 - return with filter array with sort by author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("author");
        });
    });
    it("GET: 200 - returns with filtered array from topic query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article.topic).to.equal("cats");
          });
        });
    });
    it("GET: 404 - returns with Path Not Found when topic query invalid", () => {
      return request(app)
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.be.equal("Path Not Found");
        });
    });
    it("GET: 200 - returns with empty array from topic who has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).to.eql({});
          });
        });
    });
    it("GET: 200 - returns with filtered array from author query", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article.author).to.equal("rogersop");
          });
        });
    });
    it("GET: 200 - returns with empty array from author who has no articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).to.eql({});
          });
        });
    });
    it("GET: 404 - returns with Path Not Found when author query invalid", () => {
      return request(app)
        .get("/api/articles?author=not-an-author")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.be.equal("Path Not Found");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET: 200 - returns an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            comment_count: "13",
          });
        });
    });
    it("PATCH: 200 - modifies the data base and returns object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(101);
        });
    });
    it("PATCH: 400 - returns invalid request when no body is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Body");
        });
    });
    // it("PATCH: 400 - returns Invalid Request when the username in the body is invalid", () => {
    //   return request(app)
    //     .patch("/api/articles/1")
    //     .send()
    //     .expect(400)
    //     .then(({ body }) => {
    //       expect(body.msg).to.equal("Invalid Request");
    //     });
    // }) // PATCH `/api/articles/1` - invalid username
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
    it("GET: 404 - returns an error with Path Not Found Msg when article_id is invalid", () => {
      return request(app)
        .get("/api/articles/34567")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Path Not Found");
        });
    });
    it("GET: 404 - returns an error with Path Not Found when string is passed for id", () => {
      return request(app)
        .get("/api/articles/dog")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Path Not Found");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("POST: 201 - add a comment to a article id", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "its good",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.article_id).to.equal(1);
          expect(body.comment.author).to.equal("rogersop");
          expect(body.comment.body).to.equal("its good");
          expect(body.comment.comment_id).to.equal(19);
        });
    });
    it("POST: 404 - error when article_id is invalid", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({
          username: "tickle122",
          body: "its good",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Path Not Found");
        });
    });
    it("POST: 400 - Invalid Request error when all keys are not present", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "its good",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
    it("POST: 400 - Invalid Request error when article_id is invalid", () => {
      return request(app)
        .post("/api/articles/not-a-valid-id/comments")
        .send({
          username: "tickle122",
          body: "jjjj",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
    it("GET: 200 - returns an array of comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          for (let comment of comments) {
            expect(comment).to.be.an("object");
            expect(comment.article_id).to.equal(1);
          }
          expect(comments).to.descendingBy("created_at");
        });
    });
    it("GET: 404 - returns an error when the article id does not exist", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Path Not Found");
        });
    });
    it("GET: 400 - returns an Invalid Request error when invalid article id is passed", () => {
      return request(app)
        .get("/api/articles/not-a-valid-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
    it("GET: 200 - returns an array of comment objects sorted by default(created_at)", () => {
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
    it("GET: 200 - returns an array of comment objects sorted by comment_id", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("comment_id");
        });
    });
    it("GET: 200 - returns an array of comment objects sorted by comment_id in ascending order ", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.ascendingBy("comment_id");
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
  describe("/api/comments/:comment_id", () => {
    it("PATCH: 200 - returns the comment object", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: 4,
        })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(20);
        });
    });
    it("PATCH: 404 - returns error Path Not Found when id does not exist", () => {
      return request(app)
        .patch("/api/comments/1000")
        .send({
          inc_votes: 4,
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Path Not Found");
        });
    });
    it("PATCH: 400 - returns error Invalid Request when invalid id is passed", () => {
      return request(app)
        .patch("/api/comments/not-a-valid-id")
        .send({
          inc_votes: 4,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
    it("PATCH: 400 - returns Invalid Request when body contains invalid inc_votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body: { comment } }) => {
          expect(comment).to.eql({
            comment_id: 1,
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: "butter_bridge",
            votes: 16,
            created_at: 1511354163389,
          });
        });
    });
    it("PATCH: 200 - returns unchanged comment obj when no inc_votes is passed", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: "invalid_vote",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
    it("DELETE: 204 - returns a 204 status code", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.body).to.eql({});
        });
    });
    it("DELETE: 204 - checks the comment has been deleted", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          return connection("comments")
            .select("comment_id")
            .where("comment_id", 1)
            .then((comment) => {
              expect(comment).to.eql([]);
            });
        });
    });
    it("DELETE: 404 - returns error when comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/100000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Path Not Found");
        });
    });
    it("DELETE: 400 - returns error Invalid Request when comment_id is invalid", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Request");
        });
    });
  });
  describe("/api", () => {
    it("GET: 200 - returns an object of endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const x = JSON.parse(response.text);
          expect(Object.keys(x)).to.eql([
            "GET /api",
            "GET /api/topics",
            "GET /api/articles",
            "GET /api/users/:username",
            "Get /api/article/:article_id",
            "PATCH /api/article/:article_id",
            "GET /api/:article_id/comments",
          ]);
        });
    });
    it("INVALID: 405 - returns with Method not allowed", () => {
      const invalidMethods = ["put", "delete", "patch"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then((res) => {
            expect(res.body.msg).to.eql("Method Not Allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("non existent paths", () => {
    it("GET: 404 - /api/{non existent path} returns a correct error ", () => {
      return request(app)
        .get("/api/non-existent-paths")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.be.equal("Path Not Found");
        });
    });
  });
});
