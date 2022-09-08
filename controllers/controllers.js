const {
    selectCategories,
    selectReviewById,
    selectUsers,
    updateReviewById
} = require("../models/models")

exports.getCategories = (request, response, next)=>{
    selectCategories()
        .then((categories)=>{
            response.status(200).send({categories})
        })
        .catch((error)=>{
            next(error)
        })
}

exports.getReviewById = (request, response, next) =>{
    const {review_id} = request.params 
    selectReviewById(review_id)
        .then((review)=>{
            response.status(200).send({review})
        })
        .catch((error)=>{
            next(error)
        })
}

exports.getUsers = (request, response, next) => {
    selectUsers()
        .then((users)=>{
            response.status(200).send({users})
        })
        .catch((error)=>{
            next(error)
        })
}

exports.patchReviewById = (request, response) => {
    const {review_id} = request.params
    const {inc_votes} = request.body
    updateReviewById(review_id, inc_votes)
        .then((review) => {
            response.status(200).send({review})
        })
}