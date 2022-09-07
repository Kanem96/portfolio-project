const db = require("../db/connection")

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then(({rows})=>{
            return rows
        })
}

exports.selectReviewById = (reviewId) => {
    
    const validId = /\d+/
    if (!validId.test(reviewId)) return Promise.reject({ status: 400, msg: "bad request" })

    return db.query('SELECT * FROM reviews WHERE review_id = $1', [reviewId])
        .then(({rows})=>{
            return rows
        })
    }
