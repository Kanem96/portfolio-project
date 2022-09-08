const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

beforeEach(() => {
    return seed(data);
})

afterAll(()=>{
    if (db.end) return db.end();
})

describe("GET", ()=>{
    describe("/api/categories", ()=>{
        it("should return status: 200, and an array of category objects with the properties 'slug' and 'description'", ()=>{
            const output = {categories: [
                { slug: 'euro game', description: 'Abstact games that involve little luck' },
                {
                  slug: 'social deduction',
                  description: "Players attempt to uncover each other's hidden role"
                },
                { slug: 'dexterity', description: 'Games involving physical skill' },
                { slug: "children's games", description: 'Games suitable for children' }
              ]}
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body} )=>{
                    expect(body).toEqual(output);
                    body.categories.forEach((category)=>{
                        expect(category).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        )
                    })
                })
        })
    })
    describe("/api/reviews/:review_id", ()=>{
        it("should return status 200, and a review object containing specific properties", ()=>{
            return request(app)
                .get('/api/reviews/1')
                .expect(200)
                .then(({body} )=>{
                    const review = body.review[0]
                    expect(review).toEqual(
                        expect.objectContaining({
                            review_id: 1,
                            title: 'Agricola',
                            designer: 'Uwe Rosenberg',
                            owner: 'mallionaire',
                            review_img_url:
                            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                            review_body: 'Farmyard fun!',
                            category: 'euro game',
                            created_at: expect.any(String),
                            votes: 1
                        })
                    )
                })
        })
    })
    describe("/api/users", ()=>{
        it("should return status: 200, and an array of objects containing specific properties",()=>{
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body})=>{
                    expect(body.users.length).toBeGreaterThan(0)
                    body.users.forEach((user)=>{
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String),
                            })
                        )
                    })
                })
            })
        })
        describe("/api/reviews/:review_id?comment_count", ()=>{
            it("should return status 200, and a review object containing specific properties", ()=>{
                return request(app)
                    .get('/api/reviews/1')
                    .expect(200)
                    .then(({body} )=>{
                        const review = body.review[0]
                        
                    })
            })
        })
})

describe("PATCH", () => {
    describe("/api/reviews/:review_id", () => {
        it("should return status 200, and the updated review", () => {
            const newVote = {
                inc_votes: 50
            }
            return request(app)
                .patch("/api/reviews/1")
                .send(newVote)
                .expect(200)
                .then(({body}) => {
                    expect(body).toEqual(
                        {review: {
                            review_id: 1,
                            title: 'Agricola',
                            designer: 'Uwe Rosenberg',
                            owner: 'mallionaire',
                            review_img_url:
                              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                            review_body: 'Farmyard fun!',
                            category: 'euro game',
                            created_at: expect.any(String),
                            votes: 51
                          }}
                    )
                })
        })
        it("should maintaing previous functionality when review number is a negative", () => {
            const newVote = {
                inc_votes: -50
            }
            return request(app)
                .patch("/api/reviews/1")
                .send(newVote)
                .expect(200)
                .then(({body}) => {
                    expect(body).toEqual(
                        {review: {
                            review_id: 1,
                            title: 'Agricola',
                            designer: 'Uwe Rosenberg',
                            owner: 'mallionaire',
                            review_img_url:
                              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                            review_body: 'Farmyard fun!',
                            category: 'euro game',
                            created_at: expect.any(String),
                            votes: -49
                          }}
                    )
                })
        })
    })
})

describe("Error Handling", ()=>{
    it("should return status 404: Not found when given a path that does not exist", ()=>{
        return request(app)
            .get('/api/not-a-path')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toEqual("Not Found")
            })
    })
    it("should return status 404: No Review Found when given an id that does not exist", ()=>{
        return request(app)
            .get('/api/reviews/9999')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toEqual('No review found for review_id: 9999')
            })
    })
    it("should return status 400: Bad Request when given an invalid path", ()=>{
        return request(app)
            .get('/api/reviews/not-a-review-id')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toEqual('Bad Request')
            })
    })
    it("should return status 400: Bad Request when given an invalid value on the request body property", ()=>{
        const newVote = {
            inc_votes: '50' // Passing string into request body, this should return error
        }
        return request(app)
            .patch('/api/reviews/1')
            .send(newVote)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toEqual('Bad Request')
            })
    })
    it("should return status 400: Bad Request when given an invalid key on the request body property", ()=>{
        const newVote = {
            incVotes: 50 // Passing string into request body, this should return error as the datatype in the db is an INT
        }
        return request(app)
            .patch('/api/reviews/1')
            .send(newVote)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toEqual('Bad Request')
            })
    })
})