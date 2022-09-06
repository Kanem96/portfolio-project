const db = require("../db/connection")

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then(({rows})=>{
            return rows
        })
}

exports.selectReviewById = (reviewId) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1', [reviewId])
        .then(({rows})=>{
            return rows
        })
    }
