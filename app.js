const express = require("express");
const {
    getCategories,
    getReviewById,
    getUsers,
    patchReviewById,
    deleteCommentByCommentId,
    getReviews,
    getCommentsByReviewId,
    postCommentByReviewId
} = require("./controllers/controllers");
const cors = require('cors')
const app = express();

app.use(cors())

app.use(express.json())

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

app.get('/api/users', getUsers);

app.post('/api/reviews/:review_id/comments', postCommentByReviewId);

app.patch('/api/reviews/:review_id', patchReviewById);

app.delete('/api/comments/:comment_id', deleteCommentByCommentId);

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
