process.env.NODE_ENV = "test";

const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");
// const connection = require("../db/connection");
const testData = require("../db/data/index");
const articleTestData = require("../db/data/test-data/articles");
const articleSeedData = [
  {
    article_id: 1,
    title: "Living in the shadow of a great man",
    topic: "mitch",
    author: "butter_bridge",
    body: "I find this existence challenging",
    created_at: 1542284514171,
    votes: 100,
  },
  {
    article_id: 2,
    title: "Sony Vaio; or, The Laptop",
    topic: "mitch",
    author: "icellusedkars",
    body:
      "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
    created_at: 1416140514171,
  },
  {
    article_id: 3,
    title: "Eight pug gifs that remind me of mitch",
    topic: "mitch",
    author: "icellusedkars",
    body: "some gifs",
    created_at: 1289996514171,
  },
];

describe("formatDates", () => {
  const actual = formatDates(testData.articleData);
  it("returns an array of article objects", () => {
    for (let article of actual) {
      expect(article).to.be.an("object");
    }
  });
  it("returns array of article objs with a dates key", () => {
    for (let element of actual) {
      expect(element.created_at).to.be.instanceof(Date);
    }
  });
});

describe("makeRefObj", () => {
  // const formattedTestData = formatDates(testData.articleData);
  const newRefObj = makeRefObj(articleSeedData);
  const refObjLength = articleSeedData.length;

  it("returns an object", () => {
    expect(newRefObj).to.be.an("object");
  });
  it("returns object with all values an article_id", () => {
    let objReturnLength = Object.keys(newRefObj).length;
    // console.log(objReturnLength);
    for (let key in newRefObj) {
      expect(newRefObj[key]).to.be.a("number");
    }
    expect(objReturnLength).to.equal(refObjLength);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    const commentFormatter = formatComments([]);
    expect(commentFormatter).to.eql([]);
  });
  it("returns correct keys & created_at is an instanceof Date", () => {
    const commentFormatter = formatComments(
      [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389,
        },
      ],
      {}
    );
    expect(commentFormatter[0].created_at).to.be.instanceof(Date);
    expect(Object.keys(commentFormatter[0])).to.eql([
      "author",
      "created_at",
      "article_id",
      "body",
      "votes",
    ]);
  });
  it("returns a number for article_id", () => {
    const commentFormatter = formatComments(
      [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389,
        },
      ],
      { "They're not exactly dogs, are they?": 1 }
    );

    // console.log(commentFormatter[0]);
    expect(commentFormatter[0].article_id).to.equal(1);
  });
});
