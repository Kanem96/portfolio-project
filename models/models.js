const db = require("../db/connection")

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then(({rows})=>{
            return rows
        })
}

exports.selectReviews = (query) => {
    const validCategories = ["euro game", "social deduction", "dexterity", "children's games"]
    const queryValue = [];
    let conditionStr = ""

    if (query.category) {
        if (!validCategories.includes(query.category)) {
            return Promise.reject({status: 400, msg: 'Bad Request'})
        } else {
            conditionStr += ` WHERE category = $1`
            queryValue.push(query.category)
        }
    }

    let queryStr = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    ${conditionStr}
    GROUP BY reviews.review_id`

    return db.query(queryStr, queryValue)
        .then(({rows}) => {
            const reviews = rows
            return reviews
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