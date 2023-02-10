const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then(({ rows }) => {
    return rows;
  });
};

exports.selectReviews = (query) => {
  return db
    .query("SELECT * FROM categories")
    .then(({ rows }) => {
      const categories = rows;
      const validCategories = categories.map(
        (category) => (category = category.slug)
      );
      const queryValue = [];
      let conditionStr = "";

      if (query.category) {
        if (!validCategories.includes(query.category)) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        } else {
          conditionStr += ` WHERE category = $1`;
          queryValue.push(query.category);
        }
      }

      let sortStr = "";
      let sortDirection = "ASC";
      if (query.sort_by) {
        if (query.order === "desc") sortDirection = "DESC";
        sortStr = `ORDER BY ${query.sort_by} ${sortDirection}`;
      }

      let queryStr = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
            FROM reviews 
            LEFT JOIN comments ON reviews.review_id = comments.review_id
            ${conditionStr}
            GROUP BY reviews.review_id
            ${sortStr}`;
      return db.query(queryStr, queryValue);
    })
    .then(({ rows }) => {
      const reviews = rows;
      return reviews;
    });
};

exports.selectReviewById = (reviewId) => {
  const validId = /\d+/;
  if (!validId.test(reviewId))
    return Promise.reject({ status: 400, msg: "Bad Request" });

  return db
    .query(
      `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`,
      [reviewId]
    )
    .then(({ rows }) => {
      const review = rows[0];
      if (!review)
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${reviewId}`,
        });
      return rows;
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentById = (reviewId, newComment) => {
  const { username, body } = newComment;
  console.log("in model");
  return db
    .query(
      `INSERT INTO comments (author, body, review_id)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [username, body, reviewId]
    )
    .then(({ rows }) => rows[0]);
};

exports.updateReviewById = (reviewId, updateInformation) => {
  const newVote = updateInformation.inc_votes;
  if (
    Object.keys(updateInformation)[0] !== "inc_votes" ||
    typeof newVote !== "number"
  ) {
    return Promise.reject({ status: 400, msg: `Bad Request` });
  }
  return db
    .query(
      `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *`,
      [newVote, reviewId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentById = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [commentId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return { status: 204, msg: "No Content" };
      }
    });
};

exports.selectCommentsByReviewId = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then(({ rows }) => {
      const reviews = rows;
      if (reviews.length === 0)
        return Promise.reject({
          status: 404,
          msg: `Review ID: ${reviewId} does not exist`,
        });

      return db.query(`SELECT * FROM comments WHERE review_id = $1`, [
        reviewId,
      ]);
    })
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};
