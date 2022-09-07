const { response } = require("../app")
const {
    selectCategories,
    selectReviewById
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
            console.log("in here")
            response.status(200).send({review})
        })
        .catch((error)=>{
            console.log("in catch block")
            next(error)
        })
}