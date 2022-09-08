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
    const {query} = request.query
    selectReviewById(review_id, query)
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

exports.patchReviewById = (request, response, next) => {
    const {review_id} = request.params
    const updateInformation = request.body
    updateReviewById(review_id, updateInformation)
        .then((review) => {
            response.status(200).send({review})
        })
        .catch((error) => {
            next(error)
        })
}