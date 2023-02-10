const {
  selectCategories,
  selectReviewById,
  selectUsers,
  updateReviewById,
  insertCommentById,
  deleteCommentById,
  selectReviews,
  selectCommentsByReviewId,
} = require("../models/models");

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviews = (request, response, next) => {
  const { query } = request;
  selectReviews(query)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;
  selectReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  const newComment = request.body;
  insertCommentById(review_id, newComment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => next(error));
};

exports.patchReviewById = (request, response, next) => {
  const { review_id } = request.params;
  const updateInformation = request.body;
  updateReviewById(review_id, updateInformation)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteCommentByCommentId = (request, response, next) => {
  const { comment_id } = request.params;
  deleteCommentById(comment_id)
    .then((comment) => {
      return response.status(comment.status).send(comment.msg);
    })
    .catch((error) => next(error));
};
