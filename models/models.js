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
            const review = rows[0]
            if (!review) {
                return Promise.reject({status: 404, msg: `No review found for review_id: ${reviewId}`})
            }
            return rows
        })
    }

exports.selectUsers = () => { 
    return db.query('SELECT * FROM users')
        .then(({rows})=>{
            return rows;
        })
}
