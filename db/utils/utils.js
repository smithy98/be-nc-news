exports.formatDates = (list) => {
  return list.map(({ created_at, ...keys }) => {
    const newList = {
      ...keys,
      created_at: new Date(created_at),
    };
    return newList;
  });
};

exports.makeRefObj = (list) => {
  let newList = {};
  for (let i = 0; i < list.length; i++) {
    const article_id = list[i].article_id;
    const name = list[i].title;
    newList[name] = article_id;
  }
  return newList;
};

exports.formatComments = (comments, articleRef) => {
  // console.log("----->", comments);
  return comments.map(({ created_by, belongs_to, created_at, ...keys }) => {
    return {
      author: created_by,
      created_at: new Date(created_at),
      article_id: articleRef[belongs_to],
      ...keys,
    };
  });
};
