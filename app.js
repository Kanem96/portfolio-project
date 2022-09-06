const express = require("express");
const {
    getCategories,
    getReviewById
} = require("./controllers/controllers");

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewById);

app.all("*", (request, response)=>{
    response.status(404).send({status: 404, msg: "Not Found"})
})

app.use((error, request, response, next)=>{
    if(error.hasOwnProperty("status") && error.hasOwnProperty("msg"))
    response.status(error.status).send({status: error.status, msg: error.msg})
})

app.use((error, request, response, next)=>{
    console.log(error)
    response.status(500).send({ msg: "Internal Server Error"})
})

module.exports = app;
