const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");
const articleTestData = require("../db/data/test-data/articles");

describe("formatDates", () => {
  const actual = formatDates(articleTestData);
  it("returns an array of article objects", () => {
    for (let article of actual) {
      expect(article).to.be.an("object");
    }
  });
  it("returns array of acrticle objs with a dates key", () => {
    for (let element of actual) {
      expect(element.created_at).to.be.instanceof(Date);
    }
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
