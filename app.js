const express = require("express");
const {
    getCategories,
} = require("./controllers/controllers");

const app = express();

app.get('/api/categories', getCategories);

app.all("*", (request, response)=>{
    response.status(404).send({status: 404, msg: "Not Found"})
})

app.use((error, request, response, next)=>{
    if(error.hasOwnProperty("status") && error.hasOwnProperty("msg"))
    response.status(error.status).send({status: error.status, msg: error.msg})
})

app.use((error, request, response, next)=>{
    response.status(500).send({ msg: "this link does not exist"})
})

module.exports = app;
