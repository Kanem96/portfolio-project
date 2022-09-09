const express = require("express");
const {
    getCategories,
    getReviewById,
    getUsers,
    patchReviewById,
    getReviews
} = require("./controllers/controllers");

const app = express();

app.use(express.json())

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/users', getUsers);

app.patch('/api/reviews/:review_id', patchReviewById)

app.all("*", (request, response)=>{
    response.status(404).send({status: 404, msg: "Not Found"})
})

app.use((error, request, response, next)=>{
    if(error.status && error.msg) {
        response.status(error.status).send({msg: error.msg})
    }
    else next(error)
})  

app.use((error, request, response, next)=>{
    console.log(error)
    response.status(500).send({ msg: "Internal Server Error"})
})

module.exports = app;
