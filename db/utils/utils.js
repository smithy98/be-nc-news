exports.formatDates = (list) => {
  return list.map(({ created_at, ...keys }) => {
    const newElement = {
      ...keys,
      created_at: new Date(created_at),
    };
    return newElement;
  });
};

exports.makeRefObj = (list) => {
  let refObj = {};
  for (let i = 0; i < list.length; i++) {
    const article_id = list[i].article_id;
    const name = list[i].title;
    refObj[name] = article_id;
  }
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(({ created_by, belongs_to, created_at, ...keys }) => {
    return {
      author: created_by,
      created_at: new Date(created_at),
      article_id: articleRef[belongs_to],
      ...keys,
    };
  });
};
