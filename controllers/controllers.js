const {
    selectCategories
} = require("../models/models")

exports.getCategories = (request, response)=>{
    selectCategories()
        .then((categories)=>{
            response.status(200).send({categories})
        })
}