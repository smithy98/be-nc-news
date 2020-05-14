process.env.NODE_ENV = "test";

const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
  trimUrl,
} = require("../db/utils/utils");

const connection = require("../db/connection");

describe("formatDates", () => {
  it("returns an array of objects", () => {
    const formattedData = formatDates([
      {
        created_at: 20200414467826,
      },
    ]);
    expect(formattedData).to.be.an("array");
    for (let element of formattedData) {
      expect(element).to.be.an("object");
    }
  });
  it("returns an array of objects with correct keys", () => {
    const formattedData = formatDates([
      {
        name: "billy",
        created_at: 20200414467826,
      },
    ]);
    for (let element of formattedData) {
      expect(element).to.have.all.keys(["created_at", "name"]);
    }
  });
  it("returns an array of objects with created_at correct date format", () => {
    const formattedData = formatDates([
      {
        name: "billy",
        created_at: 20200414467826,
      },
    ]);
    for (let element of formattedData) {
      expect(element.created_at).to.be.instanceOf(Date);
    }
  });
  it("returns an array of article objects with created_at correct date format", () => {
    const formattedData = formatDates([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ]);
    for (let element of formattedData) {
      expect(element.created_at).to.be.instanceOf(Date);
    }
  });
});

describe("makeRefObj", () => {
  it("returns an object", () => {
    const refObj = makeRefObj([{ article_id: 1, title: "A" }]);
    expect(refObj).to.be.an("object");
  });
  it("returns object with keys being all the titles", () => {
    const refObj = makeRefObj([{ article_id: 1, title: "A" }]);
    expect(refObj).to.have.all.keys(["A"]);
  });
  it("returns object with all values to be article_id", () => {
    const refObj = makeRefObj([{ article_id: 1, title: "A" }]);
    expect(refObj.A).to.equal(1);
  });
  it("returns correct object when passed article object", () => {
    const refObj = makeRefObj([
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
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ]);
    expect(refObj).to.eql({
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4,
    });
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    const commentFormatted = formatComments([]);
    expect(commentFormatted).to.eql([]);
  });
  it("returns with correctly renamed keys", () => {
    const commentFormatted = formatComments(
      [
        {
          created_by: "roger",
          belongs_to: "roger",
          created_at: 1542284514171,
          restOfKeys: 3,
        },
      ],
      { roger: 1 }
    );
    expect(commentFormatted[0]).to.have.all.keys([
      "author",
      "article_id",
      "created_at",
      "restOfKeys",
    ]);
  });
  it("returns with created_at as instance of date", () => {
    const commentFormatted = formatComments(
      [
        {
          created_by: "roger",
          belongs_to: "roger",
          created_at: 1542284514171,
          restOfKeys: 3,
        },
      ],
      { roger: 1 }
    );
    expect(commentFormatted[0].created_at).to.be.instanceOf(Date);
  });
});

describe.only("trimUrl", () => {
  it("returns a string if it is a string", () => {
    expect(trimUrl("/url")).to.be.a("string");
  });
  it("returns a number if it is a number", () => {
    expect(trimUrl("/4")).to.be.a("number");
  });
  it("removes / and passes rest", () => {
    expect(trimUrl("/4")).to.equal(4);
    expect(trimUrl("/something")).to.equal("something");
  });
});
