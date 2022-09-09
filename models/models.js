const db = require("../db/connection")

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then(({rows})=>{
            return rows
        })
}

exports.selectReviewById = (reviewId) => {
    const validId = /\d+/
    if (!validId.test(reviewId)) return Promise.reject({ status: 400, msg: "Bad Request" })

    return db.query(`
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`
    , [reviewId])
        .then(({rows})=>{
            const review = rows[0]
            console.log(review)
            if (!review) return Promise.reject({status: 404, msg: `No review found for review_id: ${reviewId}`})
            return rows
        })
    }

exports.selectUsers = () => { 
    return db.query('SELECT * FROM users')
        .then(({rows})=>{
            return rows;
        })
}

exports.updateReviewById = (reviewId, updateInformation) => {
    const newVote = updateInformation.inc_votes
    if (Object.keys(updateInformation)[0] !== "inc_votes" || typeof newVote !==  'number') {
        return Promise.reject({status: 400, msg: `Bad Request`})
    }
    return db.query(`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *
    `, [newVote, reviewId])
        .then(({rows}) => {
            return rows[0]
        })
}